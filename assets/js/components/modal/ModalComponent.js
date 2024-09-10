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

  getGameStatus() {
    if (Store.gameStatus === Store.RESULT.TIE) {
      this.gameStatusText = "Round tied";
      return this.gameStatusText;
    }
    const winningMark = Store.activeMark;
    if (Store.versus === Store.VERSUS.CPU) {
      if (Store.gameStatus === Store.RESULT.WIN) {
        this.gameStatusText =
          Store.player1Mark === winningMark ? "You won!" : "Oh no, you lost...";
      }
    } else {
      this.gameStatusText =
        Store.player1Mark === winningMark ? "Player 1 wins!" : "Player 2 wins!";
    }
    return this.gameStatusText;
  }

  renderWinOrTieStatus() {
    return `
      ${
        Store.gameStatus === Store.RESULT.WIN
          ? `<p>${this.getGameStatus()}</p>`
          : ""
      }
      ${
        Store.gameStatus === Store.RESULT.WIN
          ? `<h2 data-activemark="${Store.activeMark}">Takes the round</h2>`
          : ""
      }
      ${Store.gameStatus === Store.RESULT.TIE ? `<h2>Round tied</h2>` : ""}
      <div class="button-block">
        <button id="quit-btn" class="secondary-button-2">Quit</button>
        <button id="next-round-btn" class="secondary-button-1">Next round</button>
      </div>
    `;
  }

  showGameStatus() {
    this.render();
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
    const modalContent = this.shadow.querySelector("#modal-content");
    modalContent.innerHTML = this.renderRestartOptions();
    this.handleEvents();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <section class="modal">
        <div id="modal-content">
        </div>
      </section>
    `;
  }

  handleEvents() {
    const quitBtn = this.shadow.querySelector("#quit-btn");
    if (quitBtn) {
      quitBtn.addEventListener("click", () => {
        Store.showMenu();
        Store.resetGameBoard();
        Store.resetScores();
        Store.resetPlayers();
      });
    }
    const nextRoundBtn = this.shadow.querySelector("#next-round-btn");
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener("click", () => {
        Store.resetGameBoard();
        Store.showGameBoard();
      });
    }
    const cancelRestartBtn = this.shadow.querySelector("#cancel-restart-btn");
    if (cancelRestartBtn) {
      cancelRestartBtn.addEventListener("click", () => {
        this.shadow.innerHTML = "";
      });
    }
    const restartBtn = this.shadow.querySelector("#restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        Store.showMenu();
        Store.resetGameBoard();
      });
    }
  }
}
