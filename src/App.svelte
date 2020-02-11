<script>
	import { getTimeBlocks } from './helpers.js';
	import TimeBlock from './TimeBlock.svelte';
	import { onDestroy } from 'svelte';

	let timeEntries = [];
	let gaps = [];

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

	const findGaps = () => {
		let newGaps = [];
		timeEntries.forEach((entry, index) => {
			// off screen
			const isOffScreen = timeToPx(entry.start) < 0;
			if (index === 0 || isOffScreen) {
				return;
			}

			const previousEntry = entry[index - 1];
			const gap = entry.start - previousEntry.end;

			// check for overlap
			if (gap > 0) {
				newGaps.push({
					start: previousEntry.end,
					end: entry.start
				});
			}
		});

		gapBlocks = newBlocks;
	}

	const getBlocks = async () => {
		timeEntries = await getTimeBlocks()
			.catch(error => console.error(error));

		gaps = findGaps(timeEntries);
	}

	getBlocks();

	const fetchPollInterval = setInterval(getBlocks, fetchPollSeconds);
	const timePollInterval = setInterval(updateCursor, timePollSeconds);

	onDestroy(() => {
		clearInterval(fetchPollInterval)
		clearInterval(timePollInterval)
	});
</script>

<!-- <svelte:window on:resize={updateTimeBlocks} /> -->

<main>
	<div class='time-block-container'>
		{#each timeEntries as t}
			<TimeBlock start={t.start} end={t.end} color={t.color} timeToPx={timeToPx} />
		{/each}
		{#each gaps as g}
			<TimeBlock start={g.start} end={g.end} isGap={true} timeToPx={timeToPx} />
		{/each}
		<div class='time-cursor' style='top: {timeToPx(todayMs)}px'></div>
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