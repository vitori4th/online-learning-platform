const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const authorEmail = 'author@example.com';
const originalChapter = { chapterName: 'Original', duration: '1 hora', topics: ['Original topic'] };
const edit = { courseId: 'course', chapterIndex: 0, chapter: { chapterName: ' Updated ', duration: ' 2 horas ', topics: [' New topic '] } };

function loadRoute(file, { email = authorEmail, missing = false, generated = false, dbFails = false } = {}) {
    const course = {
        cid: 'course', userEmail: authorEmail, includeVideo: false,
        courseContent: generated ? [{ courseData: {} }] : [],
        courseJson: { course: { name: 'Test', chapters: [originalChapter, originalChapter] } },
    };
    const writes = [];
    const inputs = [];
    const conditions = [];
    const db = {
        select: () => ({ from: () => ({ where: async () => missing ? [] : [course] }) }),
        update: () => ({ set: (value) => ({ where: (condition) => {
            if (dbFails) throw new Error('Database failure');
            writes.push(value);
            conditions.push(condition);
            return { returning: async () => [{ ...course, ...value }] };
        } }) }),
    };
    const exports = {};
    const mocks = {
        '@/config/db': { db },
        '@/config/schema': { coursesTable: { cid: 'cid', userEmail: 'userEmail' } },
        '@clerk/nextjs/server': { currentUser: async () => email ? { primaryEmailAddress: { emailAddress: email } } : null },
        'drizzle-orm': { eq: (column, value) => [column, value], and: (...values) => values },
        'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
        '@/config/openai': {
            generateStructuredResponse: async ({ input }) => { inputs.push(input); return input; },
            openAIErrorResponse: () => ({ status: 500 }),
        },
        axios: { default: { get: async () => { throw new Error('Unexpected YouTube request'); } } },
    };
    const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    vm.runInNewContext(compiled.outputText, { exports, require: (name) => mocks[name], SyntaxError, console: { error: () => {} }, process: { env: {} } });
    return { route: exports, writes, inputs, conditions };
}

const request = (body = edit) => ({ json: async () => body });
const courseRoute = 'src/app/api/courses/route.jsx';
const contentRoute = 'src/app/api/generate-course-content/route.jsx';

test('author saves trimmed chapter fields while preserving other chapters and course data', async () => {
    const { route, writes, conditions } = loadRoute(courseRoute);
    const response = await route.PATCH(request());
    assert.equal(response.status, 200);
    const saved = writes[0].courseJson.course;
    assert.equal(saved.name, 'Test');
    assert.equal(saved.chapters[0].chapterName, 'Updated');
    assert.equal(saved.chapters[0].topics[0], 'New topic');
    assert.equal(saved.chapters[1].chapterName, 'Original');
    assert.equal(response.body.userEmail, authorEmail);
    assert.deepEqual(conditions[0], [['cid', 'course'], ['userEmail', authorEmail]]);
});

for (const [label, options, status] of [
    ['anonymous', { email: null }, 401],
    ['another user', { email: 'other@example.com' }, 403],
    ['missing course', { missing: true }, 404],
    ['generated content', { generated: true }, 409],
    ['database failure', { dbFails: true }, 500],
]) {
    test(`chapter update rejects ${label}`, async () => {
        const { route, writes } = loadRoute(courseRoute, options);
        assert.equal((await route.PATCH(request())).status, status);
        assert.equal(writes.length, 0);
    });
}

for (const invalid of [
    { chapterIndex: -1 }, { chapterIndex: 0.5 }, { courseId: '' },
    { chapter: { ...edit.chapter, chapterName: ' ' } },
    { chapter: { ...edit.chapter, duration: '' } },
    { chapter: { ...edit.chapter, topics: [] } },
    { chapter: { ...edit.chapter, topics: [null] } },
]) {
    test(`invalid chapter is rejected: ${JSON.stringify(invalid)}`, async () => {
        const { route, writes } = loadRoute(courseRoute);
        assert.equal((await route.PATCH(request({ ...edit, ...invalid }))).status, 400);
        assert.equal(writes.length, 0);
    });
}

test('unknown chapter and malformed JSON are rejected', async () => {
    const { route } = loadRoute(courseRoute);
    assert.equal((await route.PATCH(request({ ...edit, chapterIndex: 20 }))).status, 404);
    assert.equal((await route.PATCH({ json: async () => { throw new SyntaxError(); } })).status, 400);
});

test('generation uses persisted chapters instead of client-supplied chapter content', async () => {
    const { route, inputs, writes } = loadRoute(contentRoute);
    const result = await route.POST(request({ courseId: 'course', courseJson: { chapters: [{ chapterName: 'Forged' }] } }));
    assert.equal(result.status, 200);
    assert.equal(inputs.length, 2);
    assert.equal(inputs[0].chapterName, 'Original');
    assert.equal(writes[0].courseContent[0].youtubeVideo.length, 0);
});

test('generation also rejects non-authors and anonymous users', async () => {
    for (const [email, status] of [[null, 401], ['other@example.com', 403]]) {
        const { route, inputs, writes } = loadRoute(contentRoute, { email });
        assert.equal((await route.POST(request({ courseId: 'course' }))).status, status);
        assert.equal(inputs.length, 0);
        assert.equal(writes.length, 0);
    }
});
