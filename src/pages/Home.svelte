<script lang="ts">
  import Header from "../components/Header.svelte";
  import ExpressionParser from "../components/ExpressionParser.svelte";
  import Workspace from "../components/Workspace.svelte";
  import Navigation from "../components/Navigation.svelte";
  import ActionButtons from "../components/ActionButtons.svelte";
  import Chart from "../components/Chart.svelte";
</script>

<main>
  <header class="header">
    <Header />
  </header>
  <nav class="parser">
    <ExpressionParser clearOnFinish={true} />
  </nav>
  <div class="action-buttons">
    <ActionButtons />
  </div>
  <div class="navigation">
    <Navigation />
  </div>
  <div class="workspace">
    <Workspace />
  </div>
  <div class="chart">
    <Chart />
  </div>
</main>

<style>
  main {
    display: grid;
    grid-gap: 20px 60px;
    grid-template-columns: 2fr 7fr;
    grid-template-rows: min-content min-content min-content auto;
    grid-template-areas:
      "chart      header"
      "chart      parser"
      "chart      actionButtons"
      "navigation workspace";

    margin: 0 auto;
    padding: 0 20px;
    height: 99vh;
    max-width: 900px;
  }

  @media (max-width: 550px) {
    main {
      grid-template-columns: 1fr;
      grid-gap: 30px;
      grid-template-rows: min-content min-content min-content auto auto;
      grid-template-areas:
        "header"
        "parser"
        "actionButtons"
        "workspace"
        "chart";
    }

    .navigation {
      display: none;
    }
  }

  .chart {
    grid-area: chart;
    align-self: end;
  }

  .header {
    grid-area: header;
  }

  .parser {
    grid-area: parser;
  }

  .navigation {
    grid-area: navigation;
  }

  .action-buttons {
    grid-area: actionButtons;
    min-height: 41px;
  }

  .workspace {
    grid-area: workspace;
    overflow-y: auto;
    overflow-x: visible;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
