<script lang="ts">
    export let styles: string[];
</script>

{#each styles as url}
    <link href="{url}" rel="stylesheet"/>
{/each}
