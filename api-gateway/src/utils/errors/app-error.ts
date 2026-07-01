class AppError extends Error {
  statusCode: number;
  explanation: string | string[];

  constructor(message: string, statusCode: number, explanation: string | string[] = message) {
    super(message);
    this.statusCode = statusCode;
    this.explanation = explanation;
  }
}

export { AppError };
