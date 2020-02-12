<script>
	export let isGap = false;
	export let color = '#222';
	export let start = 0;
	export let end = 0;
	export let name = '';
	export let timeToPx = () => {};

	let startPos = timeToPx(start);
	let height = Math.max(timeToPx(end) - timeToPx(start), 2);
</script>

{#if startPos > -1}
	{#if !isGap}
		<div style='background-color:{color}; top:{startPos}px; height:{height}px;'></div>
	{:else}
		<div class='gap-block' style='top:{startPos}px; height:{height}px;'></div>
	{/if}
{/if}

<style>
	div {
		position: absolute;
		left: 0px;
		width: 100%;
		overflow-y: hidden;
		border-bottom: 2px solid #222;
		border-top: 2px solid #222;
		cursor: pointer;
	}

	div:hover {
		opacity: 0.7;
		transition: 0.3s;
	}

	.gap-block {
		background-color: yellow;
	}
</style>