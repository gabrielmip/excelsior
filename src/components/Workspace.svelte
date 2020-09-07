<script lang="ts">
  import { expressionStore, scopeStore } from "./stores";
</script>

<style>

</style>

{#each $expressionStore as exp}
  <div>{exp.identifier} = {$scopeStore[exp.identifier]}</div>
{/each}
