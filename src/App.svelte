<script lang="ts">
  import Header from "./components/Header.svelte";
  import ExpressionParser from "./components/ExpressionParser.svelte";
  import Workspace from "./components/Workspace.svelte";
</script>

<style>
  main {
    margin: 0 auto;
    padding: 10px;
    max-width: 1000px;
  }
</style>

<main>
  <Header />
  <ExpressionParser />
  <Workspace />
</main>
