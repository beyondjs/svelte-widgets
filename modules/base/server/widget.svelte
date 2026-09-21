<script lang="ts">
	import type { StylesManager } from '@beyond-js/widgets/render';
	import Styles from './styles.svelte';

	let { Widget, styles, props }: { Widget: any; styles: StylesManager; props: Record<string, any> } = $props();
</script>

<Styles {styles} />
<Widget {...props} />
