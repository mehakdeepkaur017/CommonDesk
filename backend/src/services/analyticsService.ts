import prisma from "../lib/prisma";
import { redis } from "../lib/redis";

const parseTimeRange = (range: string) => {
  const now = new Date();
  let start = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();
  
  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
    prevStart = new Date(start); prevStart.setDate(prevStart.getDate() - 1);
    prevEnd = new Date(start); prevEnd.setMilliseconds(-1);
  } else if (range === '7d') {
    start.setDate(now.getDate() - 7);
    prevStart = new Date(start); prevStart.setDate(prevStart.getDate() - 7);
    prevEnd = new Date(start); prevEnd.setMilliseconds(-1);
  } else if (range === '30d') {
    start.setDate(now.getDate() - 30);
    prevStart = new Date(start); prevStart.setDate(prevStart.getDate() - 30);
    prevEnd = new Date(start); prevEnd.setMilliseconds(-1);
  } else if (range === 'this_month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  } else if (range === 'this_quarter') {
    const quarter = Math.floor(now.getMonth() / 3);
    start = new Date(now.getFullYear(), quarter * 3, 1);
    prevStart = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
    prevEnd = new Date(now.getFullYear(), quarter * 3, 0);
  } else {
    // all time
    start = new Date(0);
    prevStart = new Date(0);
    prevEnd = new Date(0);
  }
  return { start, now, prevStart, prevEnd };
};

