import { getModelForClass, prop } from '@typegoose/typegoose';
import { IBoardGame } from '../interfaces/BoardGame';

export class BoardGame implements IBoardGame {
  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ required: true })
  public bggUrl!: string;
}

const BoardGameModel = getModelForClass(BoardGame);

export default BoardGameModel;
