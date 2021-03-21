import * as Expr from "./Expr";

export default class AstPrinter implements Expr.Visitor<string> {
  public print(expr: Expr.Expr): string {
    return expr.accept(this);
  }

  public visitBinaryExpr(expr: Expr.Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  public visitGroupingExpr(expr: Expr.Grouping): string {
    return this.parenthesize("group", expr.expression);
  }

  public visitLiteralExpr(expr: Expr.Literal): string {
    if (expr.value == null) return "nil";
    else return expr.value.toString();
  }

  public visitUnaryExpr(expr: Expr.Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr.Expr[]): string {
    return `(${name} ${exprs.map((expr) => expr.accept(this)).join(" ")})`;
  }
}
