<script lang="ts">
  import { expressionStore } from "./stores";
  import type { Literal } from "../services/parseUserInput";
  import type { WorkspaceItem } from "./stores";
  import ExpressionParser from "./ExpressionParser.svelte";
  import LocalizedExpression from "./LocalizedExpression.svelte";

  export let wsItem: WorkspaceItem;

  let missingDependencies: string;

  $: missingDependencies = wsItem.expression.dependencies
    .filter((dep: Literal) => !$expressionStore.has(dep))
    .join(", ");
</script>

<div class="expression-holder">
  <ExpressionParser current={wsItem.expression} />

  <div class="result">
    {#if wsItem.evaluation !== undefined}
      <LocalizedExpression stringified={wsItem.evaluation.toString()} />
    {:else}Dependências faltantes: {missingDependencies}{/if}
  </div>
</div>

<div class="actions">
  <button
    title="Deletar"
    on:click={() => expressionStore.remove(wsItem.expression)}
  >
    x
  </button>
</div>

<style>
  .expression-holder {
    flex: 1;
  }

  .actions {
    display: flex;
    flex-direction: column;
  }

  .result {
    margin-top: 4px;
  }

  button {
    padding: 2px 8px 4px;
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
