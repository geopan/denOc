import {
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  ExprVisitor,
  Variable,
} from "./Expr";
import { Expression, Print, Stmt, StmtVisitor, Var } from "./Stmt";
import { RuntimeError } from "./error";
import { Token, TokenType } from "./lexer";
import Environment from "./Environment";

function runtimeError(error: RuntimeError) {
  console.error(`${error.message} [${error.token.line}]`);
}

export default class Interpreter
  implements ExprVisitor<any>, StmtVisitor<void> {
  private environment = new Environment();

  interpret(statements: Stmt[]): void {
    try {
      for (let statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        runtimeError(error);
      }
    }
  }

  private execute(stmt: Stmt) {
    stmt.accept(this);
  }

  visitLiteralExpr(expr: Literal): any {
    return expr.value;
  }

  visitGroupingExpr(expr: Grouping): any {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr: Unary): any {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
    }

    // Unreachable
    return null;
  }

  visitBinaryExpr(expr: Binary): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < +Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.PLUS:
        if (typeof left == "number" && typeof right == "number") {
          return Number(left) + Number(right);
        }
        if (typeof left == "string" && typeof right == "string") {
          return String(left) + String(right);
        }

        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings."
        );
      case TokenType.SLASH:
        return Number(left) / Number(right);
      case TokenType.STAR:
        return Number(left) * Number(right);
    }

    // Unreachable.
    return null;
  }

  private checkNumberOperand(operator: Token, operand: any) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number");
  }

  private checkNumberOperands(operator: Token, left: any, right: any) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be number");
  }

  private evaluate(expr: Expr): any {
    return expr.accept(this);
  }

  visitExpressionStmt(stmt: Expression) {
    this.evaluate(stmt.expression);
  }

  visitPrintStmt(stmt: Print): void {
    const value = this.evaluate(stmt.expression);
    return console.log(this.stringify(value));
  }

  visitVarStmt(stmt: Var): void {
    let value;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.lexeme, value);
  }

  visitVariableExpr(expr: Variable) {
    return this.environment.get(expr.name);
  }

  private isTruthy(v: any) {
    if (v == null) return false;
    if (v instanceof Boolean) return v;
    return true;
  }

  private isEqual(a: any, b: any) {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
  }

  private stringify(v: any): string {
    if (v == null) return "nul";

    if (typeof v === "number") {
      let text = v.toString();
      // if (text.endsWith(".0")) {
      //   text = text.substring(0, text.length - 2);
      // }
      return text;
    }

    return v.toString();
  }
}
