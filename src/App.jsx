import { useGameStore } from "./hooks/useGameStore";
import trophyIcon from "./trophy.png";
import diamondIcon from "./diamond.png";
import logo from "./Logo.svg";
import playerMe from "./PMe.svg";
import playerUp from "./PUp.svg";
import playerLeft from "./PLeft.svg";
import playerRight from "./PRight.svg";

const CARD_TYPES = {
  HEART: "♥",
  DIAMOND: "♦",
  SPADE: "♠",
  CLUBS: "♣",
};

const Card = ({ card, type, onClick }) => {
  let valueCode = undefined;
  if (card) {
    type = CARD_TYPES[card.type];
    valueCode = card.valueCode;
  }
  const isRed = type === CARD_TYPES.HEART || type === CARD_TYPES.DIAMOND;
  const styles = isRed ? `text-red-500` : `text-black`;
  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick(card);
        }
      }}
      className={`block h-14 w-10 bg-white text-center rounded px-1 flex flex-col align-center justify-center  ${styles} drop-shadow-2xl`}
    >
      {valueCode && <span className="font-bold block h-4">{valueCode}</span>}
      <span className="text-2xl">{type}</span>
    </div>
  );
};

const ThinkingBox = () => {
  return (
    <div className="w-8 h-8 bg-black/50 p-2 rounded-full">
      <span className="w-4 h-4 border-4 border-white border-dotted animate-spin rounded-full absolute"></span>
    </div>
  );
};

const ScoreBoard = () => {
  return (
    <div className="mx-8 my-4 bg-black/50 px-2 py-2 rounded-full">
      <div className="flex items-center">
        <span className="text-blue-500 bg-blue-500/20 rounded-full px-4 py-1 relative">
          <img
            src={trophyIcon}
            className="absolute -top-1 right-4 rotate-[15deg]"
          />
          <span className="text-[8px] block text-white">TEAM</span> BLUE
        </span>
        <span className="text-blue-500 text-xl ml-2">{">"}</span>
        <span className="flex-1 text-center text-xl text-white py-2">
          10/10
        </span>
        <span className="text-red-500 mr-2 text-xl"> {"<"}</span>
        <span className="text-red-500 bg-red-500/20 rounded-full px-4 py-1">
          <span className="text-[8px] block text-white">TEAM</span>RED
        </span>
      </div>
    </div>
  );
};

const RoundDetails = ({ trumps }) => {
  const isRed = trumps === "HEART" || trumps === "DIAMOND";
  const styles = isRed ? `text-red-500` : `text-black`;
  return (
    <div className="flex mx-8 items-center gap-2 py-2 bg-black/50 rounded-full px-6">
      <p className="text-xs text-white ">Round - 1 {">"} </p>
      <div className="flex bg-white self-center px-2 py-0 rounded-full items-center">
        <img src={diamondIcon} className="h-5" />
        <span className="text-[7px] ml-1">TRUMPS {">"}</span>
        <span className={`${styles} text-xl mb-2 h-5 ml-2`}>
          {trumps && CARD_TYPES[trumps]}
          {!trumps && ""}
        </span>
      </div>
    </div>
  );
};

