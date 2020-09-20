import { parse, MathNode } from "mathjs";

export type Symbol = string; // TODO: make it non-empty string only

export type Expression = Assignment;
// export type Expression = Evaluable | Assignment;

export type Identifier = string; // TODO: make it non-empty string only

interface BaseExpression {
  dependencies: Symbol[];
  tree: MathNode;
  stringified: string;
  identifier: Identifier;
}

export interface Evaluable extends BaseExpression {
  isAssignment: false;
}

export interface Assignment extends BaseExpression {
  isAssignment: true;
  symbol: Symbol;
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
      message: "O que você inseriu não é uma definição.",
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
  alreadyDefined: Symbol[]
): Expression[] {
  const deps = expression.dependencies
    .filter((symbol: string) => !(symbol in alreadyDefined))
    .map(getDefaultExpression);

  return expression.identifier in alreadyDefined || !expression.isAssignment
    ? deps
    : [expression, ...deps];
}

export function getDefaultExpression(symbol: Symbol): Expression {
  const defaultAttributedValue = 0;
  return buildAssignment(parse(`${symbol} = ${defaultAttributedValue}`));
}

function buildAssignment(parsed: MathNode): Assignment {
  const symbols = getSymbolNames(parsed);
  const [createdSymbol, ...dependencies] = symbols;

  return {
    identifier: createdSymbol,
    isAssignment: true,
    symbol: createdSymbol,
    dependencies,
    rightHandSide: parsed.value.toString(),
    stringified: parsed.toString(),
    tree: parsed,
  };
}

function buildEvaluable(parsed: MathNode): Evaluable {
  const dependencies = getSymbolNames(parsed);
  const stringified = parsed.toString();

  return {
    identifier: stringified,
    isAssignment: false,
    dependencies,
    stringified,
    tree: parsed,
  };
}

function getSymbolNames(parsed: MathNode): Symbol[] {
  return parsed
    .filter(({ isSymbolNode }: MathNode) => isSymbolNode)
    .map(({ name }) => name);
}
