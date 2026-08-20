// Stage 3 of the pipeline: an async tree-walking interpreter over the AST from Parser.js.
// DOM-free by design — DISPLAY output, INPUT prompts, and robot commands are all routed
// through injected callbacks so this file works the same in PseudocodeExecutor and
// RobotExecutor (or in a future non-browser host) without modification.

export class ReturnSignal { constructor(value) { this.value = value; } }

function deepCopy(v) {
  if (Array.isArray(v)) return v.map(deepCopy);
  if (v !== null && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v)) out[k] = deepCopy(v[k]);
    return out;
  }
  return v;
}

const ROBOT_BUILTINS = new Set(['RENDER', 'SPAWN', 'MOVE_FORWARD', 'ROTATE_LEFT', 'ROTATE_RIGHT', 'CAN_MOVE']);
const BUILTIN_NAMES = new Set(['INPUT', 'RANDOM', 'LENGTH', 'APPEND', 'INSERT', 'REMOVE', ...ROBOT_BUILTINS]);

export class Interpreter {
  /**
   * @param {object} opts
   * @param {(text: string) => void} [opts.out] - called for DISPLAY output
   * @param {() => Promise<string>} [opts.input] - called for INPUT(), returns raw input text
   * @param {{spawn,render,moveForward,rotateLeft,rotateRight,canMove}} [opts.robot] - robot command target; omit to disable robot commands
   * @param {number} [opts.stepLimit]
   */
  constructor({ out, input, robot, stepLimit = 50000 } = {}) {
    this.scopes = [{}];
    this.procs = {};
    this.out = out || (() => {});
    this.input = input || (async () => '');
    this.robot = robot || null;
    this.steps = 0;
    this.stepLimit = stepLimit;
  }

  tick() { if (++this.steps > this.stepLimit) throw new Error('Step limit reached — possible infinite loop'); }

