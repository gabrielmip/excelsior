import { writable, derived } from "svelte/store";
import type { Expression, Identifier } from "../logic/parser";
import { buildScope } from "../logic/scopeCalculator";

function createExpressions() {
  const emptyExpressions: Expression[] = [];
  const { set, subscribe, update } = writable(emptyExpressions);

  return {
    subscribe,
    add: (expression: Expression) =>
      update((currentExpressions) =>
        sortExpressions(addOrReplace(expression, currentExpressions))
      ),
    remove: (symbol: Identifier) =>
      update((currentExpressions) =>
        excludeExpression(symbol, currentExpressions)
      ),
    reset: () => set([]),
  };
}

function addOrReplace(
  newExpression: Expression,
  expressions: Expression[]
): Expression[] {
  return excludeExpression(newExpression.identifier, expressions).concat([
    newExpression,
  ]);
}

const excludeExpression = (
  identifierToExclude: Identifier,
  expressions: Expression[]
) => expressions.filter(({ identifier }) => identifier !== identifierToExclude);

const sortExpressions = (expressions: Expression[]) =>
  expressions.sort((leftExp, rightExp) =>
    leftExp.identifier.localeCompare(rightExp.identifier)
  );

export const expressionStore = createExpressions();

export const scopeStore = derived(
  expressionStore,
  (expressions: Expression[]) => buildScope(expressions)
);
