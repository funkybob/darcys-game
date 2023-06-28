<svelte:options namespace="svg" />

<svg x={x} y={y}>
  <polygon points={points} fill={fill}
    role="none"
    pointer-events="visiblePainted"
    on:mousedown
    on:touchstart
    on:mouseup
    on:touchend
  />
</svg>

<script>
  const radius = 10;

  export let n;
  export let x;
  export let y;
  export let fill;

  $: arc = 360 / n;

  $: points = Array.from({ length: n }, (_, idx) => {
    let a = idx * arc;
    let x = radius + radius * Math.cos(a * Math.PI / 180)
    let y = radius + radius * Math.sin(a * Math.PI / 180)
    return `${x},${y}`;
  });

</script>

<style>
  polygon {
    stroke: black;
    stroke-width: 1;
  }
</style>
