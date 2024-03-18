<script lang="ts">
    import type {StylesManager} from '@beyond-js/widgets/render';

    export let styles: StylesManager;
</script>

{#each [...styles.resources] as url}
    <link href="{url}" rel="stylesheet" on:load={url => {styles.onloaded(url)}}/>
{/each}
