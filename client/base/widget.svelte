<script lang="ts">
    import type {StylesManager} from '@beyond-js/widgets/render';
    import type {Wrapper} from './wrapper';
    import Styles from './styles.svelte';

    export let styles: StylesManager;
    export let wrapper: Wrapper;
    export let holder: HTMLSpanElement;
    export let props: Record<string, any>;

    // Check for styles to be loaded
    let {loaded} = styles;
    !styles.loaded && styles.ready.then(() => {
        holder.style.display = '';
        loaded = true;
    });

    const {Widget} = wrapper;
</script>

<Styles styles={styles}/>

{#if loaded}
    <svelte:component this={Widget} {...props}/>
{/if}
