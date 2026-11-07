import { supabase } from './supabase.native';
import {
  NexusAuthService,
  NexusProfileService,
  NexusDashboardService,
} from '@nexus/api';

export const authService = new NexusAuthService(supabase);
export const profileService = new NexusProfileService(supabase);
export const dashboardService = new NexusDashboardService(supabase);

