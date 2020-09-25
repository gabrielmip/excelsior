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
  h2 {
    margin-top: 0px;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    margin-bottom: 5px;
  }

  input {
    width: 100%;
  }
</style>

<nav>
  <h2>Seus símbolos</h2>

  {#if workspaceItems.length > 0}
    <input type="text" bind:value={searchInput} placeholder="Buscar" />
  {/if}

  <p>
    {#if workspaceItems.length === 0}
      Os símbolos que você definir serão listados aqui.
    {/if}
  </p>

  <ul>
    {#each filtered as item}
      <li>
        <a href={'#' + item.expression.identifier}>
          {item.expression.identifier}
        </a>
        {#if item.evaluation !== undefined}= {item.evaluation}{/if}
      </li>
    {/each}
  </ul>

  {#if filtered.length === 0 && workspaceItems.length > 0}
    Nenhum resultado para a busca.
  {/if}
</nav>
