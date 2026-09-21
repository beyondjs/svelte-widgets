<script lang="ts">
	import type { StylesManager } from '@beyond-js/widgets/render';
	import type { Wrapper } from './wrapper';
	import Styles from './styles.svelte';

	let { styles, wrapper, holder, props, hydrating = false }: { styles: StylesManager; wrapper: Wrapper; holder: HTMLSpanElement; props: Record<string, any>; hydrating?: boolean } = $props();

	// The view is shown once its stylesheets are loaded. Server markup is hydrated at once: the view is
	// already there, and hydrating it later would replace the nodes the server wrote.
	let loaded = $state(styles.loaded || hydrating);
	!styles.loaded && styles.ready.then(() => {
		holder.style.display = '';
		loaded = true;
	});
	styles.loaded && (holder.style.display = '');

	// An update of the module advances the version, which renders the current component again
	let version = $state(wrapper.version);
	wrapper.changed = () => (version = wrapper.version);
</script>

<Styles {styles} />

{#if loaded}
	{#key version}
		{@const Widget = wrapper.Widget}
		<Widget {...props} />
	{/key}
{/if}
