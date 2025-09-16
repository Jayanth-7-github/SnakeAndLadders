import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GameBoard from "./GameBoard";
import Dice from "./Dice";
import { newGame, roll } from "./api";

export default function App() {
  const [game, setGame] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);

  async function startNewGame() {
    const g = await newGame();
    setGame(g);
    setLastRoll(null);
  }

  useEffect(() => {
    startNewGame();
  }, []);

  if (!game) return <div className="text-center mt-10">Loading…</div>;

  const current = game.current_turn;
  const winner = game.winner;

  async function handleRoll() {
    const { dice, state } = await roll(game.id);
    setLastRoll(dice);
    setGame(state);
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-bold text-black"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Snakes & Ladders
      </motion.h1>
      <motion.button
        onClick={startNewGame}
        className="mb-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        New Game
      </motion.button>
      {winner !== null && (
        <motion.div
          className="text-green-600 font-semibold text-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Player {winner + 1} wins!
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <GameBoard positions={game.players} />
      </motion.div>
      <div className="flex flex-row gap-4">
        {[0, 1, 2, 3].map((player) => {
          const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-400",
          ];
          return (
            <div key={player} className="flex flex-col items-center">
              <Dice
                onRoll={handleRoll}
                disabled={winner !== null || current !== player}
              >
                Player {player + 1}
              </Dice>
              <div
                className={`mt-2 w-6 h-6 rounded-full border-2 border-gray-300 ${colors[player]}`}
              ></div>
            </div>
          );
        })}
      </div>
      {lastRoll && (
        <p className="mt-2 text-2xl font-bold text-purple-600 drop-shadow">
          You rolled a{" "}
          <span className="text-orange-500 animate-bounce">{lastRoll}</span>
        </p>
      )}
    </motion.div>
  );
}
