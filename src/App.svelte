<script lang="ts">
  import { parse } from "mathjs";
  import { onMount, afterUpdate } from "svelte";
  import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
  import { GreenOrangeTeal12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau";
  import Chart from "chart.js";

  let canvas;
  let chart;
  let content = "";
  let expressions = [];

  let scope = {};
  let symbolDependencyCount = {};
  let symbolsBeingEdited = {};
  let missingDependenciesBySymbol = {};

  onMount(renderChart);
  afterUpdate(() => {
    if (chart) {
      const newData = expressions.map(({ symbol }) =>
        symbol in scope ? scope[symbol] : null
      );
      chart.data.labels = expressions.map(({ symbol }) => symbol);
      chart.data.datasets.forEach((dataset) => {
        dataset.data = newData;
      });

      chart.update();
    }
  });

  function renderChart() {
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: expressions.map(({ symbol }) => symbol),
        datasets: [
          {
            backgroundColor: GreenOrangeTeal12,
            data: expressions.map(({ symbol }) =>
              symbol in scope ? scope[symbol] : null
            ),
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        plugins: {
          colorschemes: {
            scheme: GreenOrangeTeal12,
          },
        },
      },
    });
  }

  function print({ code }) {
    if (code === "Enter" && content.trim().length > 0) {
      parseInput(content);
      content = "";
    }
  }

  function checkForEnterKeyInUpdate({ code }, exp) {
    if (code === "Enter" && symbolsBeingEdited[exp.symbol].trim().length > 0) {
      updateRightHandSide(exp, symbolsBeingEdited[exp.symbol]);
    }
  }

  function parseInput(inputedContent) {
    const parsed = parse(inputedContent);
    persistParsedInput(parsed);
  }

  function persistParsedInput(parsed) {
    const symbols = getSymbolNames(parsed);

    if (parsed.isAssignmentNode) {
      const [createdSymbol, ...dependencies] = symbols;
      const newExpression = {
        symbol: createdSymbol,
        dependencies,
        rightHandSide: parsed.value.toString(),
        prettified: parsed.toString(),
        tree: parsed,
      };
      if (dependencies.length === 0) {
        newExpression.updatedValue = parsed.value.evaluate();
      } else {
        instantiateDependencies(dependencies);
      }

      expressions = [
        ...expressions.filter(({ symbol }) => symbol !== createdSymbol),
        newExpression,
      ].sort((a, b) => a.symbol.localeCompare(b.symbol));
      symbolDependencyCount[createdSymbol] = dependencies.length;

      updateScope();
    } else {
      try {
        console.log(parsed.evaluate(scope));
      } catch (error) {
        console.log("Failed to parse non-assignment");
        const expression = expressions.find(
          ({ symbol }) => symbol === parsed.name
        );
        if (expression) {
          console.log(expression.prettified);
        }
      }
    }
  }

  function getSymbolNames(parsed) {
    return parsed
      .filter(({ isSymbolNode }) => isSymbolNode)
      .map(({ name }) => name);
  }

  function updateScopeStartingFromExpression(
    expression,
    currentScope,
    expressions
  ) {
    symbolDependencyCount[expression.symbol] = expression.dependencies.length;

    for (const dep of expression.dependencies) {
      const depExpression = expressions.find(({ symbol }) => symbol === dep);
      if (depExpression) {
        currentScope = updateScopeStartingFromExpression(
          depExpression,
          currentScope,
          expressions
        );
      }
    }

    const missingDependencies = expression.dependencies.filter(
      (name) => !(name in currentScope)
    );

    if (missingDependencies.length === 0) {
      currentScope[expression.symbol] = expression.tree.evaluate(currentScope);
    }

    missingDependenciesBySymbol[expression.symbol] = missingDependencies;

    return currentScope;
  }

  function updateScope() {
    scope = expressions.reduce(
      (currentScope, expression) =>
        updateScopeStartingFromExpression(
          expression,
          currentScope,
          expressions
        ),
      {}
    );
  }

  function clearWorkSpace() {
    expressions = [];
    scope = {};
    symbolDependencyCount = {};
    symbolsBeingEdited = {};
    missingDependenciesBySymbol = {};
  }

  function updateAssignment({ symbol, updatedValue }) {
    persistParsedInput(parse(`${symbol} = ${updatedValue}`));
  }

  function enableEditing(expression) {
    symbolsBeingEdited[expression.symbol] = expression.rightHandSide;
  }

  function disableEditing(expression) {
    symbolsBeingEdited[expression.symbol] = undefined;
  }

  function deleteExpression({ symbol: deletedSymbol }) {
    // const isDependency = expressions.some(({dependencies}) => dependencies.includes(deletedSymbol));
    expressions = expressions.filter(({ symbol }) => symbol !== deletedSymbol);
    updateScope();
  }

  function updateRightHandSide(expression, newContent) {
    parseInput(`${expression.symbol} = ${newContent}`);
    disableEditing(expression);
  }

  function instantiateDependencies(dependencies) {
    dependencies
      .filter((symbol) => !(symbol in scope))
      .forEach((dep) => {
        const parsedDep = parse(`${dep} = 0`);
        expressions.push({
          symbol: dep,
          dependencies: [],
          rightHandSide: parsedDep.value.value.toString(),
          prettified: parsedDep.toString(),
          tree: parsedDep,
          updatedValue: 0,
        });
        symbolDependencyCount[dep] = 0;
      });
    expressions = expressions.sort((a, b) => a.symbol.localeCompare(b.symbol));
    updateScope();
  }

  function focusOnAppear(element) {
    element.focus();
  }
