import { getModelForClass, prop } from '@typegoose/typegoose';
import { IBoardGame } from '../interfaces/BoardGame';
import { Document } from 'mongoose';

export class BoardGame {
  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ required: true })
  public bggUrl!: string;
}

export type BoardGameDocument = BoardGame & Document;

const BoardGameModel = getModelForClass(BoardGame);

export default BoardGameModel;
