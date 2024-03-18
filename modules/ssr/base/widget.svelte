<script lang="ts">
    import type {StylesManager} from '@beyond-js/widgets/render';
    import Styles from './styles.svelte';

    export let Widget: any;
    export let styles: StylesManager;
    export let props: Record<string, any>;
</script>

<Styles styles={styles}/>
<svelte:component this={Widget} {...props}/>