const Table = ({ cards, onClose }) => {
  return (
    <div
      className="w-24 h-24 absolute bottom-[16rem] left-[32%] -skew-x-[18deg] z-0"
      onClick={() => onClose()}
    >
      <div className="relative w-24 h-24 flex">
        {cards[0] && (
          <div className="absolute -bottom-6 left-2">
            <Card card={cards[0]} />
          </div>
        )}
        {cards[1] && (
          <div className="absolute -bottom-2 -right-8">
            <Card card={cards[1]} />
          </div>
        )}
        {cards[2] && (
          <div className="absolute -top-6 right-2">
            <Card card={cards[2]} />
          </div>
        )}
        {cards[3] && (
          <div className="absolute -top-2 -left-4">
            <Card card={cards[3]} />
          </div>
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="my-4 flex flex-col align-center">
      <img src={logo} className="h-20" />
    </div>
  );
};

const PlayerScore = ({ score }) => {
  return (
    <span className="px-2 py-1 bg-black/50 rounded-full text-white text-sm inline-block w-18 text-center">
      <img src={trophyIcon} className="inline mx-2" />
      <span className="mr-1">{score}</span>
    </span>
  );
};

const TrumpsSelectionBox = ({ onTrumpsSelected }) => {
  return (
    <div className="bg-black/25 p-4 rounded-2xl relative">
      <p className="text-xs mb-2 text-white">Select Trumps ? </p>
      <div className="flex text-xl gap-2 z-1">
        <Card
          type={CARD_TYPES.HEART}
          onClick={() => onTrumpsSelected("HEART")}
        />
        <Card
          type={CARD_TYPES.SPADE}
          onClick={() => onTrumpsSelected("SPADE")}
        />
        <Card
          type={CARD_TYPES.DIAMOND}
          onClick={() => onTrumpsSelected("DIAMOND")}
        />
        <Card
          type={CARD_TYPES.CLUBS}
          onClick={() => onTrumpsSelected("CLUBS")}
        />
      </div>
    </div>
  );
};

const PlayerMe = ({
  player,
  isTrumpSelectionNeeded,
  onTrumpsSelected,
  onCardSelected,
}) => {
  const cards = player.cards.slice(0, 8);
  return (
    <div className="absolute bottom-[1rem] left-[2rem]">
      <div className="flex relative">
        {isTrumpSelectionNeeded && (
          <div className="absolute -top-20 left-24">
            <TrumpsSelectionBox
              onTrumpsSelected={(type) => onTrumpsSelected(type)}
            />
          </div>
        )}
        {player.isActive && (
          <div className="absolute left-20">
            <ThinkingBox />
          </div>
        )}
        <img src={playerMe} className="w-30" />
        <div className="flex self-center ml-4 mt-14 gap-1 flex-wrap-reverse w-64">
          {cards.map((card) => {
            return (
              <Card
                key={`${card.type}-${card.valueCode}`}
                card={card}
                onClick={(card) => onCardSelected(card)}
              />
            );
          })}
        </div>
      </div>
      <div className="flex">
        <p className="text-xl text-white flex-1">
          PANCHA <PlayerScore score={player.points} />
          <span className="block text-[10px] text-blue-500">TEAM BLUE</span>
        </p>
      </div>
    </div>
  );
};

const PlayerUp = ({ player }) => {
  return (
    <div className="flex flex-col items-center absolute bottom-[24rem] right-[7rem]">
      <p className="text-white mb-2">
        LOKKA <PlayerScore score={player.points} />
        <span className="block text-[7px] text-blue-500">TEAM BLUE</span>
      </p>
      <div className="relative">
        {player.isActive && (
          <div className="absolute -right-3">
            <ThinkingBox />
          </div>
        )}
        <img src={playerUp} className="w-20" />
      </div>
    </div>
  );
};

const PlayerLeft = ({ player }) => {
  return (
    <div className="flex flex-col absolute bottom-[18rem] left-[1rem]">
      <p className=" text-white">
        TIKIRA <PlayerScore score={player.points} />
        <span className="block text-[7px] text-red-500">TEAM RED</span>
      </p>
      {player.isActive && (
        <div className="absolute top-10 right-6">
          <ThinkingBox />
        </div>
      )}
      <img src={playerLeft} className="w-24" />
    </div>
  );
};

const PlayerRight = ({ player }) => {
  return (
    <div className="flex flex-col items-end absolute bottom-[12rem] right-[1rem]">
      <p className=" text-white">
        CHUTI <PlayerScore score={player.points} />
        <span className="block text-[7px] text-red-500">TEAM RED</span>
      </p>
      {player.isActive && (
        <div className="absolute top-12 left-3">
          <ThinkingBox />
        </div>
      )}
      <img src={playerRight} className="w-28" />
    </div>
  );
};

const delay = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const App = () => {
  const { players, trumps, round, gameStatus } = useGameStore(
    (state) => state.game
  );
  const { callTrumps, startRound, nextMove, closeRound } = useGameStore(
    (state) => state
  );

  if (gameStatus === "NOT_STARTED") {
    console.log("startRound");
    delay().then(() => startRound());
  }
  if (gameStatus === "STARTED") {
    // nextMove();
    delay().then(() => nextMove());
  }
  console.log(gameStatus);

  return (
    <main className="h-dvh bg-slate-900 flex flex-col items-center px-24 font-mono">
      <div
        className="bg-cover bg-center h-screen w-screen md:w-[596px] bg-no-repeat  relative" //md:bg-contain
        style={{ backgroundImage: "url('./bg.jpg')" }}
      >
        {/* <Logo /> */}
        <ScoreBoard />
        <RoundDetails trumps={trumps} />
        <Table cards={round.cards} onClose={() => closeRound()} />
        <PlayerMe
          player={players[0]}
          isTrumpSelectionNeeded={gameStatus === "AWAIT_TRUMPS"}
          onTrumpsSelected={(type) => {
            console.log("Trumps Selected - ", type);
            callTrumps(type);
          }}
          onCardSelected={(card) => {
            nextMove(card);
          }}
        />
        <PlayerUp player={players[2]} />
        <PlayerRight player={players[1]} />
        <PlayerLeft player={players[3]} />
      </div>
    </main>
  );
};
