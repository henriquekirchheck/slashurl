<script lang="ts">
  import DisplayUrlInfo from "./DisplayUrlInfo.svelte"
  import type { CreateUrlResponseType } from "../utils/apiWrapper"

  export let createUrlResponse: CreateUrlResponseType
</script>

<p>The generated url is: <span>{createUrlResponse.url}</span></p>
<DisplayUrlInfo urlInfo={createUrlResponse.info} />
