export default class GameLogic {
  constructor(gameBoard, activeMark, opponentMark) {
    this._gameBoard = gameBoard;
    this._activeMark = activeMark;
    this._opponentMark = opponentMark;
    this.MODE = {
      EASY: "easy",
      HARD: "hard",
      EXPERT: "expert",
    };
    this.difficulty = this.MODE.HARD;
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

  get gameBoard() {
    return this._gameBoard;
  }

  set gameBoard(board) {
    this._gameBoard = board;
  }

  get activeMark() {
    return this._activeMark;
  }

  get opponentMark() {
    return this._opponentMark;
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

  getWiningOrBlockingMove(emptyCells, marker) {
    const tempBoard = [...this.gameBoard];
    for (const cell of emptyCells) {
      this.gameBoard[cell] = marker;
      const winner = this.checkWinner();
      if (winner) {
        return cell;
      }
      this.gameBoard[cell] = " ";
    }
    this.gameBoard = [...tempBoard];
    return null;
  }

  cpuHardMove(emptyCells) {
    const winningMove = this.getWiningOrBlockingMove(
      emptyCells,
      this.activeMark
    );
    if (winningMove !== null) {
      return winningMove;
    }
    const blockingMove = this.getWiningOrBlockingMove(
      emptyCells,
      this.opponentMark
    );
    if (blockingMove !== null) {
      return blockingMove;
    }
    return null;
  }

  getWinCombinationCount(marker) {
    let count = 0;
    this.winningCombinations.forEach((combination) => {
      const [a, b, c] = combination;
      const markerMatch = [a, b, c].filter(
        (cell) => this.gameBoard[cell] === marker
      );
      if (markerMatch.length !== 2) return;
      count++;
    });
    return count;
  }

  findFork(emptyCells, marker) {
    for (const cell of emptyCells) {
      this.gameBoard[cell] = marker;
      const winCount = this.getWinCombinationCount(marker);
      this.gameBoard[cell] = " ";
      if (winCount >= 2) {
        return cell;
      }
    }
    return null;
  }

  getForkMove(emptyCells) {
    const forkOpponentsMove = this.findFork(emptyCells, this.opponentMark);
    if (forkOpponentsMove !== null) {
      return forkOpponentsMove;
    }
    const forkMove = this.findFork(emptyCells, this.activeMark);
    if (forkMove !== null) {
      return forkMove;
    }
    return null;
  }

  cpuExpertMove(emptyCells) {
    // If opponent starts in the center, take a corner
    if (emptyCells.length === 8 && this.gameBoard[4] === this.opponentMark) {
      return this.cpuRandomMove([0, 2, 6, 8]);
    }

    // If there are 6 or less empty cells, play hard
    if (emptyCells.length <= 6) {
      const hard_move = this.cpuHardMove(emptyCells);
      if (hard_move !== null) {
        return hard_move;
      }
    }

    // If center is empty, take it
    if (this.gameBoard[4] === " ") {
      return 4;
    }

    // find a fork
    const forkMove = this.getForkMove(emptyCells);
    if (forkMove) {
      return forkMove;
    }

    return null;
  }

  findEmptyCell() {
    const emptyCells = this.gameBoard.reduce((acc, cell, index) => {
      if (cell === " ") {
        acc.push(index);
      }
      return acc;
    }, []);
    if (this.difficulty == this.MODE.EXPERT) {
      const expert_move = this.cpuExpertMove(emptyCells);
      if (expert_move !== null) {
        return expert_move;
      }
    } else if (this.difficulty == this.MODE.HARD) {
      const hard_move = this.cpuHardMove(emptyCells);
      if (hard_move !== null) {
        return hard_move;
      }
    }
    return this.cpuRandomMove(emptyCells);
  }

  getCpuMove() {
    const emptyCell = this.findEmptyCell();
    return emptyCell;
  }
}
