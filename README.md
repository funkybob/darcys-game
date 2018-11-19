# Darcy's Game

This game started as an idea my 7 year old daughter drew on he leg (for want of
a notebook) and showed me. She described a simple, elegant game with such
enthusiasm I just had to make it for her.

During development, I've made some changes; some to make the game more
challenging, some to make the code less so :)

## How to play

Over time, shapes will appear in the middle of the green circle, and slowly
progress towards the edge. If they reach the edge, game over!

To stop them, you must press your mouse button down on the matching shape on
the edge of the circle, and drag the red line to the shape you want to remove.

Points are awarded based on the number of sides on the shape. As your score
grows, so does the number of different shapes.


# Building

    $ npm install
    $ npx run rollup -c

# Launching

This requires a web server. I generally use the one built into Python3:

    $ python3 -m http.server

Then point your browser at http://127.0.0.1:8000/index.html


# Thanks
- Rich Harris (for Svelte, Rollup, and "pointer-events: none;"

