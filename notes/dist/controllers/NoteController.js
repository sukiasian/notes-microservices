"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dao_1 = require("../Dao");
const jwt = require("jsonwebtoken");
const v8_1 = require("v8");
const kafka_1 = require("../kafka");
const enums_1 = require("../typization/enums");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class NoteController {
    constructor() {
        this.dao = Dao_1.dao;
        this.utilFunctions = UtilFunctions_1.default;
        this.createNote = this.utilFunctions.catchAsync(async (req, res, next) => {
            const createNoteData = req.body;
            const note = await this.dao.createNote(createNoteData);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.NOTE_IS_CREATED, note);
        });
        this.getUserNotes = this.utilFunctions.catchAsync(async (req, res, next) => {
            const notes = await this.dao.getUserNotes(req.user.id);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, notes);
        });
        this.getNoteById = this.utilFunctions.catchAsync(async (req, res, next) => {
            const note = await this.dao.getNoteById(req.params.id);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, note);
        });
        this.editNote = this.utilFunctions.catchAsync(async (req, res, next) => {
            const editNoteData = req.body;
            await this.dao.editNote(req.params.id, editNoteData);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.NOTE_IS_EDITED, null);
        });
        this.deleteNote = this.utilFunctions.catchAsync(async (req, res, next) => {
            await this.dao.deleteNote(req.params.id);
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.NOTE_IS_DELETED);
        });
        this.extractUserWithJwt = this.utilFunctions.catchAsync(async (req, res, next) => {
            const consumer = new kafka_1.KafkaReceiver();
            const producer = new kafka_1.KafkaSender();
            let token;
            if (req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.substring(7, req.headers.authorization.length);
                console.log(req.headers['Authorization'], req.headers, req.headers.authorization);
            }
            else {
                token = req.cookies['jwt'];
            }
            const payload = jwt.decode(token);
            await producer.queueUserJwt(payload.id);
            await consumer.consumer.connect();
            await consumer.consumer.subscribe({ topic: 'user-data', fromBeginning: true });
            await consumer.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    res.locals = { user: v8_1.deserialize(message.value) };
                    // cb(user)
                    // await this.consumer.disconnect();
                },
            });
            next();
        });
    }
}
exports.default = NoteController;
