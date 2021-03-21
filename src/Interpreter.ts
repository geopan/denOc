import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "./Expr";
import { RuntimeError } from "./error";
import { Token, TokenType } from "./lexer";

function runtimeError(error: RuntimeError) {
  console.error(`${error.message} [${error.token.line}]`);
}

export default class Interpreter implements Visitor<any> {
  interpret(expression: Expr): void {
    try {
      const v = this.evaluate(expression);
      console.log(this.stringify(v));
    } catch (error) {
      if (error instanceof RuntimeError) {
        runtimeError(error);
      }
    }
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
