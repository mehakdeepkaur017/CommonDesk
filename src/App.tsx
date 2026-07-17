import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Layouts (loaded eagerly to prevent UI thrashing)
import { AuthLayout } from "./components/layout/AuthLayout";
import { DashboardLayout } from "./components/layout/dashboard/DashboardLayout";
import { AdminLayout } from "./components/layout/admin/AdminLayout";
import { Error404 } from "./components/feedback/ErrorStates";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Universal Page Loader Fallback
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-surface-border border-t-brand-indigo rounded-full animate-spin" />
  </div>
);

// Lazy Loaded Pages
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import("./pages/auth/Login").then(m => ({ default: m.Login })));
const CreateOrganization = lazy(() => import("./pages/auth/CreateOrganization").then(m => ({ default: m.CreateOrganization })));
const JoinOrganization = lazy(() => import("./pages/auth/JoinOrganization").then(m => ({ default: m.JoinOrganization })));
const PendingApproval = lazy(() => import("./pages/auth/PendingApproval").then(m => ({ default: m.PendingApproval })));

// Dashboard Pages
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome").then(m => ({ default: m.DashboardHome })));
const MyTasks = lazy(() => import("./pages/dashboard/tasks/MyTasks").then(m => ({ default: m.MyTasks })));
const ProjectsList = lazy(() => import("./pages/dashboard/projects/ProjectsList").then(m => ({ default: m.ProjectsList })));
const ProjectDetails = lazy(() => import("./pages/dashboard/projects/ProjectDetails").then(m => ({ default: m.ProjectDetails })));
const MembersList = lazy(() => import("./pages/dashboard/members/MembersList").then(m => ({ default: m.MembersList })));
const MemberProfile = lazy(() => import("./pages/dashboard/profile/MemberProfile").then(m => ({ default: m.MemberProfile })));
const FilesList = lazy(() => import("./pages/dashboard/files/FilesList").then(m => ({ default: m.FilesList })));
const NotificationsPage = lazy(() => import("./pages/dashboard/notifications/NotificationsPage").then(m => ({ default: m.NotificationsPage })));
const AnalyticsPage = lazy(() => import("./features/analytics/AnalyticsPage").then(m => ({ default: m.AnalyticsPage })));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const WorkspaceManagement = lazy(() => import("./pages/admin/workspace/WorkspaceManagement").then(m => ({ default: m.WorkspaceManagement })));
const AdminMembersList = lazy(() => import("./pages/admin/members/AdminMembersList").then(m => ({ default: m.AdminMembersList })));
const AdminInvitationsList = lazy(() => import("./pages/admin/invitations/AdminInvitationsList").then(m => ({ default: m.AdminInvitationsList })));
const AdminProjectsList = lazy(() => import("./pages/admin/projects/AdminProjectsList").then(m => ({ default: m.AdminProjectsList })));
const AdminTasksList = lazy(() => import("./pages/admin/tasks/AdminTasksList").then(m => ({ default: m.AdminTasksList })));
const AnalyticsCenter = lazy(() => import("./pages/admin/analytics/AnalyticsCenter").then(m => ({ default: m.AnalyticsCenter })));
const AuditCenter = lazy(() => import("./pages/admin/audit/AuditCenter").then(m => ({ default: m.AuditCenter })));
const SecurityCenter = lazy(() => import("./pages/admin/security/SecurityCenter").then(m => ({ default: m.SecurityCenter })));
const SystemHealth = lazy(() => import("./pages/admin/health/SystemHealth").then(m => ({ default: m.SystemHealth })));
const AdminFilesList = lazy(() => import("./pages/admin/files/AdminFilesList").then(m => ({ default: m.AdminFilesList })));
const AdminNotifications = lazy(() => import("./pages/admin/notifications/AdminNotifications").then(m => ({ default: m.AdminNotifications })));
const AdminProfile = lazy(() => import("./pages/admin/profile/AdminProfile").then(m => ({ default: m.AdminProfile })));
const IntegrationsCenter = lazy(() => import("./pages/admin/integrations/IntegrationsCenter").then(m => ({ default: m.IntegrationsCenter })));

// Route transition wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-text-primary transition-colors duration-300">
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
            
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="create-organization" element={<PageWrapper><CreateOrganization /></PageWrapper>} />
              <Route path="join-organization" element={<PageWrapper><JoinOrganization /></PageWrapper>} />
              <Route path="pending-approval" element={<PageWrapper><PendingApproval /></PageWrapper>} />
            </Route>

            {/* Member Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['MEMBER']} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<PageWrapper><DashboardHome /></PageWrapper>} />
                <Route path="my-tasks" element={<PageWrapper><MyTasks /></PageWrapper>} />
                <Route path="projects" element={<PageWrapper><ProjectsList /></PageWrapper>} />
                <Route path="projects/:id" element={<PageWrapper><ProjectDetails /></PageWrapper>} />
                <Route path="files" element={<PageWrapper><FilesList /></PageWrapper>} />
                <Route path="notifications" element={<PageWrapper><NotificationsPage /></PageWrapper>} />
                <Route path="analytics" element={<PageWrapper><AnalyticsPage /></PageWrapper>} />
                <Route path="members" element={<PageWrapper><MembersList /></PageWrapper>} />
                <Route path="profile" element={<PageWrapper><MemberProfile /></PageWrapper>} />
                <Route path="*" element={<PageWrapper><Error404 /></PageWrapper>} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="workspace" element={<PageWrapper><WorkspaceManagement /></PageWrapper>} />
                <Route path="members" element={<PageWrapper><AdminMembersList /></PageWrapper>} />
                <Route path="projects" element={<PageWrapper><AdminProjectsList /></PageWrapper>} />
                <Route path="tasks" element={<PageWrapper><AdminTasksList /></PageWrapper>} />
                <Route path="analytics" element={<PageWrapper><AnalyticsCenter /></PageWrapper>} />
                <Route path="audit" element={<PageWrapper><AuditCenter /></PageWrapper>} />
                <Route path="security" element={<PageWrapper><SecurityCenter /></PageWrapper>} />
                <Route path="health" element={<PageWrapper><SystemHealth /></PageWrapper>} />
                <Route path="files" element={<PageWrapper><AdminFilesList /></PageWrapper>} />
                <Route path="notifications" element={<PageWrapper><AdminNotifications /></PageWrapper>} />
                <Route path="integrations" element={<PageWrapper><IntegrationsCenter /></PageWrapper>} />
                <Route path="invitations" element={<PageWrapper><AdminInvitationsList /></PageWrapper>} />
                <Route path="profile" element={<PageWrapper><AdminProfile /></PageWrapper>} />
                <Route path="*" element={<PageWrapper><Error404 /></PageWrapper>} />
              </Route>
            </Route>

            <Route path="*" element={<PageWrapper><Error404 /></PageWrapper>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default App;
