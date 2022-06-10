"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const User_1 = require("../User");
const TestLib_1 = require("./TestLib");
const enums_1 = require("../typization/enums");
const AppConfig_1 = require("../AppConfig");
describe('Auth (e2e)', () => {
    const appConfig = new AppConfig_1.default();
    const testLib = new TestLib_1.default();
    let app;
    let server;
    let db;
    let userData;
    let model;
    beforeAll(async () => {
        app = appConfig.app;
        db = appConfig.sequelize;
        model = User_1.User;
        server = (await testLib.openTestEnv(appConfig)).server;
        userData = testLib.createFakeUserData();
    });
    beforeEach(async () => { });
    afterEach(async () => {
        testLib.clearDb(db);
    });
    afterAll(async () => {
        await testLib.closeTestEnv(db, server);
    });
    it('POST /auth/signup should create new user in db', async () => {
        const users = await model.findAll();
        expect(users.length).toBe(0);
        const res = await request(app).post(`${enums_1.Routes.AUTH}/signup`).send(userData);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
        const user = await model.findOne({ where: { email: userData.email } });
        expect(user).toBeDefined();
    });
    it('POST /auth/signup should put jwt into cookies', async () => {
        const res = await request(app).post(`${enums_1.Routes.AUTH}/signup`).send(userData);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
        const jwtCookie = res.headers['set-cookie'].find((cookie) => cookie.includes('jwt'));
        expect(jwtCookie).toBeDefined();
    });
    it('POST /auth/login should not allow users with invalid credentials', async () => {
        const res = await request(app)
            .post(`${enums_1.Routes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });
        expect(res.status).toBe(enums_1.HttpStatus.UNAUTHORIZED);
    });
    it('POST /auth/login should allow users with valid credentials', async () => {
        await model.create(userData);
        const res = await request(app)
            .post(`${enums_1.Routes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });
        expect(res.status).toBe(enums_1.HttpStatus.OK);
    });
    it('GET /auth/logout should remove HTTP-only cookies from browser', async () => {
        const user = await model.create(userData);
        const res_1 = await request(app)
            .post(`${enums_1.Routes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });
        expect(res_1.status).toBe(enums_1.HttpStatus.OK);
        expect(res_1.headers['set-cookie']).toBeDefined();
        const token = testLib.createTokenAndSign({ id: user.id });
        const res_2 = await request(app)
            .get(`${enums_1.Routes.AUTH}/logout`)
            .set('Cookie', [`jwt=${token}`]);
        expect(res_2.status).toBe(enums_1.HttpStatus.OK);
        expect(res_2.headers['set-cookie'].find((cookie) => cookie.includes('jwt')).match(/jwt=;/)).not.toBeNull();
    });
});
