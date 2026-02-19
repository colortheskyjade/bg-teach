import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose, { Document } from 'mongoose';

export class BoardGame {
  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ required: true, unique: true, index: true })
  public slug!: string;

  @prop({ required: true })
  public bggUrl!: string;
}

export type BoardGameDocument = BoardGame & Document;

const BoardGameModel = mongoose.models.BoardGame || getModelForClass(BoardGame);

export default BoardGameModel;
