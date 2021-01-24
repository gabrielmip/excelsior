import type { WorkspaceItem, Workspace } from "../components/stores";
import type { Expression } from "./parseUserInput";

export default function moveWorkspaceItem (
  expression: Expression,
  newPosition: number,
  workspace: Workspace
): Workspace {
  if (!workspace.has(expression.identifier)) {
    throw new Error('Expression not in workspace');
  }

  const currentPosition = workspace.get(expression.identifier).position;

  if (currentPosition === newPosition) return workspace;

  const slidedItemsWorkspace = slideItems(currentPosition, newPosition, workspace);

  slidedItemsWorkspace.set(expression.identifier, {
    ...workspace.get(expression.identifier),
    position: newPosition
  })

  return slidedItemsWorkspace;
}

function slideItems(currentPosition: number, newPosition: number, workspace: Workspace): Workspace {
  const {start, end, increment} = getSlidingSettings(currentPosition, newPosition);

  const currentEntries = workspace.entries();
  for (const [identifier, item] of currentEntries) {
    if (hasToSlide(item, start, end)) {
      workspace.set(identifier, slideItem(item, increment));
    }
  }

  return workspace;
}

function getSlidingSettings (currentPosition: number, newPosition: number) {
  const slidingTowardsBeginning = currentPosition > newPosition;
  return slidingTowardsBeginning
    ? {start: newPosition, end: currentPosition - 1, increment: true}
    : {start: newPosition + 1, end: currentPosition, increment: false};
}

function slideItem (item: WorkspaceItem, increment: boolean) {
  return {
    ...item,
    position: increment ? item.position + 1 : item.position - 1
  };
}

function hasToSlide ({position}: WorkspaceItem, start: number, end: number) {
  return position >= start && position <= end;
}
