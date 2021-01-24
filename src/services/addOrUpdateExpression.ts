import type { Workspace } from "../components/stores";
import { assignEvaluations } from "./evaluateExpressions";
import moveWorkspaceItem from "./moveWorkspaceItem";
import type { Expression } from "./parseUserInput";

export default function addOrUpdateExpression (expression: Expression, currentWorkspace: Workspace) {
  const isNew = !currentWorkspace.has(expression.identifier);
  const currentItem = isNew
    ? buildNewExpression(expression, currentWorkspace)
    : currentWorkspace.get(expression.identifier);

  currentWorkspace.set(expression.identifier, {
    ...currentItem,
    expression
  });

  const evaluatedWorkspace = assignEvaluations(currentWorkspace);

  return isNew
    ? moveWorkspaceItem(expression, 0, evaluatedWorkspace)
    : evaluatedWorkspace;
}

function buildNewExpression(expression: Expression, currentWorkspace: Workspace) {
  const greatestPosition = Math.max(
    ...Array.from(currentWorkspace.values())
      .map(({position}) => position)
    );

  return {
    expression,
    position: greatestPosition + 1
  };
}
