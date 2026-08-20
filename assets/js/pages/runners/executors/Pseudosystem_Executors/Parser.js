// Stage 2 of the pipeline: recursive-descent parser -> AST.
// Consumes tokens from Tokenizer.js; the AST is walked by Interpreter.js.

import { TT } from './Tokenizer.js';

export class Parser {
  constructor(tokens) { this.t = tokens; this.i = 0; }
  peek()         { return this.t[this.i]; }
  adv()          { return this.t[this.i++]; }
  check(tp)      { return this.peek().type === tp; }
  match(...tps)  { if (tps.includes(this.peek().type)) return this.adv(); return null; }
  expect(tp, msg) {
    if (this.check(tp)) return this.adv();
    const tok = this.peek();
    throw new Error(`Line ${tok.line}: expected ${msg}, got '${tok.value}'`);
  }

  parse() {
    const stmts = [];
    while (!this.check(TT.EOF)) stmts.push(this.stmt());
    return stmts;
  }

  stmt() {
    const tok = this.peek();
    if (tok.type === TT.PROCEDURE)  return this.procDef();
    if (tok.type === TT.IF)         return this.ifStmt();
    if (tok.type === TT.REPEAT)     return this.repeatStmt();
    if (tok.type === TT.FOR)        return this.forEach();
    if (tok.type === TT.RETURN)     return this.returnStmt();
    if (tok.type === TT.DISPLAY)    return this.displayStmt();
    if ([TT.APPEND, TT.INSERT, TT.REMOVE,
         TT.RENDER, TT.SPAWN, TT.MOVE_FORWARD, TT.ROTATE_LEFT, TT.ROTATE_RIGHT, TT.CAN_MOVE,
        ].includes(tok.type)) return this.builtinStmt();
    if (tok.type === TT.IDENT)      return this.assignOrCall();
    throw new Error(`Line ${tok.line}: unexpected '${tok.value}'`);
  }

  procDef() {
    this.adv();
    const name = this.expect(TT.IDENT, 'procedure name').value;
    this.expect(TT.LPAREN, '(');
    const params = [];
    if (!this.check(TT.RPAREN)) {
      params.push(this.expect(TT.IDENT, 'parameter').value);
      while (this.match(TT.COMMA)) params.push(this.expect(TT.IDENT, 'parameter').value);
    }
    this.expect(TT.RPAREN, ')');
    return { type: 'ProcDef', name, params, body: this.block() };
  }

  ifStmt() {
    this.adv();
    this.expect(TT.LPAREN, '('); const cond = this.expr(); this.expect(TT.RPAREN, ')');
    const then = this.block();
    const elseifs = [];
    let elseBranch = null;
    while (this.check(TT.ELSE)) {
      this.adv();
      if (this.check(TT.IF)) {
        this.adv();
        this.expect(TT.LPAREN, '('); const c = this.expr(); this.expect(TT.RPAREN, ')');
        elseifs.push({ cond: c, body: this.block() });
      } else { elseBranch = this.block(); break; }
    }
    return { type: 'If', cond, then, elseifs, else: elseBranch };
  }

  repeatStmt() {
    this.adv();
    if (this.check(TT.UNTIL)) {
      this.adv();
      this.expect(TT.LPAREN, '('); const cond = this.expr(); this.expect(TT.RPAREN, ')');
      return { type: 'RepeatUntil', cond, body: this.block() };
    }
    const count = this.expr();
    this.expect(TT.TIMES, 'TIMES');
    return { type: 'RepeatTimes', count, body: this.block() };
  }

  forEach() {
    this.adv();
    this.expect(TT.EACH, 'EACH');
    const v = this.expect(TT.IDENT, 'variable').value;
    this.expect(TT.IN, 'IN');
    const list = this.expr();
    return { type: 'ForEach', var: v, list, body: this.block() };
  }

  returnStmt() {
    const ln = this.adv().line;
    this.expect(TT.LPAREN, '('); const val = this.expr(); this.expect(TT.RPAREN, ')');
    return { type: 'Return', value: val, line: ln };
  }

  displayStmt() {
    const ln = this.adv().line;
    this.expect(TT.LPAREN, '('); const args = this.args(); this.expect(TT.RPAREN, ')');
    return { type: 'Display', args, line: ln };
  }

  builtinStmt() {
    const tok = this.adv();
    this.expect(TT.LPAREN, '('); const args = this.args(); this.expect(TT.RPAREN, ')');
    return { type: 'BuiltinStmt', name: tok.value, args, line: tok.line };
  }

