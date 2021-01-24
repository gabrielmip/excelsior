import { writable } from "svelte/store";
import addOrUpdateExpression from "../services/addOrUpdateExpression";
import deleteExpression from "../services/deleteExpression";
import type { Expression, Identifier } from "../services/parseUserInput";

interface WorkspaceItem {
  expression: Expression;
  position: number;
  evaluation?: number;
};

type Workspace = Map<Identifier, WorkspaceItem>;

function createExpressionStore() {
  const getEmptyStore = () => new Map<Identifier, WorkspaceItem>();
  const { set, subscribe, update } = writable(getEmptyStore());

  return {
    subscribe,

    addOrUpdate: (expression: Expression) =>
      update((currentWorkspace) => addOrUpdateExpression(expression, currentWorkspace)),

    remove: (expression: Expression) =>
      update((currentWorkspace) => deleteExpression(expression, currentWorkspace)),

    reset: () => set(getEmptyStore()),
  };
}

export const expressionStore = createExpressionStore();
export type { WorkspaceItem, Workspace };
