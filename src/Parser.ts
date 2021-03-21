import { Token, TokenType } from "./lexer";
import { Binary, Expr, Grouping, Literal } from "./Expr";
import Oc from "./Oc";

class ParseError extends Error {}

export default class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): any {
    try {
      return this.expression();
    } catch (err) {
      console.log(err);
    }
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    let expr: Expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private comparison(): Expr {
    let expr: Expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private term(): Expr {
    let expr: Expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expr {
    let expr: Expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expr {
    let expr: Expr = this.primary();

    while (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private primary(): any {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING))
      return new Literal(this.previous().literal);

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, 'Expect ")" after expression.');
      return new Grouping(expr);
    }

    throw Parser.error(this.peek(), "Expect expression");
  }

  private match(...types: TokenType[]): boolean {
    for (let type of types) {
      if (this.check(type)) {
        this.advanced();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  private advanced(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private consume(type: TokenType, msg: string): Token {
    if (this.check(type)) return this.advanced();
    throw Parser.error(this.peek(), msg);
  }

  static error(token: Token, msg: string): ParseError {
    Oc.error(token, msg);
    return new ParseError();
  }

  private synchronize(): void {
    this.advanced();
    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advanced();
    }
  }
}
