"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const User_1 = require("../User");
const TestLib_1 = require("./TestLib");
const enums_1 = require("../typization/enums");
const AppConfig_1 = require("../AppConfig");
describe('User (e2e)', () => {
    const appConfig = new AppConfig_1.default();
    const testLib = new TestLib_1.default();
    let app;
    let server;
    let db;
    let userData;
    let model;
    let user;
    let token;
    beforeAll(async () => {
        app = appConfig.app;
        db = appConfig.sequelize;
        model = User_1.User;
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
            .get(`${enums_1.Routes.USER}/${user.id}`)
            .set('Cookie', [`jwt=${token}`]);
        expect(res.body.data.id).toBe(user.id);
    });
    it('PUT /user/:id should change user data', async () => {
        expect(user.firstName).not.toBe('Changed');
        const res = await request(app)
            .put(`${enums_1.Routes.USER}/${user.id}`)
            .send({ firstName: 'Changed' })
            .set('Cookie', [`jwt=${token}`]);
        expect(res.status).toBe(enums_1.HttpStatus.OK);
        const freshUser = await model.findOne({ where: { id: user.id } });
        expect(freshUser.firstName).toBe('Changed');
    });
    it('DELETE /user/:id should not delete user if password is incorrect', async () => {
        const res_1 = await request(app)
            .delete(`${enums_1.Routes.USER}`)
            .send({ password: 'Different-password' })
            .set('Cookie', [`jwt=${token}`]);
        expect(res_1.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
    it('DELETE /user/:id should delete user if password is correct', async () => {
        const res_1 = await request(app)
            .delete(`${enums_1.Routes.USER}`)
            .send({ password: userData.password })
            .set('Cookie', [`jwt=${token}`]);
        expect(res_1.status).toBe(enums_1.HttpStatus.OK);
    });
});
