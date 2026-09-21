<script lang="ts">
	let { styles }: { styles: string[] } = $props();
</script>

{#each styles as url (url)}
	<link href={url} rel="stylesheet" />
{/each}
