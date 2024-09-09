class Store {
  constructor() {
    this._player1 = "P1";
    this._player2 = "P2";
    this._player1Mark = "x";
    this._player2Mark = "o";
    this._player1Score = 0;
    this._player2Score = 0;
    this._ties = 0;
    this._activeMark = "x";
    this._observers = [];
  }

  get player1() {
    return this._player1;
  }

  get player2() {
    return this._player2;
  }

  get player1Mark() {
    return this._player1Mark;
  }

  setPlayer(versus) {
    if (this.activeMark === "x") {
      if (versus === "cpu") {
        this._player1 = "You";
        this._player2 = "CPU";
      } else {
        this._player1 = "P1";
        this._player2 = "P2";
      }
    } else {
      if (versus === "cpu") {
        this._player1 = "CPU";
        this._player2 = "You";
      } else {
        this._player1 = "P2";
        this._player2 = "P1";
      }
    }
    this.showGameBoard();
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

  subscribe(fn) {
    this._observers.push(fn);
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

  switchPlayerTurn() {
    this.activeMark = this.activeMark === "x" ? "o" : "x";
    this.notify();
  }
}

const store = new Store();
export default store;