</script>

<style>
  h1 {
    color: indianred;
  }

  * {
    font-family: "Courier New", Courier, monospace;
  }

  .formula-container {
    margin-bottom: 15px;
    border: 3px solid limegreen;
    border-radius: 3px;
    padding: 15px;
  }

  input {
    border: 0;
    border-bottom: 2px solid;
    background-color: inherit;
    color: inherit;
  }

  .formulas {
    display: flex;
    flex-wrap: wrap;
  }
</style>

<h1>excelsior</h1>

<input type="text" bind:value={content} on:keypress={print} />

<button on:click={() => print({ code: 'Enter' })}>Adicionar</button>

<button on:click={clearWorkSpace} style="background-color: red; color: white">
  Limpar expressões
</button>

<div style="width: 700px; background-color: white">
  <canvas bind:this={canvas} width="2" height="1" />
</div>

<h2>Área de trabalho</h2>

<div class="formulas">
  {#each expressions as exp}
    <div class="formula-container">
      {exp.symbol} =
      {#if symbolsBeingEdited[exp.symbol] === undefined}
        {#if symbolDependencyCount[exp.symbol] === 0}
          <input
            type="number"
            bind:value={exp.updatedValue}
            on:change={() => updateAssignment(exp)} />
        {:else}
          {exp.rightHandSide}
          <br />
          Calculado:
          {#if exp.symbol in scope}{scope[exp.symbol].toFixed(2)}{:else}-{/if}
        {/if}

        <button on:click={() => enableEditing(exp)}>Editar</button>
        <button on:click={() => deleteExpression(exp)}>Deletar</button>

        {#if missingDependenciesBySymbol[exp.symbol].length > 0}
          <br />
          Dependências não definidas:
          {#each missingDependenciesBySymbol[exp.symbol] as dep}{dep},{/each}
          <button
            on:click={() => instantiateDependencies(missingDependenciesBySymbol[exp.symbol])}>
            Definir
          </button>
        {/if}
      {:else}
        <input
          type="text"
          use:focusOnAppear
          bind:value={symbolsBeingEdited[exp.symbol]}
          on:keypress={(event) => checkForEnterKeyInUpdate(event, exp)} />
        <button
          on:click={() => updateRightHandSide(exp, symbolsBeingEdited[exp.symbol])}>
          Salvar
        </button>
        <button on:click={() => disableEditing(exp)}>Cancelar</button>
      {/if}
    </div>
  {/each}
</div>
