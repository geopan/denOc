import fs from "fs";
import path from "path";
import readline from "readline";
import { Token, TokenType } from "./lexer";
import Scanner from "./Scanner";
import Parser from "./Parser";
import Interpreter from "./Interpreter";
import { Stmt } from "./Stmt";

export default class Oc {
  private static interpreter = new Interpreter();
  static hadError: boolean = false;
  static hadRuntimeError: boolean = false;

  constructor(args: string[]) {
    if (args.length > 1) {
      console.log("Usage: tsOc [script]");
      process.exit(64);
    } else if (args.length == 1) {
      Oc.runFile(args[0]);
    } else {
      Oc.runPrompt();
    }
  }

  private static runFile(p: string): void {
    const bytes: Buffer = fs.readFileSync(path.resolve(p));
    this.run(bytes.toString());

    if (this.hadError) process.exit(65);
    if (this.hadRuntimeError) process.exit(70);
  }

  private static runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      // output: process.stdout,
    });

    rl.on("line", (input) => {
      input && this.run(input);
    });
  }

  private static run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);
    const statements: Stmt[] = parser.parse();

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
