<script lang="ts">
	import type { StylesManager } from '@beyond-js/widgets/render';
	import { onDestroy } from 'svelte';

	let { styles }: { styles: StylesManager } = $props();

	let resources = $state([...styles.resources]);
	const listener = () => (resources = [...styles.resources]);
	styles.on('change', listener);
	onDestroy(() => styles.off('change', listener));

	const failed = (url: string) => (styles.onerror ? styles.onerror(url) : styles.onloaded(url));
</script>

{#each resources as url (url)}
	<link href={url} rel="stylesheet" onload={() => styles.onloaded(url)} onerror={() => failed(url)} />
{/each}
