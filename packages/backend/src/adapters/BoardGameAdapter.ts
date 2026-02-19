import { IBoardGame } from '../interfaces/BoardGame';
import { BoardGameDocument } from '../models/BoardGame';

export const toBoardGamePojo = (boardGameDoc: BoardGameDocument): IBoardGame => {
  return {
    id: boardGameDoc._id.toString(),
    name: boardGameDoc.name,
    bggUrl: boardGameDoc.bggUrl,
  };
};

export const toBoardGamePojoArray = (boardGameDocs: BoardGameDocument[]): IBoardGame[] => {
  return boardGameDocs.map(toBoardGamePojo);
};
