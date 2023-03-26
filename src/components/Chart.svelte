<script lang="ts">
  import { Bar } from "svelte-chartjs";
  import { expressionStore } from "./stores";
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from "chart.js";

  let data;
  let expressions;

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  $: {
    expressions = [...$expressionStore.entries()]
      .filter(([, value]) => value.evaluation !== undefined)
      .map(([key, value]) => ({ label: key, data: value.evaluation }));

    data = {
      labels: expressions.map((a) => a.label),
      datasets: [
        {
          label: "Símbolos",
          data: expressions.map((a) => a.data),
          backgroundColor: "rgba(209, 135, 209, 0.5)",
          borderColor: "purple",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }
</script>

{#if data}
  <Bar {data} {options} />
{/if}

<style>
</style>
