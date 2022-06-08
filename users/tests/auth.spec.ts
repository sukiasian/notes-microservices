import * as express from "express";
import * as request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { User, UserCreationAttributes } from "../User";
import TestLib from "./TestLib";
import { HttpStatus, Routes } from "../typization/enums";
import { AppConfig } from "../AppConfig";

describe("Auth (e2e)", () => {
    const appConfig = new AppConfig();
    const testLib = new TestLib();
    let app: express.Application;
    let server: any;
    let db: Sequelize;
    let userData: UserCreationAttributes;
    let model: typeof User;

    beforeAll(async () => {
        app = appConfig.app;
        db = appConfig.sequelize;
        model = User;
        server = (await testLib.openTestEnv(appConfig)).server;
        userData = testLib.createFakeUserData();
    });

    beforeEach(async () => {});

    afterEach(async () => {
        testLib.clearDb(db);
    });

    afterAll(async () => {
        await testLib.closeTestEnv(db, server);
    });

    it("POST /auth/signup should create new user in db", async () => {
        const users = await model.findAll();

        expect(users.length).toBe(0);

        const res = await request(app)
            .post(`${Routes.AUTH}/signup`)
            .send(userData);

        expect(res.status).toBe(HttpStatus.CREATED);

        const user = await model.findOne({ where: { email: userData.email } });

        expect(user).toBeDefined();
    });

    it("POST /auth/signup should put jwt into cookies", async () => {
        const res = await request(app)
            .post(`${Routes.AUTH}/signup`)
            .send(userData);

        expect(res.status).toBe(HttpStatus.CREATED);

        const jwtCookie = res.headers["set-cookie"].find((cookie) =>
            cookie.includes("jwt")
        );

        expect(jwtCookie).toBeDefined();
    });

    it("POST /auth/login should not allow users with invalid credentials", async () => {
        const res = await request(app)
            .post(`${Routes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });

        expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("POST /auth/login should allow users with valid credentials", async () => {
        await model.create(userData);

        const res = await request(app)
            .post(`${Routes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });

        expect(res.status).toBe(HttpStatus.OK);
    });

    it("GET /auth/logout should remove HTTP-only cookies from browser", async () => {
        const user = await model.create(userData);
        const res_1 = await request(app)
            .post(`${Routes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });

        expect(res_1.status).toBe(HttpStatus.OK);
        expect(res_1.headers["set-cookie"]).toBeDefined();

        const token = testLib.createTokenAndSign({ id: user.id });
        const res_2 = await request(app)
            .get(`${Routes.AUTH}/logout`)
            .set("Cookie", [`jwt=${token}`]);

        expect(res_2.status).toBe(HttpStatus.OK);

        expect(
            res_2.headers["set-cookie"]
                .find((cookie) => cookie.includes("jwt"))
                .match(/jwt=;/)
        ).not.toBeNull();
    });
});
