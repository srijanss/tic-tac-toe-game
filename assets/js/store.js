import GameLogic from "./gameLogic.js";
class Store {
  constructor() {
    this.RESULT = {
      WIN: "win",
      TIE: "tie",
      NO_RESULT: "no-result",
    };
    this.VERSUS = {
      CPU: "cpu",
      PLAYER: "player",
    };
    this.PLAYER = {
      PLAYER1: "P1",
      PLAYER2: "P2",
      CPU: "CPU",
      YOU: "You",
    };
    this.MARK = {
      X: "x",
      O: "o",
    };
    this._versus = this.VERSUS.PLAYER;
    this._player1 = this.PLAYER.PLAYER1;
    this._player2 = this.PLAYER.PLAYER2;
    this._player1Mark = this.MARK.X;
    this._player2Mark = this.MARK.O;
    this._player1Score = 0;
    this._player2Score = 0;
    this._ties = 0;
    this._activeMark = this.MARK.X;
    this._activePlayer = this.PLAYER.PLAYER1;
    this._gameBoard = Array(9).fill(" ");
    this._winningCombination = [];
    this._winnerMark = null;
    this._gameStatus = this.RESULT.NO_RESULT;
    this._observers = [];
  }

  get gameBoard() {
    return this._gameBoard;
  }

  get winningCombination() {
    return this._winningCombination;
  }

  set winningCombination(combination) {
    this._winningCombination = combination;
  }

  get winnerMark() {
    return this._winnerMark;
  }

  set winnerMark(mark) {
    this._winnerMark = mark;
  }

  get gameStatus() {
    return this._gameStatus;
  }

  set gameStatus(status) {
    this._gameStatus = status;
  }

  get versus() {
    return this._versus;
  }

  set versus(versus) {
    this._versus = versus;
  }

  get player1() {
    return this._player1;
  }

  set player1(player) {
    this._player1 = player;
  }

  get player2() {
    return this._player2;
  }

  set player2(player) {
    this._player2 = player;
  }

  get player1Mark() {
    return this._player1Mark;
  }

  get activePlayer() {
    return this._activePlayer;
  }

  set activePlayer(player) {
    this._activePlayer = player;
  }

  setActivePlayer() {
    return new Promise((resolve, reject) => {
      try {
        if (this.player1Mark === this.MARK.X) {
          if (this._versus === this.VERSUS.CPU) {
            this.activePlayer = this.PLAYER.YOU;
          } else {
            this.activePlayer = this.PLAYER.PLAYER1;
          }
        } else {
          if (this._versus === this.VERSUS.CPU) {
            this.activePlayer = this.PLAYER.CPU;
          } else {
            this.activePlayer = this.PLAYER.PLAYER2;
          }
        }
        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  setPlayer(versus) {
    return new Promise((resolve, reject) => {
      try {
        this._versus = versus;
        if (this._versus === this.VERSUS.CPU) {
          this.player1 = this.PLAYER.YOU;
          this.player2 = this.PLAYER.CPU;
        } else {
          this.player1 = this.PLAYER.PLAYER1;
          this.player2 = this.PLAYER.PLAYER2;
        }
        this.setActivePlayer()
          .then(() => {
            return resolve();
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  set player1Mark(mark) {
    this._player1Mark = mark;
  }

  get player2Mark() {
    return this._player2Mark;
  }

  set player2Mark(mark) {
    this._player2Mark = mark;
  }

  get player1Score() {
    return this._player1Score;
  }

  set player1Score(score) {
    this._player1Score = score;
  }

  get player2Score() {
    return this._player2Score;
  }

  set player2Score(score) {
    this._player2Score = score;
  }

  get ties() {
    return this._ties;
  }

  set ties(score) {
    this._ties = score;
  }

  get activeMark() {
    return this._activeMark;
  }

  set activeMark(mark) {
    this._activeMark = mark;
  }

  subscribe(observer) {
    this._observers.push(observer);
  }

  unsubscribe(observer) {
    this._observers = this._observers.filter((obs) => obs !== observer);
  }

  notify(data) {
    this._observers.forEach((observer) => {
      if (observer.update) {
        observer.update(data);
      }
    });
  }

  showGameBoard() {
    this._observers.forEach((observer) => {
      if (observer.renderGameBoard) {
        observer.renderGameBoard();
      }
    });
  }

  showMenu() {
    this._observers.forEach((observer) => {
      if (observer.renderMenu) {
        observer.renderMenu();
      }
    });
  }

  showGameStatus() {
    this._observers.forEach((observer) => {
      if (observer.showGameStatus) {
        observer.showGameStatus();
      }
    });
  }

  showRestartOptions() {
    this._observers.forEach((observer) => {
      if (observer.showRestartOptions) {
        observer.showRestartOptions();
      }
    });
  }

  switchPlayerTurn() {
    this.activeMark =
      this.activeMark === this.MARK.X ? this.MARK.O : this.MARK.X;
    if (this.versus === this.VERSUS.CPU) {
      this.activePlayer =
        this.activePlayer === this.PLAYER.CPU
          ? this.PLAYER.YOU
          : this.PLAYER.CPU;
    } else {
      this.activePlayer =
        this.activePlayer === this.PLAYER.PLAYER1
          ? this.PLAYER.PLAYER2
          : this.PLAYER.PLAYER1;
    }
  }

  updateGameBoard(index) {
    this._gameBoard[index] = this.activeMark;
    this.gameStatus = this.checkWinOrTie();
    this.switchPlayerTurn();
    if (this.gameStatus !== this.RESULT.NO_RESULT) {
      this.showGameStatus();
    }
    this.notify(this.gameStatus);
  }

  checkWinOrTie() {
    const opponentMark =
      this.activeMark === this.MARK.X ? this.MARK.O : this.MARK.X;
    const gameLogic = new GameLogic(
      this.gameBoard,
      this.activeMark,
      opponentMark
    );
    const result = gameLogic.checkWinner();
    if (result) {
      if (result.winner === this.player1Mark) {
        this.player1Score++;
      } else {
        this.player2Score++;
      }
      this.winningCombination = result.winningCombination;
      this.winnerMark = result.winner;
      return this.RESULT.WIN;
    } else if (gameLogic.checkTie()) {
      this.ties++;
      return this.RESULT.TIE;
    }
    return this.RESULT.NO_RESULT;
  }

  resetGameBoard() {
    this._gameBoard = Array(9).fill(" ");
    this._winningCombination = [];
    this._gameStatus = this.RESULT.NO_RESULT;
  }

  resetScores() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.ties = 0;
  }

  resetPlayers() {
    this.player1 = this.PLAYER.PLAYER1;
    this.player2 = this.PLAYER.PLAYER2;
    this.player1Mark = this.MARK.X;
    this.player2Mark = this.MARK.O;
    this.versus = this.VERSUS.PLAYER;
    this.activeMark = this.MARK.X;
    this.activePlayer = this.PLAYER.PLAYER1;
  }

  restoreActivePlayer() {
    return new Promise((resolve, reject) => {
      try {
        this.setActivePlayer()
          .then(() => {
            this.activeMark = this.MARK.X;
            return resolve();
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  getCpuMove() {
    const opponentMark =
      this.activeMark === this.MARK.X ? this.MARK.O : this.MARK.X;
    const gameLogic = new GameLogic(
      this.gameBoard,
      this.activeMark,
      opponentMark
    );
    return gameLogic.getCpuMove();
  }
}

const store = new Store();
export default store;
