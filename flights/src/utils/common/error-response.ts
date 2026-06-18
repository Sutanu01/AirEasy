export interface ErrorResponseFormat {
  success: false;
  message: string;
  data: Record<string, never>;
  error: {
    statusCode: number;
    explanation: any;
  };
}

export function ErrorResponse(message: string, errorDetails: { statusCode: number; explanation: any }): ErrorResponseFormat {
  return {
    success: false,
    message,
    data: {},
    error: {
      statusCode: errorDetails.statusCode,
      explanation: errorDetails.explanation,
    },
  };
}
