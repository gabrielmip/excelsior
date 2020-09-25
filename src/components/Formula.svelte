<script lang="ts">
  import type { Expression, Symbol } from "../logic/parser";
  import { workspaceStore } from "./stores";
  import type { WorkspaceItem } from "./stores";
  import ExpressionParser from "./ExpressionParser.svelte";

  export let wsItem: WorkspaceItem;

  let missingDependencies: string;

  $: missingDependencies = wsItem.expression.dependencies
    .filter((dep: Symbol) => !$workspaceStore.has(dep))
    .join(", ");
</script>

<style>
  .container {
    margin-bottom: 15px;
    display: flex;
  }

  .expression-holder {
    flex: 1;
  }

  .actions {
    display: flex;
    flex-direction: column;
  }

  .result {
    margin-top: 5px;
  }

  button {
    padding: 2px 8px 5px;
    background-color: white;
    border: 0;
    color: tomato;
    border-radius: 50%;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover,
  button:focus {
    background-color: #f6dbdf;
  }
</style>

<div class="container" id={wsItem.expression.identifier}>
  <div class="expression-holder">
    <ExpressionParser current={wsItem.expression} />

    <div class="result">
      {#if wsItem.evaluation !== undefined}
        {wsItem.evaluation}
      {:else}Dependências faltantes: {missingDependencies}{/if}
    </div>

  </div>

  <div class="actions">
    <button
      title="Deletar"
      on:click={() => workspaceStore.remove(wsItem.expression.identifier)}>
      x
    </button>
  </div>
</div>
