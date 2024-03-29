<main>
  <h1>Score: {score}</h1>
  <button on:click={startGame} disabled={running}>Start Game</button>
  <h2>Level: {level + 1}</h2>
</main>
<p>
  Instructions: When a moving shape appears, click-and-hold on the matching
  shape on the border, and join the coloured line to the moving shape.
</p>
<svg
  bind:this={canvas}
  role="none"
  viewBox="0 0 200 200"
  xmlns="http://www.w3.org/2000/svg"
  on:mousemove={trackMouse}
  on:touchmove={trackMouse}
  on:mouseup={(_) => mouseup(null)}
  on:touchend={touchend}
>
  <circle cx="100" cy="100" r="100" fill="lightgreen" />
  <circle cx="100" cy="100" r="80" fill="green" stroke="black" />
  {#each starts as shape (shape.id)}
    <Shape
      n={shape.n}
      x={shape.x}
      y={shape.y}
      fill={shape.fill}
      on:mousedown={(ev) => mousedown(ev, shape)}
      on:touchstart={(ev) => mousedown(ev, shape)}
    />
  {/each}
  {#each shapes as shape (shape.id)}
    <Shape
      n={shape.n}
      x={shape.x}
      y={shape.y}
      fill={shape.fill}
      on:mouseup={mouseup(shape)}
    />
  {/each}
  {#if down}
    <line
      stroke={down.fill}
      x1={down.x + 10}
      y1={down.y + 10}
      x2={pointer.x}
      y2={pointer.y}
    />
  {/if}
</svg>

<script>
  import Shape from "./Shape.svelte";

  let canvas;

  // Used to convert screen -> svg coordinates.
  const pt = new DOMPoint();

  let running = false;
  // ID sequence for shapes
  let counter = 0;
  let score = 0;
  let starts = [];
  let shapes = [];
  let now = 0;
  // Time the game started
  let start = 0;
  let lastSpawn = 0;
  let level = 0;
  // Where the mouse-down started
  let down = null;
  let pointer = {};

  $: frame = Math.floor((now - start) / 60);
  $: {
    let step = 20;
    let nlevel = 0;
    let nscore = score;
    nscore -= step;
    while (nscore > 0) {
      nlevel += 1;
      nscore -= step;
      step *= 1.2;
    }
    if (nlevel > level) {
      level = nlevel;
      nextLevel();
    }
  }
  $: interval = Math.floor(85 - level * Math.log(level + 1)); // Caps us about level 50
  $: {
    if (running) {
      if (frame - lastSpawn > interval) {
        addShape();
      }
      travelShapes();
    }
  }

  function startGame() {
    running = true;
    start = performance.now();
    now = start;
    score = 0;
    lastSpawn = 0;
    shapes = [];
    starts = [];

    nextLevel();
    onTimer();
  }

  function onTimer(n) {
    now = n;
    if (running) window.requestAnimationFrame(onTimer);
  }

  function colourForLevel(n) {
    return `hsl(${360 - 30 * (n % 7)}, ${
      100 - 20 * (Math.floor((n + 1) / 7) + 1)
    }%, 50%)`;
  }

  function nextLevel() {
    let n = 3 + level;
    let shape = {
      id: counter,
      fill: colourForLevel(level),
      n,
      x: 0,
      y: 0,
    };
    starts.push(shape);
    counter += 1;
    // Re-distribute around the circle
    const arc = 360 / starts.length;
    for (let i = 0, l = starts.length; i < l; i++) {
      let a = arc * i + 90;
      // centre of circle is 100,100
      // shape is 20x20, so offset -10,-10
      // circle has radius of 80, so place these a bit wider
      starts[i].x = 90 + 90 * Math.cos((a * Math.PI) / 180);
      starts[i].y = 90 + 90 * Math.sin((a * Math.PI) / 180);
    }
    starts = [...starts];
  }

  function addShape() {
    // level is 0-based
    let n = 3 + Math.round(Math.random() * level);
    let shape = {
      id: counter,
      frame: frame,
      fill: colourForLevel(n - 3),
      n,
      x: 90,
      y: 90,
      v: Math.floor(Math.random() * 360),
    };
    lastSpawn = frame;
    shapes = [...shapes, shape];
    counter += 1;
  }

  function travelShapes() {
    // Move each shape along according to its vector 'v'
    shapes = shapes.map((shape) => {
      let age = frame - shape.frame;
      if (age == 80) endGame();
      // centre of circle is 100,100
      // shape is 20x20, so offset -10,-10
      shape.x = 90 + age * Math.cos((shape.v * Math.PI) / 180);
      shape.y = 90 + age * Math.sin((shape.v * Math.PI) / 180);
      return shape;
    });
  }

  function endGame() {
    running = false;
    alert("GAME OVER!");
  }

  function screenToSvg(x, y) {
    pt.x = x;
    pt.y = y;
    let p = pt.matrixTransform(canvas.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  }

  function mousedown(ev, shape) {
    down = shape;
    trackMouse(ev);
  }

  function trackMouse(ev) {
    ev.preventDefault(); // prevents touchmove from dragging the window
    let isTouch = ev.type.startsWith("touch");
    pointer = screenToSvg(
      isTouch ? ev.changedTouches[0].clientX : ev.clientX,
      isTouch ? ev.changedTouches[0].clientY : ev.clientY
    );
  }

  function touchend(ev) {
    // scan the shapes to see if we can find one
    let pointer = screenToSvg(
      ev.changedTouches[0].clientX,
      ev.changedTouches[0].clientY
    );
    let match = shapes.find((s) => {
      // shapes center is 10,10 from their origin
      let dist = Math.sqrt(
        Math.pow(s.x + 10 - pointer.x, 2) + Math.pow(s.y + 10 - pointer.y, 2)
      );
      // Shape radius is 10
      return dist < 10 ? true : false;
    });
    if (match) mouseup(match);
    else mouseup(null);
  }

  function mouseup(shape) {
    if (shape !== null) {
      if (down.n == shape.n) {
        score += shape.n;
        shapes = shapes.filter((s) => s.id !== shape.id);
      }
    }
    down = null;
  }
</script>

<style>
  main {
    display: flex;
  }
  h1,
  h2 {
    flex: 2 2 auto;
    text-align: center;
  }
  button {
    flex: 1 1 auto;
  }
  svg {
    width: 80vh;
    max-width: 100vw;
    max-height: 80vh;
    margin: 1em auto;
    display: block;
  }
  line {
    pointer-events: none;
  }
</style>
