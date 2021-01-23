import { parse, MathNode } from "mathjs";

export type Literal = string; // TODO: make it non-empty string only

export type Expression = Assignment;

export type Identifier = string; // TODO: make it non-empty string only

interface BaseExpression {
  dependencies: Literal[];
  tree: MathNode;
  stringified: string;
  identifier: Identifier;
}

export interface Evaluable extends BaseExpression {
  isAssignment: false;
}

export interface Assignment extends BaseExpression {
  isAssignment: true;
  literal: Literal;
  rightHandSide: string;
}

type UserInputResult =
  | { hasError: true; message: string }
  | { hasError: false; result: Expression };

export function parseUserInput(rawInput: string): UserInputResult {
  let parsed;
  try {
    parsed = parse(rawInput);
  } catch (error) {
    console.warn(error);
    return { hasError: true, message: "Definição inválida." };
  }

  if (!parsed.isAssignmentNode) {
    return {
      hasError: true,
      message: "O que você inseriu não é uma definição de símbolo. Definições devem possuir um literal, um sinal de igual (=) e uma fórmula do lado direito.",
    };
  }

  const expression = buildAssignment(parsed);

  if (expression.dependencies.includes(expression.identifier)) {
    return {
      hasError: true,
      message: "Sua atribuição depende dela mesma.",
    };
  }

  return {
    hasError: false,
    result: expression,
  };
}

export function getUninstantiatedFromExpression(
  expression: Expression,
  alreadyDefined: Literal[]
): Expression[] {
  const deps = expression.dependencies
    .filter((literal: string) => !(literal in alreadyDefined))
    .map(getDefaultExpression);

  return expression.identifier in alreadyDefined || !expression.isAssignment
    ? deps
    : [expression, ...deps];
}

export function getDefaultExpression(literal: Literal): Expression {
  const defaultAttributedValue = 0;
  return buildAssignment(parse(`${literal} = ${defaultAttributedValue}`));
}

function buildAssignment(parsed: MathNode): Assignment {
  const literals = getLiteralNames(parsed);
  const [createdLiteral, ...dependencies] = literals;

  return {
    identifier: createdLiteral,
    isAssignment: true,
    literal: createdLiteral,
    dependencies,
    rightHandSide: parsed.value.toString(),
    stringified: parsed.toString(),
    tree: parsed,
  };
}

function getLiteralNames(parsed: MathNode): Literal[] {
  return parsed
    .filter(({ isSymbolNode }: MathNode) => isSymbolNode)
    .map(({ name }) => name);
}
