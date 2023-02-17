<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query"
  import { urlApiWrapper } from "./utils/apiWrapper"

  const shortUrls = createQuery({
    queryKey: ["todos"],
    queryFn: urlApiWrapper.getListUrlsInfoFetch()
  })
</script>

<h1>Hello World!</h1>
<div>
{#if $shortUrls.isLoading}
  <p>Loading</p>
{:else if $shortUrls.isError}
  <p>Error: {$shortUrls.error}</p>
{:else if $shortUrls.isSuccess}
  {#each $shortUrls.data as shortUrl}
    <section>
      <p>{shortUrl.short_url}</p>
      <p>{shortUrl.full_url}</p>
      <p>{shortUrl.created_at}</p>
      <p>{shortUrl.views}</p>
    </section>
  {/each}
{/if}
</div>
