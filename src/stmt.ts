import { Expr } from "./expr.ts";
import { Token } from "./lexer.ts";

export interface StmtVisitor<R> {
  visitExpressionStmt(expr: Expression): R;
  visitPrintStmt(expr: Print): R;
  visitVarStmt(expr: Var): R;
}

export abstract class Stmt {
  abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export class Expression extends Stmt {
  constructor(readonly expression: Expr) {
    super();
  }

  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}

export class Print extends Stmt {
  constructor(readonly expression: Expr) {
    super();
  }

  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
}

export class Var extends Stmt {
  constructor(readonly name: Token, readonly initializer: Expr) {
    super();
  }

  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitVarStmt(this);
  }
}
