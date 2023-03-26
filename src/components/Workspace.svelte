<script lang="ts">
  import { flip } from "svelte/animate";
  import { quintInOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  import { expressionStore } from "../components/stores";
  import type { WorkspaceItem } from "../components/stores";
  import Formula from "../components/Formula.svelte";

  let workspaceItems: WorkspaceItem[];

  $: workspaceItems = getSortedItems($expressionStore.values());

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 200,
        easing: quintInOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  function getSortedItems(storeValues: IterableIterator<WorkspaceItem>) {
    const items = Array.from(storeValues);
    items.sort((left, right) => left.position - right.position);
    return items;
  }
</script>

{#each workspaceItems as item (item.expression.identifier)}
  <div
    class="formula"
    id={item.expression.identifier}
    in:receive={{ key: item.expression.identifier }}
    out:send={{ key: item.expression.identifier }}
    animate:flip={{ duration: 200 }}
  >
    <Formula wsItem={item} />
  </div>
{/each}

<style>
  .formula {
    display: flex;
  }
</style>
