import css from "./GameBoard.css?inline";
import Store from "../../store";

export default class GameBoard extends HTMLElement {
  constructor() {
    super();
    Store.subscribe(this);
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleEvents();
    this.makeCpuMove();
  }

  disconnectedCallback() {
    Store.unsubscribe(this);
  }

  update() {
    this.reRenderCells();
  }

  reRenderCells() {
    const grid = this.shadow.querySelector(".grid");
    grid.innerHTML = this.renderCells();
    this.handleEvents();
    this.makeCpuMove();
  }

  renderCells() {
    return `
      ${Store.gameBoard
        .map((cell, index) => {
          return `<button class="grid-cell ${
            cell !== " " ? "cell-occupied" : ""
          } ${
            Store.winningCombination.includes(index) ? "winning-cell" : ""
          }" data-activemark=${
            cell === " " ? Store.activeMark : cell
          } data-index="${index}"></button>`;
        })
        .join("")}
    `;
  }

  render() {
    this.shadow.innerHTML = `
      <style>${css}</style>
      <div class="game-board">
        <header-component showTurn="true" showRestartButton="true"></header-component> 
        <main>
          <section class="grid">
            ${this.renderCells()}
          </section>
        </main>
        <footer-component></footer-component>
      </div>
    `;
  }

  handleEvents() {
    const gridCells = this.shadow.querySelectorAll(".grid-cell");

    Array.from(gridCells).forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (Store.activePlayer === Store.PLAYER.CPU) return;
        if (Store.gameStatus !== Store.RESULT.NO_RESULT) return;
        if (cell.classList.contains("cell-occupied")) {
          return;
        }
        cell.classList.add("cell-occupied");
        Store.updateGameBoard(Number(cell.dataset.index));
      });
    });
  }

  makeCpuMove() {
    if (Store.activePlayer === Store.PLAYER.CPU) {
      if (Store.gameStatus !== Store.RESULT.NO_RESULT) return;
      setTimeout(() => {
        const cpuMove = Store.getCpuMove();
        const cell = this.shadow.querySelector(
          `button[data-index="${cpuMove}"]`
        );
        if (cell) {
          cell.classList.add("cell-occupied");
          Store.updateGameBoard(cpuMove);
        }
      }, 300);
    }
  }
}
