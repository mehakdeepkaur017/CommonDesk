export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  permissions?: any[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  storageUsedGB: number;
  storageTotalGB: number;
  currentUser: User;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold" | "planning" | "paused";
  progress: number;
  currentUserRole?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "online" | "offline" | "busy";
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignees: User[];
  assignee?: User; // legacy usage
  dueDate?: string;
  projectId?: string;
  comments?: any[];
  attachments?: any[];
}

export interface FileDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "mention" | "system" | "task" | "project";
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  user: User;
  timestamp: string;
}

export interface OnboardingData {
  role?: string;
  name?: string;
  slug?: string;
  industry?: string;
  teamSize?: string;
  color?: string;
}
