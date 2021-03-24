// deno-lint-ignore-file no-explicit-any

export enum TokenType {
  // Sinfle-character tokens
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACE = "LEFT_BRACE",
  RIGHT_BRACE = "RIGHT_BRACE",
  COMMA = "COMMA",
  DOT = "DOT",
  MINUS = "MINUS",
  PLUS = "PLUS",
  SEMICOLON = "SEMICOLON",
  SLASH = "SLASH",
  STAR = "STAR",
  // One or two character tokens.
  BANG = "BANG",
  BANG_EQUAL = "BANG_EQUAL",
  EQUAL = "EQUAL",
  EQUAL_EQUAL = "EQUAL_EQUAL",
  GREATER = "GREATER",
  GREATER_EQUAL = "GREATER_EQUAL",
  LESS = "LESS",
  LESS_EQUAL = "LESS_EQUAL",
  // Literals.
  IDENTIFIER = "IDENTIFIER",
  STRING = "STRING",
  NUMBER = "NUMBER",
  // Keywords.
  AND = "AND",
  CLASS = "CLASS",
  ELSE = "ELSE",
  FALSE = "FALSE",
  FN = "FN",
  FOR = "FOR",
  IF = "IF",
  NIL = "NIL",
  OR = "OR",
  PRINT = "PRINT",
  RETURN = "RETURN",
  SUPER = "SUPER",
  THIS = "THIS",
  TRUE = "TRUE",
  VAR = "VAR",
  WHILE = "WHILE",
  EOF = "EOF",
}

export const keywords: Map<string, TokenType> = new Map([
  ["e", TokenType.AND],
  ["o", TokenType.OR],
  ["classa", TokenType.CLASS],
  ["se", TokenType.IF],
  ["senon", TokenType.ELSE],
  ["fals", TokenType.FALSE],
  ["foncion", TokenType.FN],
  ["per", TokenType.FOR],
  ["nul", TokenType.NIL],
  ["est", TokenType.PRINT],
  ["tornar", TokenType.RETURN],
  ["eretar", TokenType.SUPER],
  ["aico", TokenType.THIS],
  ["true", TokenType.TRUE],
  ["var", TokenType.VAR],
  ["mentre", TokenType.WHILE],
]);

export class Token {
  constructor(
    readonly type: TokenType,
    readonly lexeme: string,
    readonly literal: any,
    readonly line: number,
  ) {}

  toString(): string {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
