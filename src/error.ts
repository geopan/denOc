import { Token } from "./lexer";

export class CliError extends Error {
  name = "CliError";
  constructor(readonly message: string) {
    super();
  }
}

export class SyntaxError extends Error {
  name = "SyntaxError";
  constructor(
    readonly message: string,
    readonly line?: number,
    readonly where?: number
  ) {
    super();
  }
}

export class RuntimeError extends Error {
  name = "RuntimeError";
  constructor(readonly token: Token, readonly message: string) {
    super();
  }
}