  get(name) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) return this.scopes[i][name];
    }
    throw new Error(`Undefined variable '${name}'`);
  }

  set(name, val) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) { this.scopes[i][name] = val; return; }
    }
    this.scopes[this.scopes.length - 1][name] = val;
  }

  push() { this.scopes.push({}); }
  pop()  { this.scopes.pop(); }

  async run(stmts) {
    for (const s of stmts) await this.exec(s);
  }

  async exec(s) {
    this.tick();
    switch (s.type) {

      case 'Assign': this.set(s.name, await this.eval(s.value)); break;

      case 'ListAssign': {
        const list = this.get(s.name);
        if (!Array.isArray(list)) throw new Error(`'${s.name}' is not a list`);
        const i = await this.eval(s.index);
        if (!Number.isInteger(i) || i < 1 || i > list.length)
          throw new Error(`Index ${i} out of bounds (length ${list.length}, 1-indexed)`);
        list[i - 1] = await this.eval(s.value); break;
      }

      case 'If': {
        if (await this.eval(s.cond)) {
          this.push(); await this.run(s.then); this.pop();
        } else {
          let done = false;
          for (const ei of s.elseifs) {
            if (await this.eval(ei.cond)) { this.push(); await this.run(ei.body); this.pop(); done = true; break; }
          }
          if (!done && s.else) { this.push(); await this.run(s.else); this.pop(); }
        }
        break;
      }

      case 'RepeatTimes': {
        const n = await this.eval(s.count);
        if (!Number.isFinite(n) || n < 0) throw new Error('REPEAT count must be a non-negative number');
        for (let i = 0; i < n; i++) { this.tick(); this.push(); await this.run(s.body); this.pop(); }
        break;
      }

      case 'RepeatUntil': {
        while (!(await this.eval(s.cond))) {
          this.tick();
          this.push(); await this.run(s.body); this.pop();
        }
        break;
      }

      case 'ForEach': {
        const list = await this.eval(s.list);
        if (!Array.isArray(list)) throw new Error('FOR EACH requires a list');
        for (const item of list) {
          this.tick(); this.push();
          this.scopes[this.scopes.length - 1][s.var] = item;
          await this.run(s.body); this.pop();
        }
        break;
      }

      case 'ProcDef': this.procs[s.name] = s; break;

      case 'Return': throw new ReturnSignal(await this.eval(s.value));

      case 'Display': {
        const vals = [];
        for (const a of s.args) vals.push(await this.eval(a));
        this.out(vals.map(v => this.fmt(v)).join(' ')); break;
      }

      case 'BuiltinStmt':
      case 'Call': await this.evalCall(s.name, s.args); break;
    }
  }

  async eval(node) {
    switch (node.type) {
      case 'Num':  return node.value;
      case 'Str':  return node.value;
      case 'Bool': return node.value;
      case 'Var':  return this.get(node.name);
      case 'List': { const items = []; for (const i of node.items) items.push(await this.eval(i)); return items; }

      case 'Index': {
        const list = await this.eval(node.list);
        if (!Array.isArray(list)) throw new Error('Subscript on non-list');
        const i = await this.eval(node.index);
        if (!Number.isInteger(i) || i < 1 || i > list.length)
          throw new Error(`Index ${i} out of bounds (length ${list.length}, 1-indexed)`);
        return list[i - 1];
      }

      case 'BinOp': {
        const l = await this.eval(node.left), r = await this.eval(node.right);
        switch (node.op) {
          case '+': return (typeof l === 'string' || typeof r === 'string') ? String(l) + String(r) : l + r;
          case '-': return l - r;
          case '*': return l * r;
          case '/': if (r === 0) throw new Error('Division by zero'); return l / r;
          case 'MOD': return ((l % r) + r) % r;
          case '=':  return l === r;
          case '≠':  return l !== r;
          case '<':  return l < r;
          case '>':  return l > r;
          case '<=': return l <= r;
          case '>=': return l >= r;
          case 'AND': return Boolean(l) && Boolean(r);
          case 'OR':  return Boolean(l) || Boolean(r);
        }
        break;
      }

      case 'UnOp': {
        const v = await this.eval(node.expr);
        if (node.op === 'NOT') return !v;
        if (node.op === '-')   return -v;
        break;
      }

      case 'Builtin': return await this.evalBuiltin(node.name, node.args);
      case 'Call':    return await this.evalCall(node.name, node.args);
    }
    throw new Error('Unknown AST node: ' + node.type);
  }

  requireRobot(name) {
    if (!this.robot) throw new Error(`${name} is not available here`);
    return this.robot;
  }

  async evalBuiltin(name, args) {
    const v = [];
    for (const a of args) v.push(await this.eval(a));
    switch (name) {
      case 'INPUT': {
        const raw = (await this.input()) ?? '';
        const line = String(raw).trim();
        if (/^".*"$/.test(line) || /^'.*'$/.test(line)) return line.slice(1, -1);
        if (/^-?\d+$/.test(line)) return parseInt(line, 10);
        const f = Number(line); if (!isNaN(f) && line !== '') return f;
        if (line === 'TRUE') return true;
        if (line === 'FALSE') return false;
        return line;
      }
      case 'RANDOM': return Math.floor(Math.random() * (v[1] - v[0] + 1)) + v[0];
      case 'LENGTH': {
        if (Array.isArray(v[0])) return v[0].length;
        if (typeof v[0] === 'string') return v[0].length;
        throw new Error('LENGTH requires a list or string');
      }
      case 'APPEND': {
        if (!Array.isArray(v[0])) throw new Error('APPEND requires a list as first argument');
        v[0].push(v[1]); return v[0];
      }
      case 'INSERT': {
        if (!Array.isArray(v[0])) throw new Error('INSERT requires a list as first argument');
        v[0].splice(v[1] - 1, 0, v[2]); return v[0];
      }
      case 'REMOVE': {
        if (!Array.isArray(v[0])) throw new Error('REMOVE requires a list as first argument');
        v[0].splice(v[1] - 1, 1); return v[0];
      }

      // ── Robot commands — delegated to whatever was passed as `robot` ──
      case 'RENDER':       return this.requireRobot('RENDER').render(v[0]);
      case 'SPAWN':         return this.requireRobot('SPAWN').spawn(v[0], v[1], v[2]);
      case 'MOVE_FORWARD':  return this.requireRobot('MOVE_FORWARD').moveForward();
      case 'ROTATE_LEFT':   return this.requireRobot('ROTATE_LEFT').rotateLeft();
      case 'ROTATE_RIGHT':  return this.requireRobot('ROTATE_RIGHT').rotateRight();
      case 'CAN_MOVE':      return this.requireRobot('CAN_MOVE').canMove(v[0]);
    }
  }

  async evalCall(name, args) {
    if (BUILTIN_NAMES.has(name)) return await this.evalBuiltin(name, args);

    const proc = this.procs[name];
    if (!proc) throw new Error(`Undefined procedure '${name}'`);
    if (args.length !== proc.params.length)
      throw new Error(`'${name}' expects ${proc.params.length} arg(s), got ${args.length}`);

    const vals = [];
    for (const a of args) vals.push(deepCopy(await this.eval(a)));
    this.push();
    proc.params.forEach((p, i) => { this.scopes[this.scopes.length - 1][p] = vals[i]; });
    let result = null;
    try { await this.run(proc.body); }
    catch (e) { if (e instanceof ReturnSignal) result = e.value; else throw e; }
    this.pop();
    return result;
  }

  fmt(v) {
    if (Array.isArray(v)) return '[' + v.map(i => this.fmt(i)).join(', ') + ']';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    return String(v);
  }
}

export default Interpreter;
