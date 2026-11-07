import type { CommandCenterData } from '@nexus/types';
import type { NexusSupabaseClient } from './client';
import { SAMPLE_COMMAND_CENTER_DATA, EMPTY_COMMAND_CENTER_DATA } from './dashboard.sample';

export class NexusDashboardService {
  constructor(private client: NexusSupabaseClient) {}

  async getCommandCenterData(options?: {
    userId?: string;
    usePreviewSample?: boolean;
    userFullName?: string;
  }): Promise<CommandCenterData> {
    const { usePreviewSample = false, userFullName } = options || {};

    if (usePreviewSample) {
      return {
        ...SAMPLE_COMMAND_CENTER_DATA,
        userDisplayName: userFullName || SAMPLE_COMMAND_CENTER_DATA.userDisplayName,
      };
    }

    // In a real environment with user profile, we formulate the baseline empty/live state
    const now = new Date();
    const hours = now.getHours();
    let greeting = 'Good morning';
    if (hours >= 12 && hours < 17) greeting = 'Good afternoon';
    else if (hours >= 17) greeting = 'Good evening';

    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return {
      ...EMPTY_COMMAND_CENTER_DATA,
      greeting,
      userDisplayName: userFullName || 'there',
      formattedDate,
    };
  }
}

