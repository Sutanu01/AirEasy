export class AppError extends Error {
  public statusCode: number;
  public explanation: any;

  constructor(message: string, statusCode: number, explanation: any = message) {
    super(message);
    this.statusCode = statusCode;
    this.explanation = explanation;
    
    // Capture stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}
