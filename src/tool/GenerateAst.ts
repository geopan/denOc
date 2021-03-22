import { WriteStream, createWriteStream } from "fs";

import path from "path";

const expressions = [
  "Binary   : Expr left, Token operator, Expr right",
  "Grouping : Expr expression",
  "Literal  : any value",
  "Unary    : Token operator, Expr right",
  "Variable : Token name",
];

const statements = [
  "Expression : Expr expression",
  "Print      : Expr expression",
  "Var        : Token name, Expr initializer",
];

class GenerateAst {
  constructor(args: string[]) {
    if (args.length != 1) {
      console.error("Usage: generate_ast <output directory>");
      process.exit(64);
    }
    const outputDir = args[0];
    GenerateAst.defineAst(outputDir, "Expr", expressions);
    GenerateAst.defineAst(outputDir, "Stmt", statements);
  }

  private static defineAst(
    outputDir: string,
    baseName: string,
    types: string[]
  ): void {
    const p = path.resolve(`src/${outputDir}/${baseName}.ts`);

    const writer = createWriteStream(p);

    baseName === "Stmt" && writer.write(`import { Expr } from "./Expr";\n`);
    writer.write(`import { Token } from "./lexer";\n\n`);

    writer.write(`export interface ${baseName}Visitor<R> {\n`);

    types.forEach((type) => {
      const className: string = type.split(":")[0].trim();
      writer.write(`  visit${className}${baseName}(expr: ${className}): R;\n`);
    });

    writer.write(`}\n\n`);

    writer.write(`export abstract class ${baseName} {\n`);
    writer.write(`  abstract accept<R>(visitor: ${baseName}Visitor<R>): R\n`);
    writer.write(`}\n\n`);

    // The AST classes.
    types.forEach((type) => {
      const className: string = type.split(":")[0].trim();
      const fields: string = type.split(":")[1].trim();
      this.defineType(writer, baseName, className, fields);
    });

    writer.close();
  }

  private static defineType(
    writer: WriteStream,
    baseName: string,
    className: string,
    fieldList: string
  ) {
    writer.write(`export class ${className} extends ${baseName} {\n\n`);

    // // Store parameters in fields.
    const fields: string[] = fieldList.split(", ");

    const args = fields.map((field) => {
      const fieldArgs = field.split(" ");
      return `readonly ${fieldArgs[1]}: ${fieldArgs[0]}`;
    });

    // args.forEach((arg) => {
    //   writer.write(`  ${arg};\n`);
    // });

    // Constructor.
    writer.write(`  constructor(${args.join(", ")}) {\n`);

    writer.write(`    super();\n`);

    // fields.forEach((field) => {
    //   const name = field.split(" ")[1];
    //   writer.write(`    this.${name} = ${name};\n`);
    // });

    writer.write(`  }\n\n`);

    writer.write(`  public accept<R>(visitor: ${baseName}Visitor<R>): R {\n`);
    writer.write(`    return visitor.visit${className}${baseName}(this);\n`);
    writer.write(`  }\n\n`);

    // writer.println("  }");
    writer.write(`}\n\n`);
  }
}

const gen = new GenerateAst([""]);
