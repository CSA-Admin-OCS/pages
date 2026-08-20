// Robot-flavored pseudocode runner — public entry point used by code.html.
// Same Tokenizer -> Parser -> Interpreter pipeline as PseudocodeExecutor, but wires the
// interpreter's robot builtins (SPAWN/RENDER/MOVE_FORWARD/ROTATE_*/CAN_MOVE) to a
// RobotEngine instance instead of leaving them disabled.
//
// Robot syntax:
//   map ← [[1,1,1],[1,0,1],[1,1,1]]
//   RENDER(map)
//   SPAWN(map, row, col)   // 1-indexed
//   MOVE_FORWARD() / ROTATE_LEFT() / ROTATE_RIGHT() / CAN_MOVE("forward"|"backward"|"left"|"right")

import { tokenize } from './Tokenizer.js';
import { Parser } from './Parser.js';
import { Interpreter, ReturnSignal } from './Interpreter.js';
import { RobotEngine, animate } from './RobotEngine.js';

async function promptInput() {
  try { return window.prompt('Enter a value:') || ''; }
  catch { return ''; }
}

export class RobotExecutor {
  constructor({ outputElement, execTimeElement } = {}) {
    this.outputElement = outputElement;
    this.execTimeElement = execTimeElement;
  }

  static detect(src) {
    return /\b(SPAWN|RENDER|MOVE_FORWARD|ROTATE_LEFT|ROTATE_RIGHT|CAN_MOVE)\s*\(/.test(src);
  }

  async run(src) {
    const outputDiv = this.outputElement;
    const execTimeSpan = this.execTimeElement;
    if (!outputDiv) return;

    outputDiv.innerHTML = '';
    if (execTimeSpan) execTimeSpan.textContent = '';

    let ast;
    try {
      ast = new Parser(tokenize(src.trim())).parse();
    } catch (e) {
      outputDiv.textContent = e.message;
      return;
    }

    const engine = new RobotEngine();
    const lines = [];
    const out = (text) => lines.push(text);
    const interp = new Interpreter({ out, input: promptInput, robot: engine });

    const start = Date.now();
    let runError = null;
    try {
      await interp.run(ast);
    } catch (e) {
      if (!(e instanceof ReturnSignal)) runError = e;
    }

    if (lines.length) {
      const log = document.createElement('div');
      log.style.cssText = 'white-space:pre-wrap;margin-bottom:6px;';
      log.textContent = lines.join('\n');
      outputDiv.appendChild(log);
    }

    if (runError && !engine.map) {
      const err = document.createElement('div');
      err.style.cssText = 'color:#f38ba8;';
      err.textContent = runError.message;
      outputDiv.appendChild(err);
      return;
    }
    if (runError) engine.recordFrame(runError.message);

    if (!engine.frames.length) {
      const info = document.createElement('div');
      info.textContent = 'Robot Error: no SPAWN or RENDER call — nothing to draw';
      outputDiv.appendChild(info);
      return;
    }

    outputDiv.style.maxHeight = 'none';
    outputDiv.style.overflowY = 'visible';

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;max-width:100%;border-radius:8px;';
    outputDiv.appendChild(canvas);

    animate(canvas, engine.frames, outputDiv, execTimeSpan, start);
  }
}

export default RobotExecutor;
