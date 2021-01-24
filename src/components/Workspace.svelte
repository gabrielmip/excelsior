<script lang="ts">
  import { expressionStore } from "../components/stores";
  import type { WorkspaceItem } from "../components/stores";
  import Formula from "../components/Formula.svelte";

  let workspaceItems: WorkspaceItem[];

  $: workspaceItems = getSortedItems($expressionStore.values());
  $: console.log($expressionStore);

  function getSortedItems(storeValues: IterableIterator<WorkspaceItem>) {
    const items = Array.from(storeValues);
    items.sort((left, right) => left.position - right.position);
    return items;
  }
</script>

<style>

</style>

<div>
  {#each workspaceItems as item (item.expression.identifier)}
    <Formula wsItem={item} />
  {/each}
</div>
