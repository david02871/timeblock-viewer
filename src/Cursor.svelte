<script>
	export let isTracking = false;
	export let position = 0;

	let windowActive = false;

	let d = new Date();
	let timeStr = d.toLocaleTimeString([], { // time string without seconds
		hour: '2-digit', 
		minute:'2-digit'
	});
</script>

<svelte:body 
	on:mouseenter={() => windowActive = true}
	on:mouseleave={() => windowActive = false}
/>

<div class='container' style='top: {position}px'>
	<div class='rule {!isTracking && 'tracking-off'}'></div>
	<div class='time-label {!windowActive && 'hide'}'>
		{timeStr}
	</div>
</div>

<style>
	.container {
		position: absolute;
		width: 100%
	}

	.rule {
		overflow: hidden;
		height: 3px;
		width: 100%;
		background-color: lawngreen;
	}

	.tracking-off {
		background-color: red;
	}
	.time-label {
		position: relative;
		top: -12px;
		border-radius: 12px;
		width: 50px;
		margin: 0 auto;
		padding: 4px;
		background-color: #333;
		text-align: center;
		color: white;
	}

	.hide {
		display: none;
	}
</style>