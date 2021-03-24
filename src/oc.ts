// deno-lint-ignore-file no-inferrable-types

import { readLines } from "https://deno.land/std@0.91.0/io/bufio.ts";
import * as path from "https://deno.land/std@0.91.0/path/mod.ts";

import { Token, TokenType } from "./lexer.ts";
import Scanner from "./scanner.ts";
import Parser from "./parser.ts";
import Interpreter from "./interpreter.ts";
import { Stmt } from "./ast.ts";

export class Oc {
  private static interpreter = new Interpreter();
  static hadError: boolean = false;
  static hadRuntimeError: boolean = false;

  constructor(args: string[]) {
    if (args.length > 1) {
      console.log("Usage: tsOc [script]");
      Deno.exit(64);
    } else if (args.length == 1) {
      Oc.runFile(args[0]);
    } else {
      Oc.runPrompt();
    }
  }

  private static runFile(p: string): void {
    const content = Deno.readTextFileSync(path.resolve(p));

    this.run(content);

    if (this.hadError) Deno.exit(65);
    if (this.hadRuntimeError) Deno.exit(70);
  }

  private static async runPrompt(): Promise<void> {
    for await (const line of readLines(Deno.stdin)) {
      this.run(line);
    }
  }

  private static run(source: string): void {
    const scanner = new Scanner(source);

    const tokens = scanner.scanTokens();
    // console.debug(tokens);

    const parser = new Parser(tokens);

    const statements: Stmt[] = parser.parse();
    // console.debug(statements);

    if (this.hadError) return;

    this.interpreter.interpret(statements);
  }

  static error(obj: Token | number, msg: string): void {
    this.hadError = true;

    if (typeof obj === "number") {
      const line = obj as number;
      Oc.report(line, "", msg);
    } else {
      const token = obj as Token;
      return token.type == TokenType.EOF
        ? this.report(token.line, "at end", msg)
        : this.report(token.line, `at '${token.lexeme}'`, msg);
    }
  }

  private static report(line: number, where: string, msg: string) {
    console.error(`Error ${where}: ${msg} [${line}]`);
  }
}
