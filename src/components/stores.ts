import { writable } from "svelte/store";
import addOrUpdateExpression from "../services/addOrUpdateExpression";
import deleteExpression from "../services/deleteExpression";
import type { Expression, Identifier } from "../services/parseUserInput";
import { persistToLocalStorage, getFromLocalStorage } from "../services/localStoragePersistence";

const WORKSPACE_KEY = 'workspace';

interface WorkspaceItem {
  expression: Expression;
  position: number;
  evaluation?: number;
};

type Workspace = Map<Identifier, WorkspaceItem>;

type Separator = '.' | ',';
type Locale = 'pt' | 'en';

interface UserConfig {
  thousandSeparator: Separator;
  decimalSeparator: Separator;
  locale: Locale;
}

function createExpressionStore() {
  const getEmptyStore = () => new Map<Identifier, WorkspaceItem>();
  const { set, subscribe, update } = writable(getFromLocalStorage(WORKSPACE_KEY));

  return {
    subscribe,

    addOrUpdate: (expression: Expression) =>
      update((currentWorkspace) => addOrUpdateExpression(expression, currentWorkspace)),

    remove: (expression: Expression) =>
      update((currentWorkspace) => deleteExpression(expression, currentWorkspace)),

    reset: () => set(getEmptyStore()),
  };
}

function createUserStore () {
  const initialValue: UserConfig = {
    thousandSeparator: '.',
    decimalSeparator: ',',
    locale: 'pt'
  };

  return writable(initialValue);
}

export type { WorkspaceItem, Workspace, UserConfig, Separator };
export const expressionStore = createExpressionStore();
export const userStore = createUserStore();

expressionStore.subscribe(store => persistToLocalStorage(store, WORKSPACE_KEY));
