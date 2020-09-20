import { writable } from "svelte/store";
import type { Expression, Identifier } from "../logic/parser";
import { parseUserInput, getDefaultExpression } from "../logic/parser";
import { assignEvaluations } from "../logic/scopeCalculator";

export interface WorkspaceItem {
  expression: Expression;
  evaluation?: number;
}

export type Workspace = Map<Identifier, WorkspaceItem>;

function createWorkspace() {
  const getEmptyWorkspace = () => new Map<Identifier, WorkspaceItem>();
  const { set, subscribe, update } = writable(getEmptyWorkspace());

  return {
    subscribe,
    addUserInput: (userInput: string) =>
      update((currentWorkspace) => {
        const updatedWorkspace = addUserInput(userInput, currentWorkspace);
        return assignEvaluations(updatedWorkspace);
      }),

    replaceByUserInput: (userInput: string, identifier: string) =>
      update((currentWorkspace: Workspace) => {
        currentWorkspace.delete(identifier);
        const updatedWorkspace = addUserInput(userInput, currentWorkspace);
        return assignEvaluations(updatedWorkspace);
      }),

    remove: (identifier: Identifier) =>
      update((currentWorkspace) => {
        currentWorkspace.delete(identifier);
        return assignEvaluations(currentWorkspace);
      }),
    reset: () => set(getEmptyWorkspace()),
  };
}

function addUserInput(
  userInput: string,
  currentWorkspace: Workspace
): Workspace {
  const parsingResult = parseUserInput(userInput);

  if (parsingResult.hasError === false) {
    currentWorkspace.set(parsingResult.result.identifier, {
      expression: parsingResult.result,
    });

    const uninstantiated = parsingResult.result.dependencies
      .filter((dep) => !currentWorkspace.has(dep))
      .map(getDefaultExpression);

    for (const expression of uninstantiated) {
      currentWorkspace.set(expression.identifier, { expression });
    }
  }

  return currentWorkspace;
}

export const workspaceStore = createWorkspace();
