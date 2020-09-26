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
    const {
      expression: { identifier, tree },
    } = workspaceItem;

    let evaluation;
    try {
      evaluation = tree.evaluate(buildScope(currentWorkspace));
    } catch (error) {
      console.warn(error);
    }

    currentWorkspace.set(identifier, {
      ...workspaceItem,
      ...(evaluation !== undefined ? { evaluation } : {}),
    });
  } else {
    const { expression } = workspaceItem;
    currentWorkspace.set(expression.identifier, { expression });
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
