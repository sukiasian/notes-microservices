import { NoteCreationAttributes } from '../Note';

export interface CreateNoteData extends NoteCreationAttributes {}

export interface EditNoteData {
    content?: string;
}
