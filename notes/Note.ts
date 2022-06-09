import { Optional } from 'sequelize';
import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';

export interface NoteAttributes {
    id: string;
    userId: string;
    content?: string;
}
export interface NoteCreationAttributes extends Optional<NoteAttributes, 'id'> {}

@Table({
    timestamps: true,
})
export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    public id!: string;

    @Column({
        allowNull: false,
    })
    public userId: string;

    @Column({
        allowNull: true,
    })
    public content: string;
}
