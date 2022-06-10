"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dao = exports.Dao = void 0;
const abstractClasses_1 = require("./typization/abstractClasses");
const Note_1 = require("./Note");
class Dao extends abstractClasses_1.AbstractDao {
    constructor() {
        super(...arguments);
        this.noteModel = Note_1.Note;
        this.createNote = async (data) => {
            return this.model.create(data);
        };
        this.getUserNotes = async (userId) => {
            return this.model.findAll({ where: { userId } });
        };
        this.getNoteById = async (noteId) => {
            return this.findById(noteId);
        };
        this.editNote = async (noteId, data) => {
            const note = await this.findById(noteId);
            note.update(data);
        };
        this.deleteNote = async (noteId) => {
            const note = await this.findById(noteId);
            note.destroy();
        };
    }
    get model() {
        return this.noteModel;
    }
}
exports.Dao = Dao;
exports.dao = new Dao();
