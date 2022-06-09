import { AbstractDao } from './typization/abstractClasses';
import { Note } from './Note';
import { CreateNoteData, EditNoteData } from './typization/interfaces';

export class Dao extends AbstractDao implements AbstractDao {
    noteModel = Note;

    get model(): typeof Note {
        return this.noteModel;
    }

    createNote = async (data: CreateNoteData): Promise<Note> => {
        return this.model.create(data);
    };

    getUserNotes = async (userId: string): Promise<Note[]> => {
        return this.model.findAll({ where: { userId } });
    };

    getNoteById = async (noteId: string): Promise<Note> => {
        return this.findById(noteId);
    };

    editNote = async (noteId: string, data: EditNoteData): Promise<void> => {
        const note = await this.findById(noteId);

        note.update(data);
    };

    deleteNote = async (noteId: string): Promise<void> => {
        const note = await this.findById(noteId);

        note.destroy();
    };
}

export const dao = new Dao();
