// AP CSP Pseudocode tokenizer.
// Stage 1 of the tokenize -> parse -> interpret pipeline (see Parser.js, Interpreter.js).

export const TT = {
  NUM: 'NUM', STR: 'STR', BOOL: 'BOOL', IDENT: 'IDENT',
  ASSIGN: 'ASSIGN',
  PLUS: 'PLUS', MINUS: 'MINUS', STAR: 'STAR', SLASH: 'SLASH',
  MOD: 'MOD', AND: 'AND', OR: 'OR', NOT: 'NOT',
  EQ: 'EQ', NEQ: 'NEQ', LT: 'LT', GT: 'GT', LTE: 'LTE', GTE: 'GTE',
  LPAREN: 'LPAREN', RPAREN: 'RPAREN',
  LBRACE: 'LBRACE', RBRACE: 'RBRACE',
  LBRACKET: 'LBRACKET', RBRACKET: 'RBRACKET',
  COMMA: 'COMMA',
  IF: 'IF', ELSE: 'ELSE', REPEAT: 'REPEAT', TIMES: 'TIMES', UNTIL: 'UNTIL',
  FOR: 'FOR', EACH: 'EACH', IN: 'IN',
  PROCEDURE: 'PROCEDURE', RETURN: 'RETURN',
  DISPLAY: 'DISPLAY', INPUT: 'INPUT', RANDOM: 'RANDOM',
  APPEND: 'APPEND', INSERT: 'INSERT', REMOVE: 'REMOVE', LENGTH: 'LENGTH',
  RENDER: 'RENDER', SPAWN: 'SPAWN',
  MOVE_FORWARD: 'MOVE_FORWARD', ROTATE_LEFT: 'ROTATE_LEFT', ROTATE_RIGHT: 'ROTATE_RIGHT',
  CAN_MOVE: 'CAN_MOVE',
  EOF: 'EOF',
};

const KEYWORDS = {
  IF: TT.IF, ELSE: TT.ELSE, REPEAT: TT.REPEAT, TIMES: TT.TIMES, UNTIL: TT.UNTIL,
  FOR: TT.FOR, EACH: TT.EACH, IN: TT.IN,
  PROCEDURE: TT.PROCEDURE, RETURN: TT.RETURN,
  AND: TT.AND, OR: TT.OR, NOT: TT.NOT, MOD: TT.MOD,
  TRUE: TT.BOOL, FALSE: TT.BOOL,
  DISPLAY: TT.DISPLAY, INPUT: TT.INPUT, RANDOM: TT.RANDOM,
  APPEND: TT.APPEND, INSERT: TT.INSERT, REMOVE: TT.REMOVE, LENGTH: TT.LENGTH,
  RENDER: TT.RENDER, SPAWN: TT.SPAWN,
  MOVE_FORWARD: TT.MOVE_FORWARD, ROTATE_LEFT: TT.ROTATE_LEFT, ROTATE_RIGHT: TT.ROTATE_RIGHT,
  CAN_MOVE: TT.CAN_MOVE,
};

// Builtin/keyword names require exact uppercase so they don't collide with user
// variables written in lowercase (e.g. `input`, `length` stay IDENTs; `INPUT`,
// `LENGTH` become keywords). Control-flow words (IF, REPEAT, ...) stay case-insensitive.
const CASE_SENSITIVE_KW = new Set([
  'DISPLAY', 'INPUT', 'RANDOM', 'APPEND', 'INSERT', 'REMOVE', 'LENGTH',
  'RENDER', 'SPAWN', 'MOVE_FORWARD', 'ROTATE_LEFT', 'ROTATE_RIGHT', 'CAN_MOVE',
]);

export class Token {
  constructor(type, value, line) { this.type = type; this.value = value; this.line = line; }
}

export function tokenize(src) {
  const tokens = [];
  let pos = 0, line = 1;

  const peek = (n = 0) => src[pos + n];
  const adv  = () => { const c = src[pos++]; if (c === '\n') line++; return c; };
  const skip = () => { while (pos < src.length && /[ \t\r]/.test(peek())) adv(); };

  while (pos < src.length) {
    skip();
    if (pos >= src.length) break;
    const ch = peek(), ln = line;

    // Comments
    if (ch === '/' && peek(1) === '/') { while (pos < src.length && peek() !== '\n') adv(); continue; }

    // Newlines are insignificant whitespace — statements are delimited by braces
    if (ch === '\n') { adv(); continue; }

    // Strings — straight and curly quotes
    if (ch === '"' || ch === '“' || ch === '”') {
      adv();
      let s = '';
      while (pos < src.length && peek() !== '"' && peek() !== '”') s += adv();
      adv();
      tokens.push(new Token(TT.STR, s, ln));
      continue;
    }
    if (ch === "'") {
      adv();
      let s = '';
      while (pos < src.length && peek() !== "'") s += adv();
      adv();
      tokens.push(new Token(TT.STR, s, ln));
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let n = '';
      while (pos < src.length && /[0-9.]/.test(peek())) n += adv();
      tokens.push(new Token(TT.NUM, parseFloat(n), ln));
      continue;
    }

    // <- or the literal arrow
    if (ch === '←') { adv(); tokens.push(new Token(TT.ASSIGN, '←', ln)); continue; }
    if (ch === '<' && peek(1) === '-') { adv(); adv(); tokens.push(new Token(TT.ASSIGN, '←', ln)); continue; }

    // Unicode comparison operators
    if (ch === '≠') { adv(); tokens.push(new Token(TT.NEQ, '≠', ln)); continue; }
    if (ch === '≤') { adv(); tokens.push(new Token(TT.LTE, '≤', ln)); continue; }
    if (ch === '≥') { adv(); tokens.push(new Token(TT.GTE, '≥', ln)); continue; }

    // Two-char ASCII comparison operators
    if (ch === '<' && peek(1) === '=') { adv(); adv(); tokens.push(new Token(TT.LTE, '<=', ln)); continue; }
    if (ch === '>' && peek(1) === '=') { adv(); adv(); tokens.push(new Token(TT.GTE, '>=', ln)); continue; }

    // Single-char tokens
    const singles = {
      '+': TT.PLUS, '-': TT.MINUS, '*': TT.STAR, '/': TT.SLASH,
      '<': TT.LT, '>': TT.GT, '=': TT.EQ,
      '(': TT.LPAREN, ')': TT.RPAREN, '{': TT.LBRACE, '}': TT.RBRACE,
      '[': TT.LBRACKET, ']': TT.RBRACKET, ',': TT.COMMA,
    };
    if (singles[ch]) { adv(); tokens.push(new Token(singles[ch], ch, ln)); continue; }

    // Identifiers / keywords
    if (/[a-zA-Z_]/.test(ch)) {
      let id = '';
      while (pos < src.length && /[a-zA-Z0-9_]/.test(peek())) id += adv();
      const up = id.toUpperCase();
      const kw = KEYWORDS[up] && (!CASE_SENSITIVE_KW.has(up) || id === up) ? KEYWORDS[up] : null;
      if (kw) {
        tokens.push(new Token(kw, kw === TT.BOOL ? (up === 'TRUE') : up, ln));
      } else {
        tokens.push(new Token(TT.IDENT, id, ln));
      }
      continue;
    }

    adv(); // skip unrecognized character
  }
  tokens.push(new Token(TT.EOF, null, line));
  return tokens;
}
