declare var process: {
  env: {
    readonly EXPO_PUBLIC_SUPABASE_URL?: string;
    readonly EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    readonly EXPO_PUBLIC_ENABLE_DEV_PREVIEW?: string;
    [key: string]: string | undefined;
  };
};

