<script lang="ts">
  import Header from "./components/Header.svelte";
  import ExpressionParser from "./components/ExpressionParser.svelte";
  import Workspace from "./components/Workspace.svelte";
  import Navigation from "./components/Navigation.svelte";
</script>

<style>
  main {
    margin: 0 auto;
    padding: 0;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    max-height: 99vh;
  }

  #workspace-container {
    margin-top: 30px;
    overflow-y: auto;
    flex: 1;
  }
</style>

<main>
  <Header />
  <ExpressionParser clearOnFinish={true} />
  <div id="navigation">
    <Navigation />
  </div>
  <div id="workspace-container">
    <Workspace />
  </div>

</main>
