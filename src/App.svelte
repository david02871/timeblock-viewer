<script>
	import { getTimeBlocks } from './clockify.js';
	import { onDestroy } from 'svelte';

	let timeBlocks = [];
	let timeEntries = [];
	let gapBlocks = [];

	let today = new Date();
	let todayMs = today.getTime();
	let startTimeMs = today.setHours(9, 0, 0, 0); // 9:00am
	let endTimeMs = today.setHours(18, 0, 0, 0); // 6:00pm

	let fetchPollSeconds = 60000; // fetch new timeblocks every minute
	let timePollSeconds = 10000; // update cursor time every 10 seconds

	const updateCursor = () => {
		today = new Date();
		todayMs = today.getTime();
	}

	const timeToPx = (timeMs) => {
		const windowHeight = window.innerHeight;
		const px = ((timeMs - startTimeMs) / (endTimeMs - startTimeMs)) * windowHeight;

		return Math.min(px, windowHeight);
	}

	const updateTimeBlocks = () => {
		timeBlocks = timeEntries.map(entry => ({
			startPx: timeToPx(entry.start),
			heightPx: Math.max(timeToPx(entry.end) - timeToPx(entry.start), 2),
			...entry
		}));
	}

	const updateGapBlocks = () => {
		let newBlocks = [];
		timeBlocks.forEach((item, index) => {
			// off screen
			if (index === 0 || item.startPx < 1) {
				return;
			}

			const previousItem = timeBlocks[index - 1];
			const previousItemEndPx = previousItem.startPx + previousItem.heightPx;
			const gapPx = item.startPx - previousItemEndPx;

			// overlap
			if (gapPx < 1) {
				return;
			}

			newBlocks.push({
				startPx: previousItemEndPx,
				heightPx: gapPx
			});
		});

		gapBlocks = newBlocks;
	}

	const getBlocks = async () => {
		timeEntries = await getTimeBlocks()
			.catch(error => console.error(error));

		updateTimeBlocks();
		updateGapBlocks();
	}

	getBlocks();

	const fetchPollInterval = setInterval(getBlocks, fetchPollSeconds);
	const timePollInterval = setInterval(updateCursor, timePollSeconds);

	onDestroy(() => {
		clearInterval(fetchPollInterval)
		clearInterval(timePollInterval)
	});
</script>

<svelte:window on:resize={updateTimeBlocks} />

<main>
	<div class='time-block-container'>
		{#each timeBlocks as tb}
			{#if tb.startPx > -1}
				<div 
					class='time-block' 
					style='background-color:{ tb.color }; top:{ tb.startPx }px; height:{ tb.heightPx }px;'
				>
				</div>
			{/if}
		{/each}

		{#each gapBlocks as tb}
			{#if tb.startPx > -1}
				<div 
					class='gap-block' 
					style='top:{ tb.startPx }px; height:{ tb.heightPx }px;'
				>
				</div>
			{/if}
		{/each}

		<div class='time-cursor' style='top: { timeToPx(todayMs) }px'></div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: black;
	}

	main {
		height: 100vh;
	}

	.gap-block {
		position: absolute;
		overflow-y: hidden;
		left: 0px;
		width: 100%;
		background-color: #222;
		cursor: pointer;
	}

	.time-block {
		position: absolute;
		overflow-y: hidden;
		border-bottom: 2px solid #222;
		border-top: 2px solid #222;
		left: 0px;
		width: 100%;
		cursor: pointer;
	}

	.time-cursor {
		position: absolute;
		overflow-y: hidden;
		width: 100%;
		height: 3px;
		background-color: lawngreen;
	}

	.time-block-container {
		background-color: #222;
		width: 100%;
		height: 100%;
	}
</style>