"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport = require("passport");
const NoteController_1 = require("./controllers/NoteController");
const enums_1 = require("./typization/enums");
class NoteRouterConfig {
    constructor() {
        this.router = express_1.Router();
        this.noteController = new NoteController_1.default();
        this.passport = passport;
        this.configure = () => {
            this.router
                .route('/')
                .post(this.noteController.extractUserWithJwt, (req, res, next) => {
                console.log(res.locals);
            }, this.noteController.createNote)
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.noteController.getUserNotes);
            this.router
                .route('/:id')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.noteController.getNoteById)
                .put(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.noteController.editNote)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, {
                session: false,
            }), this.noteController.deleteNote);
        };
    }
}
exports.default = NoteRouterConfig;
