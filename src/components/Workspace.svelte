<script lang="ts">
  import { workspaceStore } from "./stores";
  import Formula from "./Formula.svelte";
  import type { WorkspaceItem } from "./stores";

  let workspaceItems: WorkspaceItem[];

  $: workspaceItems = [...$workspaceStore.values()];
</script>

<style>
  .actions {
    margin-bottom: 20px;
  }
</style>

{#if $workspaceStore.size > 0}
  <div class="actions">
    <button on:click={workspaceStore.reset}>Limpar tudo</button>
  </div>
{/if}

<div>
  {#each workspaceItems as item (item.expression.identifier)}
    <Formula wsItem={item} />
  {/each}
</div>
