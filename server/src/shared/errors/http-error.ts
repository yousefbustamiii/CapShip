export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const Errors = {
  badRequest: (msg: string, code?: string) =>
    new HttpError(400, msg, code ?? "BAD_REQUEST"),

  unauthorized: (msg = "Unauthorized") =>
    new HttpError(401, msg, "UNAUTHORIZED"),

  forbidden: (msg = "Forbidden") => new HttpError(403, msg, "FORBIDDEN"),

  notFound: (resource: string) =>
    new HttpError(404, `${resource} not found`, "NOT_FOUND"),

  conflict: (msg: string) => new HttpError(409, msg, "CONFLICT"),

  internalError: (msg = "Internal server error") =>
    new HttpError(500, msg, "INTERNAL_ERROR"),
} as const;
