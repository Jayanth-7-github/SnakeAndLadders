import Square from "./Square";
const BOARD_SIZE = 100;

// These should match the backend
// Snakes and ladders starting from the second row (11-20)
const SNAKES = {
  12: 3,
  15: 7,
  20: 5,
  37: 17,
  45: 27,
  50: 36,
  67: 42,
  70: 23,
  98: 65,
  92: 61,
  83: 53,
  86:56,
};
const LADDERS = {
  13: 33,
  19: 39,
  34: 63,
  48: 77,
  43: 75,
  51: 65,
  8: 11,
  64: 86,
  78: 89,
  72: 94,
};

export default function GameBoard({ positions }) {
  const squares = [];
  for (let i = BOARD_SIZE; i >= 1; i--) {
    // Alternate colors for a colorful board
    const isEven =
      Math.floor((BOARD_SIZE - i) / 10) % 2 === 0 ? i % 2 === 0 : i % 2 !== 0;
    // Use a more vibrant and distinct palette for the board
    const bgColor = isEven ? "bg-green-300" : "bg-orange-200";
    const isSnake = Object.keys(SNAKES).map(Number).includes(i);
    const isLadder = Object.keys(LADDERS).map(Number).includes(i);
    squares.push(
      <Square
        key={i}
        number={i}
        players={positions
          .map((pos, idx) => (pos === i ? idx : null))
          .filter((x) => x !== null)}
        className={bgColor + " border border-gray-300"}
        isSnake={isSnake}
        isLadder={isLadder}
        snakeTo={isSnake ? SNAKES[i] : null}
        ladderTo={isLadder ? LADDERS[i] : null}
      />
    );
  }
  return (
    <div className="grid grid-cols-10 gap-0 border-4 border-gray-600 rounded-lg overflow-hidden shadow-lg">
      {squares}
    </div>
  );
}
