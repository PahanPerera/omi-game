import _ from "lodash";
import { selectTrumps, selectBestCard, helpers, getWinnerId } from "./engine";

export const CARD_TYPES = {
  HEART: "♥",
  DIAMOND: "♦",
  SPADE: "♠",
  CLUBS: "♣",
};

export const CARD_VALUES = {
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export const makeCard = (type, valueCode) => ({
  type,
  valueCode,
  value: CARD_VALUES[valueCode],
});

export const makeDeck = () => {
  const cards = [];
  _.keys(CARD_TYPES).forEach((type) => {
    _.keys(CARD_VALUES).forEach((value) => {
      const card = makeCard(type, value);
      cards.push(card);
    });
  });

  return {
    cards,
    shuffle() {
      this.cards = _.shuffle(this.cards);
    },
  };
};

export const makePlayer = (name) => ({
  name,
  points: 0,
  isActive: false,
  cards: [],
  loadCards(cards) {
    this.cards.push(...cards);
  },
  decideTrumps() {
    return selectTrumps(this.cards);
  },
  setTrumps(type) {
    this.trumps = type;
  },
  drawCard(game) {
    const card = selectBestCard(
      this.cards,
      this.trumps,
      helpers.getNonNull(game.round.cards),
      game.round.cardType,
      game.oldCards
    );
    helpers.removeCard(this.cards, card);
    return card;
  },
  addPoints() {
    this.points++;
  },
  removeCard(card) {
    helpers.removeCard(this.cards, card);
  },
});

export const makeRound = (players) => ({
  nextPlayerId: 0,
  cards: [],
  cardType: undefined,
  prevPlayerId: 0,
  incrementNextPlayerId() {
    this.nextPlayerId = this.nextPlayerId === 3 ? 0 : this.nextPlayerId + 1;
    this.setPlayerActive(this.nextPlayerId);
  },
  setPlayerActive(playerId) {
    players.forEach((player) => (player.isActive = false));
    players[playerId].isActive = true;
  },
  hasRoundStarted() {
    return this.cards.length > 0;
  },
  hasRoundCompleted() {
    return helpers.getNonNull(this.cards).length === 4;
  },
  nextPlayer() {
    return players[this.nextPlayerId];
  },
  addCard(card) {
    if (!this.hasRoundStarted()) {
      this.cardType = card.type;
    }
    this.cards[this.nextPlayerId] = card;
    this.incrementNextPlayerId();
  },
  decideWinner(trumps) {
    const winnerId = getWinnerId(this.cards, trumps, this.cardType);
    players[winnerId].addPoints();
    this.prevPlayerId = winnerId;
  },
  start() {
    this.cards = [];
    this.nextPlayerId = this.prevPlayerId;
    this.setPlayerActive(this.nextPlayerId);
    this.cardType = undefined;
  },
});

export const makeGame = (deck, players) => {
  const distributeCards = (cards) => {
    const chucks = _.chunk(cards, 4);
    for (let i in players) {
      players[i].loadCards(chucks[i]);
    }
    return chucks.slice(4, 8);
  };
  return {
    players,
    oldCards: [],
    trumps: undefined,
    init() {
      this.remaininigCards = distributeCards(deck.cards);
      this.round = makeRound(players);
      this.gameStatus = "NOT_STARTED";
    },
    start(trumps) {
      this.trumps = trumps;
      for (let i in players) {
        players[i].loadCards(this.remaininigCards[i]);
        players[i].setTrumps(trumps);
      }
      this.round.start();
    },
    drawCard(card) {
      this.round.addCard(card);
      this.oldCards.push(card);
    },
    decideWinnerForRound() {
      this.round.decideWinner(this.trumps);
      this.round.start();
    },
  };
};
