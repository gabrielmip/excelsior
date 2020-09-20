<script lang="ts">
  import { workspaceStore } from "./stores";
  import type { WorkspaceItem } from "./stores";

  let searchInput: string = "";
  let workspaceItems: WorkspaceItem[];
  let filtered: WorkspaceItem[];

  function filterWorkspaceItems(
    items: WorkspaceItem[],
    search: string
  ): WorkspaceItem[] {
    if (search.trim().length === 0) {
      return items;
    }

    return items.filter(({ expression: { identifier } }) =>
      identifier.includes(search)
    );
  }

  $: {
    workspaceItems = [...$workspaceStore.values()];
    filtered = filterWorkspaceItems(workspaceItems, searchInput);
  }
</script>

<style>

</style>

<nav>

  {#if workspaceItems.length > 0}
    <input type="text" bind:value={searchInput} placeholder="Buscar" />
  {/if}

  <p>
    {#if workspaceItems.length === 0}
      As expressões que você definir serão listadas aqui.
    {/if}
  </p>

  <ul>
    {#each filtered as item}
      <li>
        <a href={'#' + item.expression.identifier}>
          {item.expression.identifier}
        </a>
        {#if item.evaluation !== undefined}{item.evaluation}{:else}Alô, alô{/if}
      </li>
    {/each}
  </ul>

  {#if filtered.length === 0 && workspaceItems.length > 0}
    Nenhum resultado para a busca.
  {/if}
</nav>
