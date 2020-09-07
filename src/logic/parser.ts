import { parse, MathNode } from "mathjs";

export type Symbol = string; // TODO: make it non-empty string only

export type Expression = Evaluable | Assignment;

export type Identifier = string; // TODO: make it non-empty string only

interface BaseExpression {
  dependencies: Symbol[];
  tree: MathNode;
  stringified: string;
  identifier: Identifier;
}

export interface Evaluable extends BaseExpression {}

export interface Assignment extends BaseExpression {
  symbol: Symbol;
  rightHandSide: string;
}

type UserInputResult =
  | { hasError: true }
  | { hasError: false; result: Expression };

export function parseUserInput(rawInput: string): UserInputResult {
  let parsed;
  try {
    parsed = parse(rawInput);
  } catch (error) {
    console.info(error);
    return { hasError: true };
  }

  const expression = parsed.isAssignmentNode
    ? buildAssignment(parsed)
    : buildEvaluable(parsed);

  return {
    hasError: false,
    result: expression,
  };
}

function buildAssignment(parsed: MathNode): Assignment {
  const symbols = getSymbolNames(parsed);
  const [createdSymbol, ...dependencies] = symbols;

  return {
    identifier: createdSymbol,
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
