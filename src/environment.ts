import { RuntimeError } from "./error.ts";
import { Causa } from "./types.ts";
import { Token } from "./lexer.ts";

export default class Environment {
  private values: { [key: string]: Causa } = {};
  enclosing: Environment | null;

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing || null;
  }

  define(name: string, value: Causa): void {
    this.values[name] = value;
  }

  get(name: Token): Causa {
    if (this.values[name.lexeme] !== undefined) {
      return this.values[name.lexeme];
    }

    if (this.enclosing !== null) return this.enclosing.get(name);

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }

  assign(name: Token, value: Causa): void {
    if (this.values[name.lexeme] !== undefined) {
      this.values[name.lexeme] = value;
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }
}
