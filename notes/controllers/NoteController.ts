import { dao } from '../Dao';
import { AbstractNoteController } from '../typization/abstractClasses';
import { HttpStatus, ResponseMessages } from '../typization/enums';
import { CreateNoteData, EditNoteData } from '../typization/interfaces';
import UtilFunctions from '../utils/UtilFunctions';

export default class NoteController implements AbstractNoteController {
    private readonly dao = dao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public createNote = this.utilFunctions.catchAsync(async (req, res, next) => {
        const createNoteData: CreateNoteData = req.body;
        const note = await this.dao.createNote(createNoteData);

        return this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.NOTE_IS_CREATED, note);
    });

    public getUserNotes = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const notes = await this.dao.getUserNotes(req.user.id);

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, notes);
    });

    public getNoteById = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const note = await this.dao.getNoteById(req.params.id);

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, note);
    });

    public editNote = this.utilFunctions.catchAsync(async (req: any, res: any, next: any): Promise<void> => {
        const editNoteData: EditNoteData = req.body;

        await this.dao.editNote(req.params.id, editNoteData);

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.NOTE_IS_EDITED, null);
    });

    public deleteNote = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        await this.dao.deleteNote(req.params.id);

        return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.NOTE_IS_DELETED);
    });
}
