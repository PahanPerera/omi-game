import { create } from "zustand";
import _ from "lodash";
import { makeDeck, makeGame, makePlayer } from "../game/game";

export const makeNewGame = () => {
  const deck = makeDeck();
  deck.shuffle();
  const playerMe = makePlayer("Me");
  const playerLeft = makePlayer("Left");
  const playerUp = makePlayer("Friend");
  const playerRight = makePlayer("Right");
  const players = [playerMe, playerRight, playerUp, playerLeft];
  const game = makeGame(deck, players);
  game.init();
  return game;
};

const reducer = (set) => ({
  game: makeNewGame(),
  callTrumps: () =>
    set((state) => {
      const nextPlayer = state.game.round.nextPlayer();
      state.game.start(nextPlayer.decideTrumps());
      return { ...state };
    }),
  nextMove: () =>
    set((state) => {
      if (state.game.round.hasRoundCompleted()) {
        state.game.decideWinnerForRound();
        return { ...state };
      }
      const nextPlayer = state.game.round.nextPlayer();
      state.game.drawCard(nextPlayer.drawCard(state.game));
      return { ...state };
    }),
});

export const useGameStore = create(reducer);
