<script>
	import { getTimeBlocks } from './helpers.js';
	import TimeBlock from './TimeBlock.svelte';
	import Cursor from './Cursor.svelte';
	import { onMount, onDestroy } from 'svelte';

	let height = window.innerHeight;
	let timeEntries = [];
	let fetchPollSeconds = 60000; // fetch new timeblocks every minute
	let timePollSeconds = 10000; // update cursor time every 10 seconds
	let today = new Date();
	let isTracking = false;
	let scrollY = 0;

	$: todayMs = today.getTime();
	$: startTimeMs = today.setHours(9, 0, 0, 0) + (scrollY * 60000); // 9:00am
	$: endTimeMs = today.setHours(18, 0, 0, 0) + (scrollY * 60000); // 6:00pm

	const handleWheel = (e) => {
		scrollY = Math.min(0, scrollY + e.deltaY);
		timeEntries=timeEntries;
		today = new Date();
	};

	$: gaps = timeEntries
		.map((e, i) => ({
			start: i && timeEntries[i - 1].end, 
			end: e.start, 
			isGap: true
		}))
		.filter(e =>
			(e.end > startTimeMs) // on screen only
			&& (e.end - e.start > 0) // no overlaps
		);

	const timeToPx = (timeMs) => {
		const px = ((timeMs - startTimeMs) / (endTimeMs - startTimeMs)) * height;
		return Math.min(px, height);
	}

	$: timeBlocks = [...timeEntries, ...gaps]
		.map(t => ({
			startPx: timeToPx(t.start),
			height: Math.max(timeToPx(t.end) - timeToPx(t.start), 2),
			...t
		}));

	const getBlocks = async () => {
		[ timeEntries, isTracking ] = await getTimeBlocks()
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

<svelte:window 
	on:wheel|passive={handleWheel}
	bind:innerHeight={height} 
	on:resize={() => {
		timeEntries=timeEntries;
		today = new Date();
	}}
/>

<main>
	<div class='time-block-container'>
		{#each timeBlocks as t}
			<TimeBlock {...t} />
		{/each}

		<Cursor 
			isTracking={isTracking} 
			position={timeToPx(todayMs)}
		/>
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

	.time-block-container {
		background-color: #222;
		width: 100%;
		height: 100%;
	}
</style>