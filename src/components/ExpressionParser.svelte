<script lang="ts">
  import { expressionStore } from "./stores";
  import { parseUserInput } from "../logic/parser";

  let rawInput: string = "";
  let result: string = "";

  function parseIfIsEnter({ code }: KeyboardEvent): void {
    const trimmedInput = rawInput.trim();
    if (code === "Enter" && trimmedInput.length > 0) {
      parse(trimmedInput);
    }
  }

  function parse(trimmedInput: string) {
    const parseResult = parseUserInput(trimmedInput);
    if (parseResult.hasError === false) {
      result = parseResult.result.stringified;
      expressionStore.add(parseResult.result);
      rawInput = "";
    } else {
      // TODO: Flash input to show error
      // TODO: Show error below the input in small tag
    }
  }
</script>

<style>

</style>

<input type="text" bind:value={rawInput} on:keypress={parseIfIsEnter} />

<p>{result}</p>
