import { Sequelize } from 'sequelize-typescript';
import { Note } from '../Note';
import { CreateNoteData, EditNoteData } from './interfaces';

abstract class AbstractConfig {
    configure: (...props: any) => any;
}

export abstract class AbstractAppConfig extends AbstractConfig {
    app: Express.Application;
    sequelize: Sequelize;
    setupPassport: () => void;
}

export abstract class AbstractEnvironmentConfig extends AbstractConfig {}

export abstract class AbstractPassportConfig extends AbstractConfig {
    initialize: () => void;
}

export abstract class AbstractNoteRouterConfig extends AbstractConfig {}

export abstract class AbstractServer {}

export abstract class AbstractNoteController {
    createNote: (req, res, next) => Promise<void>;
    getUserNotes: (req, res, next) => Promise<void>;
    getNoteById: (req, res, next) => Promise<void>;
    editNote: (req, res, next) => Promise<void>;
    deleteNote: (req, res, next) => Promise<void>;
}

export abstract class AbstractDao {
    findById = (id: string): Promise<Note> => {
        return Note.findOne({ where: { id } });
    };

    createNote: (data: CreateNoteData) => Promise<Note>;
    getUserNotes: (userId: string) => Promise<Note[]>;
    editNote: (noteId: string, data: EditNoteData) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
}
