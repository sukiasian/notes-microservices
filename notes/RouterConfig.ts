import { Router } from 'express';
import { PassportStatic } from 'passport';
import * as passport from 'passport';
import NoteController from './controllers/NoteController';
import { AbstractNoteRouterConfig } from './typization/abstractClasses';
import { PassportStrategies } from './typization/enums';

export default class NoteRouterConfig implements AbstractNoteRouterConfig {
    public router = Router();
    private readonly noteController: NoteController = new NoteController();
    private readonly passport: PassportStatic = passport;

    configure = () => {
        this.router
            .route('/')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.noteController.createNote
            )
            .get(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.noteController.getUserNotes
            );

        this.router
            .route('/:id')
            .get(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.noteController.getNoteById
            )
            .put(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.noteController.editNote
            )
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, {
                    session: false,
                }),
                this.noteController.deleteNote
            );
    };
}
