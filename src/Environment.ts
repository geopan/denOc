import { RuntimeError } from "./error";
import { Token } from "./lexer";

export default class Environment {
  values: Map<string, any> = new Map();

  define(name: string, value: any): void {
    this.values.set(name, value);
  }

  get(name: Token): any {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }
}
