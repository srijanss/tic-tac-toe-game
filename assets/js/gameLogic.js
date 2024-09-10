export default class GameLogic {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
  }

  checkWinner() {
    let winner = null;
    let winningCombination = null;
    this.winningCombinations.forEach((combination, index) => {
      const [a, b, c] = combination;
      if (
        this.gameBoard[a] !== " " &&
        this.gameBoard[a] === this.gameBoard[b] &&
        this.gameBoard[a] === this.gameBoard[c]
      ) {
        winner = this.gameBoard[a];
        winningCombination = this.winningCombinations[index];
      }
    });
    if (winner) {
      return { winner, winningCombination };
    }
    return null;
  }

  checkTie() {
    return this.gameBoard.every((cell) => cell !== " ");
  }

  cpuRandomMove(emptyCells) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  findEmptyCell() {
    const emptyCells = this.gameBoard.reduce((acc, cell, index) => {
      if (cell === " ") {
        acc.push(index);
      }
      return acc;
    }, []);
    return this.cpuRandomMove(emptyCells);
  }

  getCpuMove() {
    const emptyCell = this.findEmptyCell();
    return emptyCell;
  }
}
