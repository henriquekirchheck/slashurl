<script lang="ts">
  import DisplayCreatedUrlInfo from "./lib/DisplayCreatedUrlInfo.svelte"

  import { createMutation } from "@tanstack/svelte-query"
  import { urlApiWrapper } from "./utils/apiWrapper"
  const createUrlMutation = createMutation(["createUrl"], (full_url: string) =>
    urlApiWrapper.getCreateUrlFetch(full_url)()
  )

  let fullUrl: string

  function submitCreateUrl() {
    $createUrlMutation.mutate(fullUrl)
  }

  $: lastCreateUrlInfo = $createUrlMutation.data
</script>

<div>
  <form on:submit|preventDefault|stopPropagation={submitCreateUrl}>
    <label for="full-url">URL to be shortened</label>
    <input type="url" name="Full URL" id="full-url" bind:value={fullUrl} />
    <button type="submit"> Create ShortURL </button>
  </form>
  {#if lastCreateUrlInfo}
    <div>
      <DisplayCreatedUrlInfo createUrlResponse={lastCreateUrlInfo} />
    </div>
  {/if}
</div>
