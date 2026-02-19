import { IBoardGame } from '../interfaces/BoardGame';
import { BoardGame } from '../models/BoardGame';

export const toBoardGamePojo = (boardGameDoc: BoardGame): IBoardGame => {
  return {
    name: boardGameDoc.name,
    bggUrl: boardGameDoc.bggUrl,
  };
};

export const toBoardGamePojoArray = (boardGameDocs: BoardGame[]): IBoardGame[] => {
  return boardGameDocs.map(toBoardGamePojo);
};
