<script>
	export let isGap = false;
	export let color = '#222';
	export let start = 0;
	export let end = 0;
	export let startPx = 0;
	export let height = 0;
	export let name = '';

	let windowActive = false;
</script>

<svelte:body 
	on:mouseenter={() => windowActive = true}
	on:mouseleave={() => windowActive = false}
/>

{#if startPx > -1}
	{#if !isGap}
		<div 
			class='time-block' 
			style='background-color:{color}; top:{startPx}px; height:{height}px;'
		>
			<span class='{!windowActive && 'hidden'}'>{name}</span>
		</div>
	{:else}
		<div class='gap-block' style='top:{startPx}px; height:{height}px;'></div>
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

	.time-block span {
		font-size: 13px;
		font-family: monospace;
		padding: 3px; 
	}

	.hidden {
		display: none;
	}

	div:hover {
		opacity: 0.7;
		transition: 0.3s;
	}

	.gap-block {
		background-color: yellow;
	}
</style>