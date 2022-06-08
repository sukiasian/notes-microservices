import * as express from 'express';
import * as request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { User, UserCreationAttributes } from '../User';
import TestLib from './TestLib';
import { HttpStatus, Routes } from '../typization/enums';
import { AppConfig } from '../AppConfig';

describe('User (e2e)', () => {
    const appConfig = new AppConfig();
    const testLib = new TestLib();
    let app: express.Application;
    let server: any;
    let db: Sequelize;
    let userData: UserCreationAttributes;
    let model: typeof User;
    let user: User;
    let token: string;

    beforeAll(async () => {
        app = appConfig.app;
        db = appConfig.sequelize;
        model = User;
        server = (await testLib.openTestEnv(appConfig)).server;
        userData = testLib.createFakeUserData();
    });

    beforeEach(async () => {
        user = await model.create(userData);
        token = testLib.createTokenAndSign({ id: user.id });
    });

    afterEach(async () => {
        testLib.clearDb(db);
    });

    afterAll(async () => {
        await testLib.closeTestEnv(db, server);
    });

    it('GET /user/:id should find user by their id', async () => {
        const res = await request(app)
            .get(`${Routes.USER}/${user.id}`)
            .set('Cookie', [`jwt=${token}`]);

        expect(res.body.data.id).toBe(user.id);
    });

    it('PUT /user/:id should change user data', async () => {
        expect(user.firstName).not.toBe('Changed');

        const res = await request(app)
            .put(`${Routes.USER}/${user.id}`)
            .send({ firstName: 'Changed' })
            .set('Cookie', [`jwt=${token}`]);

        expect(res.status).toBe(HttpStatus.OK);

        const freshUser = await model.findOne({ where: { id: user.id } });

        expect(freshUser.firstName).toBe('Changed');
    });

    it('DELETE /user/:id should not delete user if password is incorrect', async () => {
        const res_1 = await request(app)
            .delete(`${Routes.USER}`)
            .send({ password: 'Different-password' })
            .set('Cookie', [`jwt=${token}`]);

        expect(res_1.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('DELETE /user/:id should delete user if password is correct', async () => {
        const res_1 = await request(app)
            .delete(`${Routes.USER}`)
            .send({ password: userData.password })
            .set('Cookie', [`jwt=${token}`]);

        expect(res_1.status).toBe(HttpStatus.OK);
    });
});
