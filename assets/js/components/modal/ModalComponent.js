import css from "./ModalComponent.css?inline";
import Store from "../../store.js";

export default class ModalComponent extends HTMLElement {
  constructor() {
    super();
    Store.subscribe(this);
    this.gameStatusText = "";
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
  }

  disconnectedCallback() {
    Store.unsubscribe(this);
  }

  getGameStatus() {
    if (Store.gameStatus === Store.RESULT.TIE) {
      return "";
    }
    if (Store.versus === Store.VERSUS.CPU) {
      if (Store.gameStatus === Store.RESULT.WIN) {
        this.gameStatusText =
          Store.player1Mark === Store.winnerMark
            ? "You won!"
            : "Oh no, you lost...";
      }
    } else {
      this.gameStatusText =
        Store.player1Mark === Store.winnerMark
          ? "Player 1 wins!"
          : "Player 2 wins!";
    }
    return this.gameStatusText;
  }

  getRoundStatus() {
    if (Store.gameStatus === Store.RESULT.TIE) {
      this.gameStatusText = "Round tied";
      return this.gameStatusText;
    }
    return `${Store.winnerMark} Takes the round`;
  }

  renderWinOrTieStatus() {
    const gameStatus = this.getGameStatus();
    const roundStatus = this.getRoundStatus();
    return `
      <span id="game-status" class="visually-hidden">${gameStatus} ${roundStatus}, ${
      Store.player1
    } scored ${Store.player1Score}, Ties ${Store.ties}, ${
      Store.player2
    } scored ${Store.player2Score}</span>
      ${
        Store.gameStatus === Store.RESULT.WIN
          ? `<p aria-hidden="true">${gameStatus}</p>`
          : ""
      }
      ${
        Store.gameStatus === Store.RESULT.WIN
          ? `<h2 aria-hidden="true" data-winnermark="${Store.winnerMark}">Takes the round</h2>`
          : ""
      }
      ${
        Store.gameStatus === Store.RESULT.TIE
          ? `<h2 aria-hidden="true">${roundStatus}</h2>`
          : ""
      }
      <div class="button-block">
        <button id="quit-btn" class="secondary-button-2">Quit</button>
        <button id="next-round-btn" class="secondary-button-1">Next round</button>
      </div>
    `;
  }

  showGameStatus() {
    this.render();
    const appModal = this.shadow.querySelector("#app-modal");
    appModal.focus();
    const modalContent = this.shadow.querySelector("#modal-content");
    modalContent.innerHTML = this.renderWinOrTieStatus();
    this.handleEvents();
  }

  renderRestartOptions() {
    return `
      ${`<h2>Restart game?</h2>`}
      <div class="button-block">
        <button id="cancel-restart-btn" class="secondary-button-2">No, cancel</button>
        <button id="restart-btn" class="secondary-button-1">Yes, Restart</button>
      </div>
    `;
  }

  showRestartOptions() {
    this.render();
    const appModal = this.shadow.querySelector("#app-modal");
    appModal.focus();
    const modalContent = this.shadow.querySelector("#modal-content");
    modalContent.innerHTML = this.renderRestartOptions();
    this.handleEvents();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <section id="app-modal" class="modal" role="dialog" aria-modal="true" aria-label="Tic tac toe app modal" aria-describedby="game-status"  tabindex="-1">
        <div id="modal-content">
        </div>
      </section>
    `;
  }

  setFocusTrap() {
    const focusableElements = this.shadow.querySelectorAll("button");
    Array.from(focusableElements).forEach((element) => {
      element.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (e.currentTarget === focusableElements[0]) {
              e.preventDefault();
              focusableElements[focusableElements.length - 1].focus();
            }
          } else {
            if (
              e.currentTarget ===
              focusableElements[focusableElements.length - 1]
            ) {
              e.preventDefault();
              focusableElements[0].focus();
            }
          }
        }
      });
    });
  }

  handleRestartBtnEvents(eventType) {
    Store.resetGameBoard();
    Store.restoreActivePlayer().then(() => {
      Store.showGameBoard();
      if (eventType === "keydown") {
        setTimeout(() => {
          Store.focusRestartButton();
        }, 1);
      }
    });
  }

  handleNextRoundBtnEvents(eventType) {
    Store.resetGameBoard();
    Store.restoreActivePlayer().then(() => {
      Store.showGameBoard();
      if (eventType === "keydown") {
        setTimeout(() => {
          Store.focusGrid();
        }, 1);
      }
    });
  }

  handleQuitBtnEvents(eventType) {
    Store.showMenu();
    Store.resetGameBoard();
    Store.resetScores();
    Store.resetPlayers();
    if (eventType === "keydown") {
      setTimeout(() => {
        Store.focusMenu();
      }, 1);
    }
  }

  handleEvents() {
    this.setFocusTrap();
    const quitBtn = this.shadow.querySelector("#quit-btn");
    if (quitBtn) {
      quitBtn.addEventListener("click", (e) => {
        this.handleQuitBtnEvents(e.type);
      });
      quitBtn.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          this.handleQuitBtnEvents(e.type);
        }
      });
    }
    const nextRoundBtn = this.shadow.querySelector("#next-round-btn");
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener("click", (e) => {
        this.handleNextRoundBtnEvents(e.type);
      });
      nextRoundBtn.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          this.handleNextRoundBtnEvents(e.type);
        }
      });
    }
    const cancelRestartBtn = this.shadow.querySelector("#cancel-restart-btn");
    if (cancelRestartBtn) {
      cancelRestartBtn.addEventListener("click", () => {
        this.shadow.innerHTML = "";
        Store.focusRestartButton();
      });
    }
    const restartBtn = this.shadow.querySelector("#restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", (e) => {
        this.handleRestartBtnEvents(e.type);
      });
      restartBtn.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          this.handleRestartBtnEvents(e.type);
        }
      });
    }
  }
}
