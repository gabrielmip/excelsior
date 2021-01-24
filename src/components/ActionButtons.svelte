<script lang="ts">
  import { expressionStore } from "./stores";
</script>

{#if $expressionStore.size > 0}
  <button on:click={expressionStore.reset}>Limpar tudo</button>
{/if}
