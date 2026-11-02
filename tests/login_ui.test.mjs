import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const loginSource = readFileSync(new URL('../assets/js/api/login.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '');

function loadLogin({ springEnabled = false, fetch, document = {} } = {}) {
    const context = vm.createContext({
        springEnabled,
        pythonURI: 'https://flask.example',
        javaURI: 'https://spring.example',
        baseurl: '',
        fetchOptions: { credentials: 'include' },
        fetch,
        document: { addEventListener() {}, querySelectorAll: () => [], ...document },
        window: {},
        localStorage: { getItem: () => null },
        console: { log() {}, warn() {}, error() {} },
        setTimeout,
    });
    vm.runInContext(loginSource, context);
    return context;
}

test('Flask-only sites do not contact Spring when the visitor is signed out', async () => {
    const calls = [];
    const context = loadLogin({ fetch: async (url) => {
        calls.push(url);
        return { ok: false, status: 401 };
    } });
    assert.equal(await context.getCredentials(), null);
    assert.deepEqual(calls, ['https://flask.example/api/id']);
});

test('Flask-only sites do not contact Spring after a Flask network failure', async () => {
    const calls = [];
    const context = loadLogin({ fetch: async (url) => {
        calls.push(url);
        throw new TypeError('Network unavailable');
    } });
    assert.equal(await context.getCredentials(), null);
    assert.deepEqual(calls, ['https://flask.example/api/id']);
});

test('Spring-enabled sites retain the Spring-only account fallback', async () => {
    const calls = [];
    const context = loadLogin({ springEnabled: true, fetch: async (url) => {
        calls.push(url);
        return url.includes('flask')
            ? { ok: false, status: 401 }
            : { ok: true, json: async () => ({ uid: 'mentor' }) };
    } });
    const user = await context.getCredentials();
    assert.equal(user.uid, 'mentor');
    assert.equal(user.source, 'spring');
    assert.deepEqual(calls, ['https://flask.example/api/id', 'https://spring.example/api/person/get']);
});

test('an existing Flask session does not need a Spring fallback', async () => {
    const calls = [];
    const person = { uid: 'student' };
    const context = loadLogin({ springEnabled: true, fetch: async (url) => {
        calls.push(url);
        return { ok: true, json: async () => person };
    } });
    assert.equal(await context.getCredentials(), person);
    assert.deepEqual(calls, ['https://flask.example/api/id']);
});

test('unavailable Spring fallback leaves the visitor signed out', async () => {
    const context = loadLogin({ springEnabled: true, fetch: async (url) => {
        if (url.includes('spring')) throw new TypeError('Spring unavailable');
        return { ok: false, status: 401 };
    } });
    assert.equal(await context.getCredentials(), null);
});
