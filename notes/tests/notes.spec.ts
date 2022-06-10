import * as express from 'express';
import * as request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import TestLib from './TestLib';
import { HttpStatus, Routes } from '../typization/enums';
import AppConfig from '../AppConfig';
import { Note } from '../Note';

describe('Notes (e2e)', () => {
    const appConfig = new AppConfig();
    const testLib = new TestLib();
    let app: express.Application;
    let server: any;
    let db: Sequelize;
    let userId: string;
    let token: string;
    let model: typeof Note;
    let noteData;

    beforeAll(async () => {
        app = appConfig.app;
        db = appConfig.sequelize;
        model = Note;
        userId = 'b9832435-6a22-4c8d-ba7b-c7bbe2e3a411';
        token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5ODMyNDM1LTZhMjItNGM4ZC1iYTdiLWM3YmJlMmUzYTQxMSIsImlhdCI6MTY1NDgxMzI1MH0.941y0I6EZVlmJ_HLc4zVqZSqmkav2hSEJGiHkd9IiF0';
        server = (await testLib.openTestEnv(appConfig)).server;
        noteData = testLib.createFakeNoteData(userId);
    });

    beforeEach(async () => {});

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
            .post(`${Routes.NOTES}/`)
            .send(noteData)
            .set('Cookie', [`jwt=${token}`]);

        expect(res.status).toBe(HttpStatus.CREATED);
    });

    it("GET /notes should return user's notes", async () => {
        const res_1 = await request(app)
            .get(`${Routes.NOTES}`)
            .set('Cookie', [`jwt=${token}`]);

        expect(res_1.body.data.length).toBe(0);

        const res_2 = await request(app)
            .post(`${Routes.NOTES}`)
            .send(noteData)
            .set('Cookie', [`jwt=${token}`]);

        expect(res_2.body.data.length).not.toBe(0);
    });

    it("PUT /notes/:id should edit user's note by note id", async () => {
        const note = await model.create(noteData);

        const res = await request(app)
            .put(`${Routes.NOTES}/${note.id}`)
            .send({ content: 'New content' })
            .set('Cookie', [`jwt=${token}`]);

        expect(res.status).toBe(HttpStatus.OK);

        const noteFresh = await model.findOne({ where: { id: note.id } });

        expect(noteFresh.content).not.toEqual(note.content);
    });

    it("DELETE /notes/:id should delete user's note by note id", async () => {
        const note = await model.create(noteData);

        const res = await request(app)
            .delete(`${Routes.NOTES}/${note.id}`)
            .set('Cookie', [`jwt=${token}`]);

        expect(res.status).toBe(HttpStatus.OK);

        const noteFresh = await model.findOne({ where: { id: note.id } });

        expect(noteFresh).toBeNull();
    });
});
