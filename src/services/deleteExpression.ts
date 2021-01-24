import type { Workspace } from "../components/stores";
import { assignEvaluations } from "./evaluateExpressions";
import type { Expression } from "./parseUserInput";

export default function deleteExpression (expression: Expression, workspace: Workspace) {
  workspace.delete(expression.identifier);
  return assignEvaluations(workspace);
}
