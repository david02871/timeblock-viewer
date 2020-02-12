<script>
	import { getTimeBlocks } from './helpers.js';
	import TimeBlock from './TimeBlock.svelte';
	import { onMount, onDestroy } from 'svelte';

	let height = window.innerHeight;
	let timeEntries = [];

	let today = new Date();
	$: todayMs = today.getTime();
	$: startTimeMs = today.setHours(9, 0, 0, 0); // 9:00am
	$: endTimeMs = today.setHours(18, 0, 0, 0); // 6:00pm

	let fetchPollSeconds = 60000; // fetch new timeblocks every minute
	let timePollSeconds = 10000; // update cursor time every 10 seconds

	$: gaps = timeEntries
		.map((e, i) => ({ start: i && timeEntries[i - 1].end, end: e.start })) // gaps between entries
		.filter(e => (e.end > startTimeMs) && (e.end - e.start > 0)); // on screen only, no overlaps

	const timeToPx = (timeMs) => {
		const px = ((timeMs - startTimeMs) / (endTimeMs - startTimeMs)) * height;
		return Math.min(px, height);
	}

	const getBlocks = async () => {
		timeEntries = await getTimeBlocks()
			.catch(error => console.error(error));
	}

	const fetchPollInterval = setInterval(getBlocks, fetchPollSeconds);
	const timePollInterval = setInterval(() => today = new Date(), timePollSeconds);

	onMount(() => {
		getBlocks();
	})

	onDestroy(() => {
		clearInterval(fetchPollInterval);
		clearInterval(timePollInterval);
	});
</script>

<svelte:window bind:innerHeight={height} />

<main>
	<div class='time-block-container'>
		{#each timeEntries as t}
			<TimeBlock timeToPx={timeToPx} {...t} />
		{/each}
		{#each gaps as g}
			<TimeBlock isGap={true} timeToPx={timeToPx} {...g} />
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