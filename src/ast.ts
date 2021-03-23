// deno-lint-ignore-file no-explicit-any
import { Token } from "./lexer.ts";

export interface ExprVisitor<R> {
  visitAssignExpr(expr: Assign): R;
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitLiteralExpr(expr: Literal): R;
  visitUnaryExpr(expr: Unary): R;
  visitVariableExpr(expr: Variable): R;
}

export abstract class Expr {
  abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export class Assign extends Expr {
  constructor(readonly name: Token, readonly value: Expr) {
    super();
  }

  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitAssignExpr(this);
  }
}

export class Binary extends Expr {
  constructor(
    readonly left: Expr,
    readonly operator: Token,
    readonly right: Expr,
  ) {
    super();
  }

  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}

export class Grouping extends Expr {
  constructor(readonly expression: Expr) {
    super();
  }

  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}

export class Literal extends Expr {
  constructor(readonly value: any) {
    super();
  }

  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class Unary extends Expr {
  constructor(readonly operator: Token, readonly right: Expr) {
    super();
  }

  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}

export class Variable extends Expr {
  constructor(readonly name: Token) {
    super();
  }

  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitVariableExpr(this);
  }
}

export interface StmtVisitor<R> {
  visitBlockStmt(expr: Block): R;
  visitExpressionStmt(expr: Expression): R;
  visitPrintStmt(expr: Print): R;
  visitVarStmt(expr: Var): R;
}

export abstract class Stmt {
  abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export class Block extends Stmt {
  constructor(readonly statements: Stmt[]) {
    super();
  }

  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitBlockStmt(this);
  }
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
