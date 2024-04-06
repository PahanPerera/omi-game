import _ from "lodash";

export const helpers = {
  removeCard(list, card) {
    _.remove(list, (c) => c.value === card.value && c.type === card.type);
  },
  getNonNull(list) {
    return _.filter(list, (card) => !!card);
  },
  filterCardsByType(list, type) {
    const filtered = _.filter(list, (card) => card.type === type);
    if (filtered.length === 0) return null;
    return filtered;
  },
  hasCard(list, value, type) {
    const index = _.findIndex(
      list,
      (card) => card.value === value && card.type === type
    );
    return index > -1;
  },
  findCard(list, value, type) {
    return _.find(list, (card) => card.value === value && card.type === type);
  },
};

export const selectTrumps = (cards) => {
  const valuesMap = _.reduce(
    cards,
    (obj, card) => {
      const currVal = _.get(obj, card.type, 0);
      _.set(obj, card.type, currVal + card.value);
      return obj;
    },
    {}
  );
  const pairs = _.toPairs(valuesMap);
  const max = _.maxBy(pairs, (i) => i[1]);
  return max[0];
};

export const getWinnerId = (cards, trumps, type) => {
  let winnerIndex = -1;
  let maxTrumpCard = _.maxBy(cards, (card) =>
    card.type === trumps ? card.value : 0
  );
  if (maxTrumpCard > 0) {
    winnerIndex = _.findIndex(
      cards,
      (card) => card.type === trumps && card.value === maxTrumpCard.value
    );
  } else {
    let maxTypeCard = _.maxBy(cards, (card) =>
      card.type === type ? card.value : 0
    );
    winnerIndex = _.findIndex(
      cards,
      (card) => card.type === type && card.value === maxTypeCard.value
    );
  }
  return winnerIndex;
};

export const selectBestCard = (
  myCards,
  trumps,
  cardsOnTable,
  cardTypeForThisRound,
  oldCards
) => {
  const VALUE_ARR = [14, 13, 12, 11, 10, 9, 8, 7];

  console.log("-------------- selectBestCard -------------------");
  if (myCards.length == 1) return myCards[0];

  let myCardsWithTrumps = helpers.filterCardsByType(myCards, trumps);
  console.log("myCardsWithTrumps", myCardsWithTrumps);
  let myCardsWithType = null;
  if (cardTypeForThisRound) {
    myCardsWithType = helpers.filterCardsByType(myCards, cardTypeForThisRound);
  }
  console.log("myCardsWithType", myCardsWithType);

  // first turn
  if (!cardTypeForThisRound) {
    // if I have trumps
    if (myCardsWithTrumps) {
      // maximum trump card that I can get
      console.log("Trying to find the MAX Trump card that I can get");
      for (let val of VALUE_ARR) {
        const isCardUsed = helpers.hasCard(oldCards, val, trumps);
        if (isCardUsed) continue;
        const doIHaveThatCard = helpers.findCard(myCards, val, trumps);
        if (doIHaveThatCard) {
          return doIHaveThatCard;
        }
        break;
      }
    }
  }
  // other turns
  if (cardTypeForThisRound) {
    let cardsOnTableWithTrumps = helpers.filterCardsByType(
      cardsOnTable,
      trumps
    );

    console.log("cardsOnTableWithTrumps", cardsOnTableWithTrumps);

    // if the trumps and  the round type are the same - treat if as normal type
    // if (trumps === cardTypeForThisRound) {
    //   cardsOnTableWithTrumps = null;
    // }

    // I dont have type cards and trumps is used
    if (!myCardsWithType && cardsOnTableWithTrumps) {
      console.log("I dont have type cards and trumps is used");
      const maxTrumpCardOnTable = _.maxBy(
        cardsOnTableWithTrumps,
        (card) => card.value
      );
      const doIHaveAMaxTrumpCard = _.filter(
        myCards,
        (card) => card.type === trumps && card.value > maxTrumpCardOnTable.value
      );
      if (doIHaveAMaxTrumpCard.length > 0) {
        return doIHaveAMaxTrumpCard;
      }
    }

    // I dont have type cards and trumps are not used yet (I have trumps)
    if (!myCardsWithType && !cardsOnTableWithTrumps && myCardsWithTrumps) {
      console.log(
        "I dont have type cards and trumps are not used yet (I have trumps)"
      );
      const minCardByType = _.minBy(myCardsWithTrumps, (card) => card.value);
      return minCardByType;
    }

    // I have type cards but trumps is used
    if (myCardsWithType && cardsOnTableWithTrumps) {
      console.log("I have type cards but trumps is used");
      const minCardByType = _.minBy(myCardsWithType, (card) => card.value);
      return minCardByType;
    }

    // I have type cards and trumps is NOT used
    if (myCardsWithType && !cardsOnTableWithTrumps) {
      console.log("I have type cards and trumps is NOT used");
      for (let val of VALUE_ARR) {
        const isCardUsed = helpers.hasCard(oldCards, val, cardTypeForThisRound);
        const isCardOnTable = helpers.hasCard(
          cardsOnTable,
          val,
          cardTypeForThisRound
        );
        // has max card is used in this round
        if (isCardOnTable) {
          return _.minBy(myCardsWithType, (card) => card.value);
        }
        if (isCardUsed) continue;
        const doIHaveThatCard = helpers.findCard(
          myCardsWithType,
          val,
          cardTypeForThisRound
        );
        if (doIHaveThatCard) {
          return doIHaveThatCard;
        }
        continue;
      }
    }
  }

  //select the min that I can get
  console.log("select the min that I can get");
  const minCard = _.minBy(myCards, (card) => card.value);
  return minCard;
};
