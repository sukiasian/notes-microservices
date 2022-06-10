"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const TestLib_1 = require("./TestLib");
const enums_1 = require("../typization/enums");
const AppConfig_1 = require("../AppConfig");
const Note_1 = require("../Note");
describe('Notes (e2e)', () => {
    const appConfig = new AppConfig_1.default();
    const testLib = new TestLib_1.default();
    let app;
    let server;
    let db;
    let userId;
    let token;
    let model;
    let noteData;
    beforeAll(async () => {
        app = appConfig.app;
        db = appConfig.sequelize;
        model = Note_1.Note;
        userId = 'b9832435-6a22-4c8d-ba7b-c7bbe2e3a411';
        token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5ODMyNDM1LTZhMjItNGM4ZC1iYTdiLWM3YmJlMmUzYTQxMSIsImlhdCI6MTY1NDgxMzI1MH0.941y0I6EZVlmJ_HLc4zVqZSqmkav2hSEJGiHkd9IiF0';
        server = (await testLib.openTestEnv(appConfig)).server;
        noteData = testLib.createFakeNoteData(userId);
    });
    beforeEach(async () => { });
    afterEach(async () => {
        testLib.clearDb(db);
    });
    afterAll(async () => {
        await testLib.closeTestEnv(db, server);
    });
    it('POST /notes should create new post for the user', async () => {
        const notes = await model.findAll();
        expect(notes.length).toBe(0);
        const res = await request(app)
            .post(`${enums_1.Routes.NOTES}/`)
            .send(noteData)
            .set('Cookie', [`jwt=${token}`]);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
    });
    it("GET /notes should return user's notes", async () => {
        const res_1 = await request(app)
            .get(`${enums_1.Routes.NOTES}`)
            .set('Cookie', [`jwt=${token}`]);
        expect(res_1.body.data.length).toBe(0);
        const res_2 = await request(app)
            .post(`${enums_1.Routes.NOTES}`)
            .send(noteData)
            .set('Cookie', [`jwt=${token}`]);
        expect(res_2.body.data.length).not.toBe(0);
    });
    it("PUT /notes/:id should edit user's note by note id", async () => {
        const note = await model.create(noteData);
        const res = await request(app)
            .put(`${enums_1.Routes.NOTES}/${note.id}`)
            .send({ content: 'New content' })
            .set('Cookie', [`jwt=${token}`]);
        expect(res.status).toBe(enums_1.HttpStatus.OK);
        const noteFresh = await model.findOne({ where: { id: note.id } });
        expect(noteFresh.content).not.toEqual(note.content);
    });
    it("DELETE /notes/:id should delete user's note by note id", async () => {
        const note = await model.create(noteData);
        const res = await request(app)
            .delete(`${enums_1.Routes.NOTES}/${note.id}`)
            .set('Cookie', [`jwt=${token}`]);
        expect(res.status).toBe(enums_1.HttpStatus.OK);
        const noteFresh = await model.findOne({ where: { id: note.id } });
        expect(noteFresh).toBeNull();
    });
});
