<script lang="ts">
  import Header from "./components/Header.svelte";
  import ExpressionParser from "./components/ExpressionParser.svelte";
  import Workspace from "./components/Workspace.svelte";
</script>

<style>
  #main {
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

<div id="main">
  <Header />
  <ExpressionParser clearOnFinish={true} />
  <div id="workspace-container">
    <Workspace />
  </div>

</div>
