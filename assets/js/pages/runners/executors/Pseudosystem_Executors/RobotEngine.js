// Robot state + canvas rendering for the SPAWN/RENDER/MOVE_FORWARD/ROTATE_*/CAN_MOVE
// builtins. Passed to Interpreter as `robot` — the interpreter only calls these methods
// and knows nothing about canvases or grids itself.

// Direction index: 0=up, 1=right, 2=down, 3=left
const DIR_DELTA = [
  { dr: -1, dc: 0 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: -1 },
];

const PAD = 16;
const MAX_CANVAS = 480;

function cloneGrid(g) { return g.map(row => [...row]); }

function validateMap(map, who) {
  if (!Array.isArray(map) || !map.length || !Array.isArray(map[0]))
    throw new Error(`${who}: map must be a non-empty 2D list`);
  const cols = map[0].length;
  for (const row of map) {
    if (!Array.isArray(row) || row.length !== cols)
      throw new Error(`${who}: all map rows must have the same length`);
  }
}

export class RobotEngine {
  constructor() { this.reset(); }

  reset() {
    this.map = null; this.row = 0; this.col = 0; this.dir = 0;
    this.spawned = false;
    this.frames = [];
  }

  recordFrame(error = null) {
    if (!this.map) return;
    this.frames.push({
      map: cloneGrid(this.map),
      row: this.spawned ? this.row : null,
      col: this.spawned ? this.col : null,
      dir: this.dir,
      error,
    });
  }

  requireSpawned() {
    if (!this.spawned) throw new Error('No robot spawned. Call SPAWN first.');
  }

  spawn(map, row, col) {
    validateMap(map, 'SPAWN');
    const r = row - 1, c = col - 1;
    if (r < 0 || r >= map.length || c < 0 || c >= map[0].length)
      throw new Error('SPAWN: position is outside the map');
    if (map[r][c] === 1) throw new Error('SPAWN: position is inside a wall');
    this.map = cloneGrid(map); this.row = r; this.col = c; this.dir = 0;
    this.spawned = true;
    this.recordFrame();
  }

  render(map) {
    validateMap(map, 'RENDER');
    this.map = cloneGrid(map);
    this.recordFrame();
  }

  canMove(dirName) {
    this.requireSpawned();
    const s = typeof dirName === 'string' ? dirName.toLowerCase() : 'forward';
    let d;
    if (s === 'forward')       d = this.dir;
    else if (s === 'backward') d = (this.dir + 2) % 4;
    else if (s === 'left')     d = (this.dir + 3) % 4;
    else if (s === 'right')    d = (this.dir + 1) % 4;
    else throw new Error(`CAN_MOVE: unknown direction "${dirName}" — use "forward", "backward", "left", or "right"`);
    const { dr, dc } = DIR_DELTA[d];
    const nr = this.row + dr, nc = this.col + dc;
    if (nr < 0 || nr >= this.map.length || nc < 0 || nc >= this.map[0].length) return false;
    return this.map[nr][nc] === 0;
  }

  moveForward() {
    this.requireSpawned();
    if (!this.canMove('forward')) throw new Error('MOVE_FORWARD: robot hit a wall or boundary');
    const { dr, dc } = DIR_DELTA[this.dir];
    this.row += dr; this.col += dc;
    this.recordFrame();
  }

  rotateLeft()  { this.requireSpawned(); this.dir = (this.dir + 3) % 4; this.recordFrame(); }
  rotateRight() { this.requireSpawned(); this.dir = (this.dir + 1) % 4; this.recordFrame(); }
}

function layoutFor(rows, cols) {
  const cell = Math.max(16, Math.min(64, Math.floor((MAX_CANVAS - PAD * 2) / Math.max(rows, cols))));
  return { cell, width: cols * cell + PAD * 2, height: rows * cell + PAD * 2 };
}

export function drawFrame(ctx, frame) {
  const { map, row, col, dir, error } = frame;
  const rows = map.length, cols = map[0].length;
  const { cell, width, height } = layoutFor(rows, cols);
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, width, height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = PAD + c * cell, y = PAD + r * cell;
      ctx.fillStyle = map[r][c] === 1 ? '#45475a' : '#313244';
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      if (map[r][c] === 1) {
        ctx.fillStyle = '#585b70';
        ctx.fillRect(x + 6, y + 6, cell - 12, cell - 12);
      }
      ctx.strokeStyle = '#6c7086';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
    }
  }

  // Robot — omitted from frames recorded before SPAWN (row/col null)
  if (row === null || col === null) return;

  const rx = PAD + col * cell + cell / 2;
  const ry = PAD + row * cell + cell / 2;
  const r  = cell * 0.32;

  ctx.save();
  ctx.translate(rx, ry);
  ctx.rotate((dir - 1) * Math.PI / 2);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = error ? '#f38ba8' : '#89b4fa';
  ctx.fill();
  ctx.strokeStyle = error ? '#eba0ac' : '#b4befe';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r * 0.35, 0);
  ctx.lineTo(r * 0.45, 0);
  ctx.strokeStyle = '#1e1e2e';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(r * 0.18, -r * 0.3);
  ctx.lineTo(r * 0.48, 0);
  ctx.lineTo(r * 0.18, r * 0.3);
  ctx.fillStyle = '#1e1e2e';
  ctx.fill();

  ctx.restore();
}

export function animate(canvas, frames, outputDiv, execTimeSpan, startMs) {
  const ctx = canvas.getContext('2d');
  const DELAY = 320;
  let i = 0;

  function step() {
    drawFrame(ctx, frames[i]);

    const last = frames[frames.length - 1];
    if (i === frames.length - 1) {
      if (execTimeSpan)
        execTimeSpan.textContent = last.error
          ? ''
          : `⏱ ${frames.length - 1} move(s) · ${Date.now() - startMs}ms`;
      if (last.error) {
        const err = document.createElement('div');
        err.style.cssText = 'color:#f38ba8;margin-top:6px;font-size:0.85em;';
        err.textContent = last.error;
        outputDiv.appendChild(err);
      }
      return;
    }
    i++;
    setTimeout(step, DELAY);
  }

  step();
}
