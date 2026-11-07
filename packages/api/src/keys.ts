export const nexusQueryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...nexusQueryKeys.auth.all, 'user'] as const,
    session: () => [...nexusQueryKeys.auth.all, 'session'] as const,
  },
  profile: {
    all: ['profile'] as const,
    detail: (userId?: string) => [...nexusQueryKeys.profile.all, 'detail', userId] as const,
    preferences: (userId?: string) => [...nexusQueryKeys.profile.all, 'preferences', userId] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    commandCenter: (userId?: string) => [...nexusQueryKeys.dashboard.all, 'command-center', userId] as const,
  },
};
