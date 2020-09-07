import type { Expression } from "./parser";

export type Scope = {
  [ID: string]: number;
};

export function buildScope(expressions: Expression[]): Scope {
  return expressions.reduce(
    (currentScope, expression) =>
      traverseFromExpression(expression, currentScope, expressions),
    {}
  );
}

function traverseFromExpression(
  expression: Expression,
  currentScope: Scope,
  expressions: Expression[]
): Scope {
  for (const dep of expression.dependencies) {
    const depExpression = expressions.find(
      (expression) => "symbol" in expression && expression.symbol === dep
    );
    if (depExpression) {
      currentScope = traverseFromExpression(
        depExpression,
        currentScope,
        expressions
      );
    }
  }

  const dependenciesSatisfied = expression.dependencies.every(
    (name) => name in currentScope
  );

  if (dependenciesSatisfied) {
    currentScope[expression.identifier] = expression.tree.evaluate(
      currentScope
    );
  }

  return currentScope;
}
