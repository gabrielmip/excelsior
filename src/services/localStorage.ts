import type { Identifier } from "../logic/parser";
import type { Workspace, WorkspaceItem } from "../components/stores";
export const WORKSPACE_KEY = "workspace";

export function getFromStorage(): Map<Identifier, WorkspaceItem> {
  let fromStorage = null;
  try {
    fromStorage = JSON.parse(localStorage.getItem(WORKSPACE_KEY));
  } catch (_) {} // eslint-disable-line no-empty


  const spaceAsObject = fromStorage ?? {};

  return new Map<Identifier, WorkspaceItem>(Object.entries(spaceAsObject));
}

export function saveToStorage(workspace: Workspace): void {
  const asObject = [...workspace.entries()].reduce(
    (partial, [key, item]) => ({
      ...partial,
      [key]: item,
    }),
    {}
  );
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(asObject));
  } catch (_) {} // eslint-disable-line no-empty
}
