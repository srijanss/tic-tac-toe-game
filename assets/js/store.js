import GameLogic from "./gameLogic.js";
class Store {
  constructor() {
    this.PAGE = {
      MENU: "menu",
      BOARD: "board",
    };
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
    this._versus = null;
    this._player1 = null;
    this._player2 = null;
    this._player1Mark = null;
    this._player2Mark = null;
    this._player1Score = 0;
    this._player2Score = 0;
    this._ties = 0;
    this._activeMark = null;
    this._activePlayer = null;
    this._gameBoard = null;
    this._winningCombination = null;
    this._winnerMark = null;
    this._gameStatus = null;
    this._activePage = null;
    this._observers = [];
    this.init();
  }

  getFromSessionStorage() {
    return sessionStorage.getItem("store")
      ? JSON.parse(sessionStorage.getItem("store"))
      : {};
  }

  setToSessionStorage(data) {
    sessionStorage.setItem("store", JSON.stringify(data));
  }

  init() {
    let data = this.getFromSessionStorage();
    this.versus = data.versus || this.VERSUS.CPU;
    this.player1 = data.player1 || this.PLAYER.YOU;
    this.player2 = data.player2 || this.PLAYER.CPU;
    this.player1Mark = data.player1Mark || this.MARK.X;
    this.player2Mark = data.player2Mark || this.MARK.O;
    this.player1Score = data.player1Score || 0;
    this.player2Score = data.player2Score || 0;
    this.ties = data.ties || 0;
    this.activeMark = data.activeMark || this.MARK.X;
    this.activePlayer = data.activePlayer || this.PLAYER.YOU;
    this.gameBoard = data.gameBoard || Array(9).fill(" ");
    this.winningCombination = data.winningCombination || [];
    this.winnerMark = data.winnerMark || null;
    this.gameStatus = data.gameStatus || this.RESULT.NO_RESULT;
    this.activePage = data.activePage || this.PAGE.BOARD;
    data = {
      versus: this.versus,
      player1: this.player1,
      player2: this.player2,
      player1Mark: this.player1Mark,
      player2Mark: this.player2Mark,
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      ties: this.ties,
      activeMark: this.activeMark,
      activePlayer: this.activePlayer,
      gameBoard: this.gameBoard,
      winningCombination: this.winningCombination,
      winnerMark: this.winnerMark,
      gameStatus: this.gameStatus,
      activePage: this.activePage,
    };
    this.setToSessionStorage(data);
  }

  updateData(obj) {
    const data = this.getFromSessionStorage();
    Object.keys(obj).forEach((key) => {
      data[key] = obj[key];
    });
    this.setToSessionStorage(data);
  }

  get activePage() {
    return this._activePage;
  }

  set activePage(page) {
    this._activePage = page;
  }

  get gameBoard() {
    return this._gameBoard;
  }

  set gameBoard(board) {
    this._gameBoard = board;
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

  get activePlayer() {
    return this._activePlayer;
  }

  set activePlayer(player) {
    this._activePlayer = player;
  }

  get player1Mark() {
    return this._player1Mark;
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
    this.activePage = this.PAGE.BOARD;
    this.updateData({ activePage: this.activePage });
    this._observers.forEach((observer) => {
      if (observer.renderGameBoard) {
        observer.renderGameBoard();
      }
    });
  }

  showMenu() {
    this.activePage = this.PAGE.MENU;
    this.updateData({ activePage: this.activePage });
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
        this.updateData({ activePlayer: this.activePlayer });
        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  setPlayer(versus) {
    return new Promise((resolve, reject) => {
      try {
        this.versus = versus;
        if (this.versus === this.VERSUS.CPU) {
          this.player1 = this.PLAYER.YOU;
          this.player2 = this.PLAYER.CPU;
        } else {
          this.player1 = this.PLAYER.PLAYER1;
          this.player2 = this.PLAYER.PLAYER2;
        }
        this.updateData({
          versus: this.versus,
          player1: this.player1,
          player2: this.player2,
        });
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
    this.updateData({
      activePlayer: this.activePlayer,
      activeMark: this.activeMark,
    });
  }

  updateGameBoard(index) {
    this.gameBoard[index] = this.activeMark;
    this.gameStatus = this.checkWinOrTie();
    this.switchPlayerTurn();
    if (this.gameStatus !== this.RESULT.NO_RESULT) {
      setTimeout(() => {
        this.showGameStatus();
      }, 500);
    }
    this.updateData({
      gameBoard: this.gameBoard,
      gameStatus: this.gameStatus,
    });
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
      this.updateData({
        player1Score: this.player1Score,
        player2Score: this.player2Score,
        winningCombination: this.winningCombination,
        winnerMark: this.winnerMark,
      });
      return this.RESULT.WIN;
    } else if (gameLogic.checkTie()) {
      this.ties++;
      this.updateData({ ties: this.ties });
      return this.RESULT.TIE;
    }
    return this.RESULT.NO_RESULT;
  }

  resetGameBoard() {
    this.gameBoard = Array(9).fill(" ");
    this.winningCombination = [];
    this.gameStatus = this.RESULT.NO_RESULT;
    this.updateData({
      gameBoard: this.gameBoard,
      winningCombination: this.winningCombination,
      gameStatus: this.gameStatus,
    });
  }

  resetScores() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.ties = 0;
    this.updateData({
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      ties: this.ties,
    });
  }

  resetPlayers() {
    this.player1 = this.PLAYER.PLAYER1;
    this.player2 = this.PLAYER.PLAYER2;
    this.player1Mark = this.MARK.X;
    this.player2Mark = this.MARK.O;
    this.versus = this.VERSUS.PLAYER;
    this.activeMark = this.MARK.X;
    this.activePlayer = this.PLAYER.PLAYER1;
    this.updateData({
      player1: this.player1,
      player2: this.player2,
      player1Mark: this.player1Mark,
      player2Mark: this.player2Mark,
      versus: this.versus,
      activeMark: this.activeMark,
      activePlayer: this.activePlayer,
    });
  }

  restoreActivePlayer() {
    return new Promise((resolve, reject) => {
      try {
        this.setActivePlayer()
          .then(() => {
            this.activeMark = this.MARK.X;
            this.updateData({ activeMark: this.activeMark });
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

  focusRestartButton() {
    this._observers.forEach((observer) => {
      if (observer.focusRestartButton) {
        observer.focusRestartButton();
      }
    });
  }

  focusGrid() {
    this._observers.forEach((observer) => {
      if (observer.focusGrid) {
        observer.focusGrid();
      }
    });
  }

  focusMenu() {
    this._observers.forEach((observer) => {
      if (observer.focusMenu) {
        observer.focusMenu();
      }
    });
  }
}

const store = new Store();
export default store;
