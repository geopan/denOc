import { RuntimeError } from "./error.ts";
import { Token } from "./lexer.ts";

export default class Environment {
  // deno-lint-ignore no-explicit-any
  values: Map<string, any> = new Map();

  // deno-lint-ignore no-explicit-any
  define(name: string, value: any): void {
    this.values.set(name, value);
  }

  get(name: Token) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }
}
