<script lang="ts">
  import type { UrlModelDateType } from "../utils/apiWrapper"

  export let urlInfo: UrlModelDateType
</script>

<p>The redirect url is: <span>{urlInfo.full_url}</span></p>
<p>
  It was created at: <span
    >{new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(urlInfo.created_at)}</span
  >
</p>
<p>It has <span>{urlInfo.views}</span> views</p>
