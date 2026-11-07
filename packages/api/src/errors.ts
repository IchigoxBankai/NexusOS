export interface NexusApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export function formatSupabaseError(error: unknown): NexusApiError {
  if (!error) {
    return { message: 'An unknown error occurred.' };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; code?: string; status?: number; error_description?: string };
    return {
      message: err.error_description || err.message || 'Operation failed',
      code: err.code,
      status: err.status,
      details: error,
    };
  }

  return {
    message: String(error),
  };
}

