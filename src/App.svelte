<script>
	import { getTimeBlocks } from './clockify.js';

	// TODO
	// Minimum height, inline blocks (expand on hover)
	// Poll for updates
	// Show current time
	// scroll through time
	// in progress tasks

	const today = new Date();

	let timeBlocks = [];
	let timeEntries = [];
	let timeFromMs = today.setHours(9, 0, 0, 0); // 9:00am
	let timeToMs = today.setHours(18, 0, 0, 0); // 6:00pm

	function timeToPx(timeMs) {
		const windowHeight = window.innerHeight;
		const px = ((timeMs - timeFromMs) / (timeToMs - timeFromMs)) * windowHeight;

		return Math.min(px, windowHeight);
	}

	function updateTimeBlocks() {
		timeBlocks = timeEntries.map(entry => ({
			startPx: timeToPx(entry.start),
			endPx: timeToPx(entry.end),
			...entry
		}));
	}

	async function init() {
		timeEntries = await getTimeBlocks()
			.catch(error => console.error(error));

		updateTimeBlocks();
	}

	init();
</script>

<svelte:window on:resize={updateTimeBlocks} />

<main>
	<div class='time-block-container'>
		{#each timeBlocks as tb}
			{#if tb.startPx > -1}
				<div class='time-block' style='background-color:{tb.project.color}; top:{tb.startPx}px; height:{tb.endPx - tb.startPx}px;'></div>
			{/if}
		{/each}

		<div class='time-cursor' style='top: {timeToPx(new Date().getTime())}px'></div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		height: 100vh;
	}

	.time-block {
		position: absolute;
		overflow-y: hidden;
		left: 0px;
		width: 100%;
	}

	.time-cursor {
		position: absolute;
		overflow-y: hidden;
		width: 100%;
		height: 3px;
		background-color: black;
	}

	.time-block-container {
		background-color: #f6fafd;
		width: 100%;
		height: 100%;
	}
</style>