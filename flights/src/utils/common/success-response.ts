export interface SuccessResponseFormat {
  success: true;
  message: string;
  data: any;
  error: Record<string, never>;
}

export function SuccessResponse(message: string, data: any = {}): SuccessResponseFormat {
  return {
    success: true,
    message,
    data,
    error: {},
  };
}
