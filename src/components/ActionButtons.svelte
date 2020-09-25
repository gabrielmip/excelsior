<script lang="ts">
  import { workspaceStore } from "./stores";
</script>

{#if $workspaceStore.size > 0}
  <button on:click={workspaceStore.reset}>Limpar tudo</button>
{/if}