export const getWorkspaceAnalytics = async (workspaceId: string, timeRange: string = '30d') => {
  const cacheKey = `analytics:v3:${workspaceId}:${timeRange}`;
  console.log("Checking redis cache");
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  console.log("Cache miss, parsing time range");
  const { start, now, prevStart, prevEnd } = parseTimeRange(timeRange);
  const dateFilter = timeRange === 'all' ? undefined : { gte: start };
  
  console.log("Starting parallel queries");
  // Parallel Queries
  const [currentMembers, prevMembers] = await Promise.all([
    prisma.membership.count({ where: { workspaceId, joinedAt: { lte: now } } }),
    prisma.membership.count({ where: { workspaceId, joinedAt: { lte: prevEnd } } })
  ]);
  
  const [currentProjects, prevProjects] = await Promise.all([
    prisma.project.count({ where: { workspaceId, createdAt: { lte: now }, archived: false } }),
    prisma.project.count({ where: { workspaceId, createdAt: { lte: prevEnd }, archived: false } })
  ]);
  
  const [currentTasks, prevTasks, currentCompleted, prevCompleted] = await Promise.all([
    prisma.task.count({ where: { workspaceId, createdAt: { lte: now }, archived: false } }),
    prisma.task.count({ where: { workspaceId, createdAt: { lte: prevEnd }, archived: false } }),
    prisma.task.count({ where: { workspaceId, status: 'completed', updatedAt: { lte: now }, archived: false } }),
    prisma.task.count({ where: { workspaceId, status: 'completed', updatedAt: { lte: prevEnd }, archived: false } })
  ]);
  
  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { storageUsedGB: true } });
  
  const calcTrend = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };
  
  const kpis = {
    members: { current: currentMembers, trend: calcTrend(currentMembers, prevMembers) },
    projects: { current: currentProjects, trend: calcTrend(currentProjects, prevProjects) },
    tasks: { current: currentTasks, open: currentTasks - currentCompleted, completed: currentCompleted, trend: calcTrend(currentTasks, prevTasks) },
    storage: { current: workspace?.storageUsedGB || 0, trend: 0 },
  };
  
  // Project Performance (Enhanced with Risk Reasons)
  const projects = await prisma.project.findMany({
    where: { workspaceId, archived: false },
    include: {
      tasks: { where: { archived: false }, select: { id: true, status: true, dueDate: true, estimatedTime: true } },
      members: { select: { userId: true } }
    }
  });
  
  let totalOverdue = 0;
  
  const projectPerformance = projects.map(p => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter(t => t.status === 'completed').length;
    const openTasks = totalTasks - completedTasks;
    const blockedTasks = p.tasks.filter(t => t.status === 'blocked').length;
    const overdueTasks = p.tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed').length;
    totalOverdue += overdueTasks;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    let risk = 'Low';
    let riskReason = 'Project is on track.';
    let suggestedAction = 'None required.';
    let health = 'Good';

    if (overdueTasks > 5 || blockedTasks > 3) {
      risk = 'High';
      health = 'Needs Attention';
      riskReason = `${overdueTasks} tasks are overdue and ${blockedTasks} are blocked.`;
      suggestedAction = 'Review blocked tasks immediately and extend deadlines.';
    } else if (overdueTasks > 0 || blockedTasks > 0) {
      risk = 'Medium';
      riskReason = 'Minor delays detected.';
      suggestedAction = 'Follow up with task assignees.';
    }
    
    if (p.endDate && new Date(p.endDate) < now && completionRate < 100) {
      risk = 'Critical';
      health = 'Critical';
      riskReason = 'Project deadline has passed but work remains incomplete.';
      suggestedAction = 'Hold an urgent alignment meeting.';
    }
    
    return {
      id: p.id,
      name: p.name,
      progress: completionRate,
      openTasks,
      completedTasks,
      blockedTasks,
      overdueTasks,
      membersCount: p.members.length,
      deadline: p.endDate,
      risk,
      riskReason,
      suggestedAction,
      status: completionRate === 100 ? 'Completed' : 'Active',
      health
    };
  });
  
  // Workload & Team Productivity
  const members = await prisma.membership.findMany({
    where: { workspaceId },
    include: {
      user: {
        include: {
          tasksAssigned: { where: { workspaceId, archived: false }, select: { id: true, status: true, dueDate: true, updatedAt: true } },
          activities: { where: { workspaceId }, orderBy: { createdAt: 'desc' }, take: 1, select: { createdAt: true } }
        }
      }
    }
  });
  
  const teamProductivity = members.map(m => {
    const assignedTasks = m.user.tasksAssigned.length;
    const completedTasks = m.user.tasksAssigned.filter(t => t.status === 'completed').length;
    const pendingTasks = assignedTasks - completedTasks;
    const overdueTasks = m.user.tasksAssigned.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed').length;
    const completionRate = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0;
    
    let workload = 'Balanced';
    if (pendingTasks > 15 || overdueTasks > 3) workload = 'Overloaded';
    else if (pendingTasks > 7) workload = 'Busy';
    else if (pendingTasks < 2) workload = 'Underloaded';
    
    const lastActive = m.user.activities[0]?.createdAt || m.joinedAt;
    const daysSinceActive = Math.floor((now.getTime() - new Date(lastActive).getTime()) / (1000 * 3600 * 24));
    
    // Average completion time could be calculated if we tracked start/end accurately. For now we skip or mock.
    
    return {
      id: m.userId,
      name: m.user.name,
      avatarUrl: m.user.avatarUrl,
      assignedTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      lastActive,
      daysSinceActive,
      workload,
      score: completionRate + (completedTasks * 2) - (overdueTasks * 5)
    };
  }).sort((a, b) => b.completedTasks - a.completedTasks);
  
  // Member Activity Monitor (derived from teamProductivity)
  const memberActivityMonitor = teamProductivity.map(m => ({
    id: m.id,
    name: m.name,
    avatarUrl: m.avatarUrl,
    status: m.daysSinceActive > 7 ? 'Inactive' : 'Active',
    lastActive: m.lastActive,
    daysSinceActive: m.daysSinceActive,
    assignedTasks: m.assignedTasks,
    workload: m.workload
  }));

  // Task Analytics
  const taskStatusGroups = await prisma.task.groupBy({
    by: ['status'],
    where: { workspaceId, archived: false, createdAt: dateFilter },
    _count: { _all: true }
  });
  const taskPriorityGroups = await prisma.task.groupBy({
    by: ['priority'],
    where: { workspaceId, archived: false, createdAt: dateFilter },
    _count: { _all: true }
  });
  
  const taskAnalytics = {
    byStatus: taskStatusGroups.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count._all }), {} as Record<string, number>),
    byPriority: taskPriorityGroups.reduce((acc, curr) => ({ ...acc, [curr.priority]: curr._count._all }), {} as Record<string, number>)
  };
  
  // Upcoming Workload (Forecast)
  const allIncompleteTasks = await prisma.task.findMany({
    where: { workspaceId, archived: false, status: { not: 'completed' }, dueDate: { not: null } },
    include: { project: { select: { name: true } }, assignees: { select: { name: true, avatarUrl: true } } },
    orderBy: { dueDate: 'asc' },
    take: 50
  });
  
  const workloadForecast = {
    today: [] as any[],
    next7Days: [] as any[],
    next30Days: [] as any[]
  };

  const upcomingDeadlines = allIncompleteTasks.map(t => {
    const daysLeft = Math.ceil((new Date(t.dueDate!).getTime() - now.getTime()) / (1000 * 3600 * 24));
    let risk = 'Low';
    if (daysLeft < 0) risk = 'Critical';
    else if (daysLeft <= 2) risk = 'High';
    else if (daysLeft <= 7) risk = 'Medium';
    
    const taskData = {
      id: t.id,
      title: t.title,
      project: t.project?.name || 'No Project',
      owner: t.assignees[0]?.name || 'Unassigned',
      ownerAvatar: t.assignees[0]?.avatarUrl || null,
      deadline: t.dueDate,
      daysLeft,
      risk
    };

    if (daysLeft === 0) workloadForecast.today.push(taskData);
    else if (daysLeft > 0 && daysLeft <= 7) workloadForecast.next7Days.push(taskData);
    else if (daysLeft > 7 && daysLeft <= 30) workloadForecast.next30Days.push(taskData);

    return taskData;
  }).slice(0, 10); // Keep only top 10 for the legacy upcoming widget
  
  // Activity Timeline
  const recentActivities = await prisma.activity.findMany({
    where: { workspaceId, createdAt: dateFilter },
    include: { actor: { select: { name: true, avatarUrl: true } }, project: { select: { name: true } }, task: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  
  const activityTimeline = recentActivities.map(a => ({
    id: a.id,
    action: a.action,
    details: a.details,
    actorName: a.actor.name,
    actorAvatar: a.actor.avatarUrl,
    projectName: a.project?.name,
    taskTitle: a.task?.title,
    createdAt: a.createdAt
  }));
  
  // Storage
  const fileGroups = await prisma.attachment.groupBy({
    by: ['format'],
    where: { workspaceId, archived: false, createdAt: dateFilter },
    _sum: { sizeBytes: true },
    _count: { _all: true }
  });
  
  const storageAnalytics = {
    totalFiles: fileGroups.reduce((sum, f) => sum + f._count._all, 0),
    totalBytes: fileGroups.reduce((sum, f) => sum + (f._sum.sizeBytes || 0), 0),
    byType: fileGroups.map(f => ({ format: f.format, count: f._count._all, bytes: f._sum.sizeBytes || 0 }))
  };
  
  // Health Score Algorithm
  let healthScore = 100;
  let healthReasons: string[] = [];
  
  const criticalProjects = projectPerformance.filter(p => p.risk === 'Critical').length;
  const highRiskProjects = projectPerformance.filter(p => p.risk === 'High').length;
  if (criticalProjects > 0) { healthScore -= criticalProjects * 2; healthReasons.push(`${criticalProjects} projects are in critical state.`); }
  if (highRiskProjects > 0) { healthScore -= highRiskProjects * 1; healthReasons.push(`${highRiskProjects} projects are high risk.`); }
  
  const overloadedMembers = teamProductivity.filter(m => m.workload === 'Overloaded').length;
  if (overloadedMembers > 0) { healthScore -= overloadedMembers * 1; healthReasons.push(`${overloadedMembers} team members are overloaded.`); }
  
  if (totalOverdue > 0) { healthScore -= totalOverdue * 0.5; healthReasons.push(`${totalOverdue} tasks are overdue.`); }
  
  healthScore = Math.max(0, Math.floor(healthScore));
  let healthLevel = 'Excellent';
  if (healthScore < 60) healthLevel = 'Critical';
  else if (healthScore < 80) healthLevel = 'Needs Attention';
  else if (healthScore < 90) healthLevel = 'Good';
  
  // Insights Generation
  const insights = [];
  if (totalOverdue > 10) insights.push(`You have ${totalOverdue} overdue tasks. Consider reassigning work or extending deadlines.`);
  const mostProductive = teamProductivity[0];
  if (mostProductive && mostProductive.completedTasks > 0) insights.push(`${mostProductive.name} completed the highest number of tasks (${mostProductive.completedTasks}).`);
  const mostOverloaded = teamProductivity.find(m => m.workload === 'Overloaded');
  if (mostOverloaded) insights.push(`${mostOverloaded.name} is currently overloaded with ${mostOverloaded.pendingTasks} pending tasks.`);
  if (kpis.projects.trend > 0) insights.push(`Project creation is up by ${kpis.projects.trend}% compared to the previous period.`);
  if (insights.length === 0) insights.push("Workspace is operating smoothly. No immediate action required.");

  // Top Performers
  const mostTasksCompleted = [...teamProductivity].filter(m => m.completedTasks > 0).sort((a, b) => b.completedTasks - a.completedTasks)[0];
  const highestCompletionRate = [...teamProductivity].filter(m => m.assignedTasks > 0 && m.completionRate > 0).sort((a, b) => b.completionRate - a.completionRate)[0];
  const mostActiveMember = [...teamProductivity].filter(m => m.daysSinceActive <= 7).sort((a, b) => a.daysSinceActive - b.daysSinceActive)[0];
  const bestProject = [...projectPerformance].filter(p => p.progress > 0).sort((a, b) => b.progress - a.progress)[0];

  const topPerformers = {
    mostTasksCompleted: mostTasksCompleted ? { name: mostTasksCompleted.name, value: `${mostTasksCompleted.completedTasks} Tasks` } : null,
    highestCompletionRate: highestCompletionRate ? { name: highestCompletionRate.name, value: `${highestCompletionRate.completionRate}%` } : null,
    mostActiveMember: mostActiveMember ? { name: mostActiveMember.name, value: 'Active Today' } : null,
    bestProject: bestProject ? { name: bestProject.name, value: `${bestProject.progress}% Done` } : null,
  };

  // Smart Recommendations
  const smartRecommendations = [];
  if (criticalProjects > 0) {
    smartRecommendations.push({
      priority: 'Critical',
      reason: `${criticalProjects} projects have missed their deadlines.`,
      resource: 'Projects',
      suggestedAction: 'Review critical projects and adjust timelines.'
    });
  }
  if (overloadedMembers > 0) {
    smartRecommendations.push({
      priority: 'High',
      reason: `${overloadedMembers} members are overloaded with work.`,
      resource: 'Team',
      suggestedAction: 'Reassign tasks from overloaded members to underloaded members.'
    });
  }
  const inactiveMembers = memberActivityMonitor.filter(m => m.status === 'Inactive');
  if (inactiveMembers.length > 0) {
    smartRecommendations.push({
      priority: 'Medium',
      reason: `${inactiveMembers.length} members have been inactive for over 7 days.`,
      resource: 'Members',
      suggestedAction: 'Follow up with inactive members or suspend their accounts.'
    });
  }
  const pendingDeadlines = workloadForecast.next7Days.length;
  if (pendingDeadlines > 0) {
    smartRecommendations.push({
      priority: 'Medium',
      reason: `${pendingDeadlines} tasks are due in the next 7 days.`,
      resource: 'Tasks',
      suggestedAction: 'Ensure assignees are on track to complete upcoming work.'
    });
  }
  if (smartRecommendations.length === 0) {
    smartRecommendations.push({
      priority: 'Low',
      reason: 'No critical issues detected.',
      resource: 'Workspace',
      suggestedAction: 'Continue monitoring performance.'
    });
  }

  // Executive Summary
  const executiveSummary = `Workspace summary: You have ${kpis.members.current} active members managing ${kpis.projects.current} projects. `
    + `Productivity has ${kpis.tasks.trend >= 0 ? 'increased' : 'decreased'} by ${Math.abs(kpis.tasks.trend)}% compared to the previous period. `
    + (criticalProjects > 0 ? `${criticalProjects} projects require immediate attention. ` : '')
    + (workloadForecast.today.length > 0 ? `${workloadForecast.today.length} tasks are due today. ` : '')
    + `Overall workspace health is classified as ${healthLevel}.`;

  const result = {
    executiveSummary,
    smartRecommendations,
    topPerformers,
    kpis,
    health: { score: healthScore, level: healthLevel, reasons: healthReasons.slice(0, 3) },
    projectPerformance,
    teamProductivity,
    memberActivityMonitor,
    workloadForecast,
    taskAnalytics,
    upcomingDeadlines,
    activityTimeline,
    storageAnalytics,
    insights
  };
  
  await redis.setex(cacheKey, 5 * 60, JSON.stringify(result));
  return result;
};
