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
  startRound: () => {
    set((state) => {
      const nextPlayer = state.game.round.nextPlayer();
      if (nextPlayer.name === "Me") {
        state.game.gameStatus = "AWAIT_TRUMPS";
        return { ...state };
      }
      state.game.start(nextPlayer.decideTrumps());
      state.game.gameStatus = "STARTED";
      return { ...state };
    });
  },
  callTrumps: (trumps) =>
    set((state) => {
      state.game.start(trumps);
      state.game.gameStatus = "STARTED";
      return { ...state };
    }),
  nextMove: (card) =>
    set((state) => {
      if (state.game.round.hasRoundCompleted()) {
        state.game.gameStatus = "AWAIT_CLOSE";
        return { ...state };
      }
      if (card) {
        const nextPlayer = state.game.round.nextPlayer();
        state.game.gameStatus = "STARTED";
        state.game.drawCard(card);
        nextPlayer.removeCard(card);
        return { ...state };
      }

      const nextPlayer = state.game.round.nextPlayer();
      if (nextPlayer.name === "Me") {
        state.game.gameStatus = "AWAIT_CARD";
        return { ...state };
      }

      state.game.gameStatus = "STARTED";
      state.game.drawCard(nextPlayer.drawCard(state.game));
      return { ...state };
    }),
  closeRound: () => {
    set((state) => {
      if (state.game.round.hasRoundCompleted()) {
        state.game.gameStatus = "STARTED";
        state.game.decideWinnerForRound();
        return { ...state };
      }
    });
  },
});

export const useGameStore = create(reducer);