  assignOrCall() {
    const tok = this.adv();
    // list index assign: a[i] <- value
    if (this.check(TT.LBRACKET)) {
      this.adv(); const idx = this.expr(); this.expect(TT.RBRACKET, ']');
      this.expect(TT.ASSIGN, '←'); const val = this.expr();
      return { type: 'ListAssign', name: tok.value, index: idx, value: val, line: tok.line };
    }
    // regular assign: x <- value
    if (this.check(TT.ASSIGN)) {
      this.adv(); const val = this.expr();
      return { type: 'Assign', name: tok.value, value: val, line: tok.line };
    }
    // procedure call: f(...)
    if (this.check(TT.LPAREN)) {
      this.adv(); const args = this.args(); this.expect(TT.RPAREN, ')');
      return { type: 'Call', name: tok.value, args, line: tok.line };
    }
    throw new Error(`Line ${tok.line}: expected ← or ( after '${tok.value}'`);
  }

  block() {
    this.expect(TT.LBRACE, '{');
    const stmts = [];
    while (!this.check(TT.RBRACE) && !this.check(TT.EOF)) stmts.push(this.stmt());
    this.expect(TT.RBRACE, '}');
    return stmts;
  }

  args() {
    const a = [];
    if (this.check(TT.RPAREN)) return a;
    a.push(this.expr());
    while (this.match(TT.COMMA)) a.push(this.expr());
    return a;
  }

  // ── Expression precedence: or -> and -> not -> compare -> add -> mul -> unary -> primary ──
  expr()    { return this.or(); }
  or()      { let l = this.and(); while (this.check(TT.OR))  { this.adv(); l = { type: 'BinOp', op: 'OR',  left: l, right: this.and() }; }  return l; }
  and()     { let l = this.not(); while (this.check(TT.AND)) { this.adv(); l = { type: 'BinOp', op: 'AND', left: l, right: this.not() }; } return l; }
  not()     { if (this.check(TT.NOT)) { this.adv(); return { type: 'UnOp', op: 'NOT', expr: this.not() }; } return this.compare(); }
  compare() {
    let l = this.add();
    const ops = [TT.EQ, TT.NEQ, TT.LT, TT.GT, TT.LTE, TT.GTE];
    if (ops.includes(this.peek().type)) { const op = this.adv().value; l = { type: 'BinOp', op, left: l, right: this.add() }; }
    return l;
  }
  add() {
    let l = this.mul();
    while ([TT.PLUS, TT.MINUS].includes(this.peek().type)) { const op = this.adv().value; l = { type: 'BinOp', op, left: l, right: this.mul() }; }
    return l;
  }
  mul() {
    let l = this.unary();
    while ([TT.STAR, TT.SLASH, TT.MOD].includes(this.peek().type)) { const op = this.adv().value; l = { type: 'BinOp', op, left: l, right: this.unary() }; }
    return l;
  }
  unary() { if (this.check(TT.MINUS)) { this.adv(); return { type: 'UnOp', op: '-', expr: this.primary() }; } return this.primary(); }

  primary() {
    const tok = this.peek();
    if (tok.type === TT.NUM)  { this.adv(); return { type: 'Num', value: tok.value }; }
    if (tok.type === TT.STR)  { this.adv(); return { type: 'Str', value: tok.value }; }
    if (tok.type === TT.BOOL) { this.adv(); return { type: 'Bool', value: tok.value }; }

    if (tok.type === TT.LPAREN) {
      this.adv(); const e = this.expr(); this.expect(TT.RPAREN, ')'); return e;
    }

    if (tok.type === TT.LBRACKET) {
      this.adv();
      const items = [];
      if (!this.check(TT.RBRACKET)) { items.push(this.expr()); while (this.match(TT.COMMA)) items.push(this.expr()); }
      this.expect(TT.RBRACKET, ']');
      return { type: 'List', items };
    }

    // Built-ins used as expressions
    const BIS = [TT.INPUT, TT.RANDOM, TT.LENGTH, TT.APPEND, TT.INSERT, TT.REMOVE,
                 TT.RENDER, TT.SPAWN, TT.MOVE_FORWARD, TT.ROTATE_LEFT, TT.ROTATE_RIGHT, TT.CAN_MOVE];
    if (BIS.includes(tok.type)) {
      this.adv(); this.expect(TT.LPAREN, '(');
      const args = this.args(); this.expect(TT.RPAREN, ')');
      return { type: 'Builtin', name: tok.value, args };
    }

    if (tok.type === TT.IDENT) {
      this.adv();
      if (this.check(TT.LPAREN)) {
        this.adv(); const args = this.args(); this.expect(TT.RPAREN, ')');
        return { type: 'Call', name: tok.value, args };
      }
      let node = { type: 'Var', name: tok.value };
      while (this.check(TT.LBRACKET)) {
        this.adv(); const idx = this.expr(); this.expect(TT.RBRACKET, ']');
        node = { type: 'Index', list: node, index: idx };
      }
      return node;
    }

    throw new Error(`Line ${tok.line}: unexpected '${tok.value}'`);
  }
}

export default Parser;
