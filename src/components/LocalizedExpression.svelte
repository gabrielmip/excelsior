<script lang="ts">
  import { userStore } from "./stores";
  import { addLocalization } from "../services/localizeExpressions";

  export let stringified: string;

</script>

{addLocalization(stringified, $userStore)}
