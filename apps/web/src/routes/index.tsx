import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { SettingsPage } from '@/features/auth/SettingsPage';
import { CommandCenter } from '@/features/dashboard/CommandCenter';
import { TasksView } from '@/features/tasks/TasksView';
import { ProjectsView } from '@/features/projects/ProjectsView';
import { CalendarView } from '@/features/calendar/CalendarView';
import { NotesView } from '@/features/notes/NotesView';
import { HabitsView } from '@/features/habits/HabitsView';
import { GoalsView } from '@/features/goals/GoalsView';
import { FinanceView } from '@/features/finance/FinanceView';
import { AssistantView } from '@/features/assistant/AssistantView';
import { InsightsView } from '@/features/insights/InsightsView';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  // Public Auth Routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  // Protected Application Routes
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            element: <CommandCenter />,
          },
          {
            path: '/tasks',
            element: <TasksView />,
          },
          {
            path: '/projects',
            element: <ProjectsView />,
          },
          {
            path: '/calendar',
            element: <CalendarView />,
          },
          {
            path: '/notes',
            element: <NotesView />,
          },
          {
            path: '/habits',
            element: <HabitsView />,
          },
          {
            path: '/goals',
            element: <GoalsView />,
          },
          {
            path: '/finance',
            element: <FinanceView />,
          },
          {
            path: '/assistant',
            element: <AssistantView />,
          },
          {
            path: '/insights',
            element: <InsightsView />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  // Fallback Catch-All
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
