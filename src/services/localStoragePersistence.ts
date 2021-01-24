import type { Workspace, WorkspaceItem } from "../components/stores";
import type { Identifier } from "./parseUserInput";

export function getFromLocalStorage (workspaceKey: string): Workspace {
  let fromStorage = null;
  try {
    fromStorage = JSON.parse(localStorage.getItem(workspaceKey));
  } catch (_) {} // eslint-disable-line no-empty


  const spaceAsObject = fromStorage ?? {};

  return new Map<Identifier, WorkspaceItem>(Object.entries(spaceAsObject));
}

export function persistToLocalStorage (workspace: Workspace, workspaceKey: string): void {
  const asObject = [...workspace.entries()].reduce(
    (partial, [key, item]) => ({
      ...partial,
      [key]: item,
    }),
    {}
  );
  try {
    localStorage.setItem(workspaceKey, JSON.stringify(asObject));
  } catch (error) {
    console.error(error);
  } // eslint-disable-line no-empty
}
