function SuccessResponse(message: string, data: any = {}) {
  return {
    success: true,
    message,
    data,
    error: {},
  };
}

function ErrorResponse(message: string, error: any = {}) {
  return {
    success: false,
    message,
    data: {},
    error,
  };
}

export { SuccessResponse, ErrorResponse };
