<script lang="ts">
  import { workspaceStore } from "./stores";
  import Formula from "./Formula.svelte";
  import type { WorkspaceItem } from "./stores";

  let workspaceItems: WorkspaceItem[];

  $: workspaceItems = [...$workspaceStore.values()];
</script>

<style>

</style>

<div>
  {#each workspaceItems as item (item.expression.identifier)}
    <Formula wsItem={item} />
  {/each}
</div>
