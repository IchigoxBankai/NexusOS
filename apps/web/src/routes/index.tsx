import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { SettingsPage } from '@/features/auth/SettingsPage';
import { CommandCenter } from '@/features/dashboard/CommandCenter';
import {
  TasksPage,
  ProjectsPage,
  CalendarPage,
  NotesPage,
  HabitsPage,
  GoalsPage,
  FinancePage,
  AssistantPage,
  InsightsPage,
} from '@/features/placeholders';

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
            element: <TasksPage />,
          },
          {
            path: '/projects',
            element: <ProjectsPage />,
          },
          {
            path: '/calendar',
            element: <CalendarPage />,
          },
          {
            path: '/notes',
            element: <NotesPage />,
          },
          {
            path: '/habits',
            element: <HabitsPage />,
          },
          {
            path: '/goals',
            element: <GoalsPage />,
          },
          {
            path: '/finance',
            element: <FinancePage />,
          },
          {
            path: '/assistant',
            element: <AssistantPage />,
          },
          {
            path: '/insights',
            element: <InsightsPage />,
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
