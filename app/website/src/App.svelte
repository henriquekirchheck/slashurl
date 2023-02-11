<script lang="ts">
  import type { UrlModelType } from "@slashurl/api-wrapper"
  import { createQuery } from "@tanstack/svelte-query"
  import axios from "axios"
  import { urlApiWrapper } from "./utils/apiWrapper"

  const shortURLS = createQuery({
    queryKey: ["todos"],
    queryFn: () =>
      axios
        .request<UrlModelType[]>(
          urlApiWrapper.getAxiosConfigConstructor("list_urls")()
        )
        .then((res) => res.data),
  })
</script>

<h1>Hello World!</h1>
<div>
  {#if $shortURLS.isLoading}
    <p>Loading...</p>
  {:else if $shortURLS.isError}
    <p>
      Error: {#if axios.isAxiosError($shortURLS.error)}
        {$shortURLS.error.message}
      {/if}
    </p>
  {:else if $shortURLS.isSuccess}
    {#each $shortURLS.data as shortUrl}
      <section>
        <p>{shortUrl.short_url}</p>
        <p>{shortUrl.full_url}</p>
        <p>{shortUrl.views}</p>
        <p>{shortUrl.created_at}</p>
      </section>
    {/each}
  {/if}
</div>
