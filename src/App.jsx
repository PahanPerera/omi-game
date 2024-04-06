import { useGameStore } from "./hooks/useGameStore";
import trophyIcon from "./trophy.png";
import diamondIcon from "./diamond.png";
import logo from "./Logo.svg";
import playerMe from "./PMe.svg";
import playerUp from "./PUp.svg";
import playerLeft from "./PLeft.svg";
import playerRight from "./PRight.svg";
import { useEffect } from "react";

const CARD_TYPES = {
  HEART: "♥",
  DIAMOND: "♦",
  SPADE: "♠",
  CLUBS: "♣",
};

const Card = ({ type, valueCode, count, idx }) => {
  const isRed = type === CARD_TYPES.HEART || type === CARD_TYPES.DIAMOND;
  const styles = isRed ? `text-red-500` : `text-black`;
  const cardW = () => {
    const mid = Math.floor(count / 2);
    if (idx < mid) return (mid - idx) * 8;
    if (idx > mid) return (idx - mid) * -8;
    if (idx === mid) return 0;
  };
  return (
    <div
      className={`h-14 w-10 bg-white text-center rounded px-1 flex flex-col align-center justify-center  ${styles} drop-shadow-2xl border border-gray-300`}
      style={
        {
          // transform: `translateX(${cardW()}px)`,
        }
      }
    >
      <span className="font-bold block h-4">{valueCode}</span>
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
    <div className="mx-10 my-4 bg-black/50 px-2 py-2 rounded-full">
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
          10 / 10
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
  const isRed =
    CARD_TYPES[trumps] === CARD_TYPES.HEART || trumps === CARD_TYPES.DIAMOND;
  const styles = isRed ? `text-red-500` : `text-black`;
  if (!trumps) return <></>;
  return (
    <div className="flex mx-10 items-center gap-2 py-2 bg-black/50 rounded-full px-6">
      <p className="text-xs text-white ">Round - 1 {">"} </p>
      <div className="flex bg-black/50 self-center px-2 py-0 rounded-full items-center">
        <img src={diamondIcon} className="h-5" />
        <span className="text-[7px] ml-1 text-white">TRUMPS {">"}</span>
        <span className={`${styles} text-xl mb-2 h-5 ml-2`}>
          {CARD_TYPES[trumps]}
        </span>
      </div>
    </div>
  );
};

const Table = ({ cards }) => {
  return (
    <div className="w-24 h-24 absolute bottom-[18rem] left-[32%] -skew-x-[16deg]">
      <div className="relative w-24 h-24 flex">
        {cards[0] && (
          <div className="absolute -bottom-6 left-0">
            <Card
              type={CARD_TYPES[cards[0].type]}
              valueCode={cards[0].valueCode}
            />
          </div>
        )}
        {cards[1] && (
          <div className="absolute -bottom-2 -right-8">
            <Card
              type={CARD_TYPES[cards[1].type]}
              valueCode={cards[1].valueCode}
            />
          </div>
        )}
        {cards[2] && (
          <div className="absolute -top-6 right-0">
            <Card
              type={CARD_TYPES[cards[2].type]}
              valueCode={cards[2].valueCode}
            />
          </div>
        )}
        {cards[3] && (
          <div className="absolute -top-2 -left-4">
            <Card
              type={CARD_TYPES[cards[3].type]}
              valueCode={cards[3].valueCode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="my-4 flex flex-col align-center">
      <img src={logo} className="h-36" />
    </div>
  );
};

const PlayerScore = ({ score }) => {
  return (
    <p className="px-2 py-1 bg-black/50 rounded-full text-white text-sm inline-block w-18 text-center">
      <img src={trophyIcon} className="inline mx-2" />
      <span className="mr-1">{score}</span>
    </p>
  );
};

const PlayerMe = ({ player, trumps }) => {
  const cards = player.cards.slice(0, 8);
  return (
    <div className="absolute bottom-[2rem] left-[2rem]">
      <div className="flex">
        {/* {player.isActive && (
          <div className="absolute -top-2 left-20">
            <ThinkingBox />
          </div>
        )} */}
        <img src={playerMe} className="w-30" />
        <div className="flex self-center ml-4 mt-14 gap-1 flex-wrap-reverse w-64">
          {cards.map((card, idx) => {
            return (
              <Card
                type={CARD_TYPES[card.type]}
                valueCode={card.valueCode}
                idx={idx}
                count={cards.length}
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
    <div className="flex flex-col items-center absolute bottom-[26rem] right-[6rem]">
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
    <div className="flex flex-col absolute bottom-[20rem] left-[1rem]">
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

export const App = () => {
  const { players, trumps, round } = useGameStore((state) => state.game);
  const { callTrumps, nextMove } = useGameStore((state) => state);

  if (!trumps) {
    callTrumps();
  }

  useEffect(() => {
    setInterval(() => {
      // nextMove();
    }, 1000);
  }, []);

  return (
    <main className="h-dvh bg-slate-900 flex flex-col items-center px-24 font-mono">
      <div
        className="bg-cover bg-center h-screen w-screen md:w-[596px] bg-no-repeat  relative" //md:bg-contain
        style={{ backgroundImage: "url('./bg.jpg')" }}
      >
        <Logo />
        <ScoreBoard />
        <RoundDetails trumps={trumps} />
        <PlayerMe player={players[0]} trumps={trumps} />
        <PlayerUp player={players[2]} />
        <PlayerRight player={players[1]} />
        <PlayerLeft player={players[3]} />
        <Table cards={round.cards} />
        {/* <div className="flex gap-2 text-sm">
          <p>{trumps}</p>
          <button
            className="px-4 py-2 text-white border rounded-full"
            onClick={() => callTrumps()}
          >
            Trumps
          </button>
          <button
            className="px-4 py-2 text-white border rounded-full"
            onClick={() => nextMove()}
          >
            Next
          </button>
        </div> */}
      </div>
    </main>
  );
};
