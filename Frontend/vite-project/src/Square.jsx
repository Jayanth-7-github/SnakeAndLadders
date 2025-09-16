export default function Square({
  number,
  players,
  isSnake,
  isLadder,
  snakeTo,
  ladderTo,
  className,
}) {
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center text-sm border border-gray-300 relative ${
        className || ""
      }`}
    >
      {number}
      {isSnake && (
        <span
          className="absolute top-0 left-0 text-xs text-red-600"
          title={`Snake to ${snakeTo}`}
        >
          🐍→{snakeTo}
        </span>
      )}
      {isLadder && (
        <span
          className="absolute top-0 right-0 text-xs text-green-700"
          title={`Ladder to ${ladderTo}`}
        >
          🪜→{ladderTo}
        </span>
      )}
      {players.map((p) => {
        const colors = [
          "bg-red-500", // Player 1 (unique)
          "bg-blue-500", // Player 2
          "bg-green-500", // Player 3
          "bg-yellow-400", // Player 4
        ];
        return (
          <span
            key={p}
            className={`absolute bottom-1 right-${
              p * 4
            } w-4 h-4 rounded-full border-2 border-white ${colors[p]}`}
            style={{ display: "inline-block" }}
          />
        );
      })}
    </div>
  );
}
