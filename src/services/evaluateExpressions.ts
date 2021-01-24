import { parse } from "mathjs";
import type { Workspace, WorkspaceItem } from "../components/stores";

type Scope = {
  [ID: string]: number;
};

export function assignEvaluations(workspace: Workspace): Workspace {
  // NOTE: traverse with depth-first to evaluate only once
  return [...workspace.values()].reduce(
    (currentWorkspace, item) => traverseFromExpression(item, currentWorkspace),
    workspace
  );
}

function traverseFromExpression(
  workspaceItem: WorkspaceItem,
  currentWorkspace: Workspace
): Workspace {
  for (const dep of workspaceItem.expression.dependencies) {
    if (currentWorkspace.has(dep)) {
      currentWorkspace = traverseFromExpression(
        currentWorkspace.get(dep),
        currentWorkspace
      );
    }
  }

  const dependenciesSatisfied = workspaceItem.expression.dependencies.every(
    (name) =>
      currentWorkspace.has(name) &&
      currentWorkspace.get(name).evaluation !== undefined
  );

  if (dependenciesSatisfied) {
    const { expression } = workspaceItem;

    let evaluation;
    try {
      evaluation = parse(expression.stringified)
        .evaluate(buildScope(currentWorkspace));
    } catch (error) {
      console.warn(error);
    }

    currentWorkspace.set(expression.identifier, {
      ...workspaceItem,
      ...(evaluation !== undefined ? { evaluation } : {}),
    });
  } else {
    currentWorkspace.set(workspaceItem.expression.identifier, {
      ...workspaceItem,
      evaluation: undefined
    });
  }

  return currentWorkspace;
}

function buildScope(workspace: Workspace): Scope {
  return [...workspace.values()]
    .filter(({ evaluation }) => evaluation !== undefined)
    .reduce(
      (current, { evaluation, expression: { identifier } }) =>
        Object.assign(current, { [identifier]: evaluation }),
      {}
    );
}
