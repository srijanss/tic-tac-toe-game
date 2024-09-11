import css from "./HeaderComponent.css?inline";
import Logo from "../../../images/logo.svg";
import RestartIcon from "../../../images/icon-restart.svg";
import Store from "../../store";

export default class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.showLogo = true;
    this.showTurn = this.getAttribute("showTurn") === "true";
    this.showRestartButton = this.getAttribute("showRestartButton") === "true";
    this.extraClass = this.getAttribute("extraClass") || "";
    Store.subscribe(this);
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleEvents();
    this.updateTurnText();
  }
  disconnectedCallback() {
    Store.unsubscribe(this);
  }

  update() {
    const turnWrapper = this.shadow.querySelector(".turn-wrapper");
    turnWrapper.innerHTML = this.renderTurn();
    this.updateTurnText();
  }

  updateTurnText() {
    if (Store.gameStatus !== Store.RESULT.NO_RESULT) return;
    setTimeout(() => {
      const turnMark = this.shadow.querySelector("#turn-mark");
      if (turnMark) {
        turnMark.textContent = `${Store.activeMark}'s Turn`;
      }
    }, 1);
  }

  focusRestartButton() {
    const restartBtn = this.shadow.querySelector(".restart-button");
    if (restartBtn) {
      restartBtn.focus();
    }
  }

  renderLogo() {
    return `
      <div class="img-wrapper">
        <img src="${Logo}" alt="Tic tac toe game logo" width="72" height="32" />
      </div>
    `;
  }

  renderTurn() {
    return `
      <section class="turn-component" aria-label="Player turn indicator" aria-live="polite" role="status">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          class="${Store.activeMark === Store.MARK.X ? "" : "hidden"}"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
            fill="#31C3BD"
            fill-rule="evenodd"
          />
        </svg>
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          class="${Store.activeMark === Store.MARK.O ? "" : "hidden"}"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"
            fill="#F2B137"
          />
        </svg>
        <h1 aria-hidden="true">Turn</h1>
        <span id="turn-mark" class="visually-hidden"></span>
      </section>
    `;
  }

  renderRestartButton() {
    return `
      <div class="btn-wrapper">
        <button class="restart-button" aria-label="Restart" aria-haspopup="dialog" aria-expanded="false" aria-controls="app-modal">
          <img src="${RestartIcon}" alt="Restart icon" />
        </button>
      </div>
    `;
  }

  render() {
    this.shadow.innerHTML = `
      <style>${css}</style>
      <header class="${this.extraClass}">
        ${this.showLogo ? `${this.renderLogo()}` : ""}
        <div class="turn-wrapper">
          ${this.showTurn ? `${this.renderTurn()}` : ""}
        </div>
        ${this.showRestartButton ? `${this.renderRestartButton()}` : ""}
      </header>
    `;
  }

  handleEvents() {
    const restartBtn = this.shadow.querySelector(".restart-button");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        Store.showRestartOptions();
      });
    }
  }
}
