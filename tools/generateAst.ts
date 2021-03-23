const expressions = [
  "Assign   : Token name, Expr value",
  "Binary   : Expr left, Token operator, Expr right",
  "Grouping : Expr expression",
  "Literal  : any value",
  "Unary    : Token operator, Expr right",
  "Variable : Token name",
];

const statements = [
  "Block      : Stmt[] statements",
  "Expression : Expr expression",
  "Print      : Expr expression",
  "Var        : Token name, Expr initializer",
];

class GenerateAst {
  static writer: string[] = [];

  static async generate(output = `./src/ast.ts`) {
    this.writer = [`// deno-lint-ignore-file no-explicit-any\n`];
    this.writer.push(`import { Token } from "./lexer.ts";\n\n`);

    this.defineAst("Expr", expressions);
    this.defineAst("Stmt", statements);

    await Deno.writeTextFile(output, this.writer.join(""));
  }

  private static defineAst(
    baseName: string,
    types: string[],
  ) {
    this.writer.push(`export interface ${baseName}Visitor<R> {\n`);

    types.forEach((type) => {
      const className: string = type.split(":")[0].trim();
      this.writer.push(
        `  visit${className}${baseName}(expr: ${className}): R;\n`,
      );
    });

    this.writer.push(`}\n\n`);

    this.writer.push(`export abstract class ${baseName} {\n`);
    this.writer.push(
      `  abstract accept<R>(visitor: ${baseName}Visitor<R>): R\n`,
    );
    this.writer.push(`}\n\n`);

    // The AST classes.
    types.forEach((type) => {
      const className: string = type.split(":")[0].trim();
      const fields: string = type.split(":")[1].trim();
      this.defineType(baseName, className, fields);
    });

    this.writer.push(`\n`);
  }

  private static defineType(
    baseName: string,
    className: string,
    fieldList: string,
  ) {
    this.writer.push(`export class ${className} extends ${baseName} {\n\n`);

    // // Store parameters in fields.
    const fields: string[] = fieldList.split(", ");

    const args = fields.map((field) => {
      const fieldArgs = field.split(" ");
      return `readonly ${fieldArgs[1]}: ${fieldArgs[0]}`;
    });

    // Constructor.
    this.writer.push(`  constructor(${args.join(", ")}) {\n`);

    this.writer.push(`    super();\n`);

    this.writer.push(`  }\n\n`);

    this.writer.push(
      `  public accept<R>(visitor: ${baseName}Visitor<R>): R {\n`,
    );
    this.writer.push(
      `    return visitor.visit${className}${baseName}(this);\n`,
    );
    this.writer.push(`  }\n\n`);

    this.writer.push(`}\n\n`);
  }
}

export default GenerateAst.generate();
