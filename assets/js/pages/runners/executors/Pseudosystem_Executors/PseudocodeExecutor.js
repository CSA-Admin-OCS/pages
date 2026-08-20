// AP CSP Pseudocode interpreter — public entry point used by code.html.
// Pipeline: Tokenizer.js -> Parser.js -> Interpreter.js (async tree-walking, no codegen).

import { tokenize } from './Tokenizer.js';
import { Parser } from './Parser.js';
import { Interpreter, ReturnSignal } from './Interpreter.js';

// INPUT() has no dedicated modal in this runner — falls back to a blocking prompt,
// wrapped in a resolved promise so it satisfies the interpreter's async `input` contract.
async function promptInput() {
  try { return window.prompt('Enter a value:') || ''; }
  catch { return ''; }
}

export class PseudocodeExecutor {
  constructor({ outputElement, execTimeElement } = {}) {
    this.outputElement = outputElement;
    this.execTimeElement = execTimeElement;
  }

  async run(src) {
    const outputDiv = this.outputElement;
    const execTimeSpan = this.execTimeElement;
    if (!outputDiv) return;

    outputDiv.textContent = '⏳ Running...';
    if (execTimeSpan) execTimeSpan.textContent = '';

    const lines = [];
    const out = (text) => lines.push(text);

    const start = Date.now();
    try {
      const ast = new Parser(tokenize(src.trim())).parse();
      const interp = new Interpreter({ out, input: promptInput });
      try {
        await interp.run(ast);
      } catch (e) {
        if (!(e instanceof ReturnSignal)) throw e;
      }
      outputDiv.textContent = lines.length ? lines.join('\n') : '[no output]';
      if (execTimeSpan)
        execTimeSpan.textContent = `⏱ Execution time: ${Date.now() - start}ms (local)`;
    } catch (e) {
      outputDiv.textContent = (lines.length ? lines.join('\n') + '\n' : '') + e.message;
      if (execTimeSpan) execTimeSpan.textContent = '';
    }
  }
}

export default PseudocodeExecutor;
