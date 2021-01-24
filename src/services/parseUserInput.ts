import { MathNode, parse } from "mathjs";
import {errorCodes} from "./parsingErrors";

export type Literal = string;

export type Expression = Assignment;

export type Identifier = string;

interface BaseExpression {
  dependencies: Literal[];
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

export function getErrorsFromParsing(rawInput: string): number[] {
  let parsed: MathNode | null;
  try {
    parsed = parse(rawInput);
  } catch (error) {
    parsed = null;
  }

  const validations = [
    {
      code: errorCodes.invalidExpression,
      isInvalid: (parsed: MathNode | null) => parsed === null
    },
    {
      code: errorCodes.dependsOnItself,
      isInvalid: (parsed: MathNode | null) => {
        if (parsed === null) return false;

        const {literal, dependencies} = getLiteralNames(parsed);
        return dependencies.includes(literal);
      }
    },
    {
      code: errorCodes.isNotAssignment,
      isInvalid: (parsed: MathNode | null) => {
        if (parsed === null) return false;

        const {literal} = getLiteralNames(parsed);
        console.log(literal);
        return !parsed.isAssignmentNode || !literal;
      }
    }
  ];

  return validations
    .filter(({isInvalid}) => isInvalid(parsed))
    .map(({code}) => code);
}

export function parseUserInput(rawInput: string): Expression | null {
  const errors = getErrorsFromParsing(rawInput);
  if (errors.length > 0) return null;

  let parsed: MathNode;
  try {
    parsed = parse(rawInput);
    return buildAssignment(parsed);
  } catch (error) {
    return null;
  }
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
  const {literal, dependencies} = getLiteralNames(parsed);

  return {
    identifier: literal,
    isAssignment: true,
    literal,
    dependencies,
    rightHandSide: parsed.value.toString(),
    stringified: parsed.toString(),
  };
}

function getLiteralNames(parsed: MathNode): { literal: Literal, dependencies: Literal[] } {
  const [literal, ...dependencies] = parsed
    .filter(({ isSymbolNode }: MathNode) => isSymbolNode)
    .map(({ name }) => name);

  return { literal, dependencies };
}
