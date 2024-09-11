import css from "./GameBoard.css?inline";
import Store from "../../store";

export default class GameBoard extends HTMLElement {
  constructor() {
    super();
    this.keyboardAccess = false;
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
    if (this.keyboardAccess) {
      this.focusGrid();
    }
  }

  focusGrid() {
    const firstCell = this.shadow.querySelector("button[data-index='0']");
    if (firstCell && Store.activePlayer !== Store.PLAYER.CPU) {
      firstCell.focus();
    }
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
          } data-index="${index}" role="gridcell" aria-label="Cell ${index}" aria-describedby="${
            cell === " " ? "instructions" : ""
          }">
            <span id="cell-status-${index}" class="visually-hidden">
              ${
                cell !== " "
                  ? "Cell " + index + ", filled with mark " + cell
                  : "Cell " + index + ", empty"
              }
            </span>
          </button>`;
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
          <section class="grid" aria-label="Tic tac toe grid" role="grid">
            ${this.renderCells()}
          </section>
          <span class="visually-hidden" id="instructions">Press Space or Enter to place your mark</span>
        </main>
        <footer-component></footer-component>
      </div>
    `;
  }

  handleGridCellEvents(cell) {
    if (Store.activePlayer === Store.PLAYER.CPU) return;
    if (Store.gameStatus !== Store.RESULT.NO_RESULT) return;
    if (cell.classList.contains("cell-occupied")) {
      return;
    }
    cell.classList.add("cell-occupied");
    Store.updateGameBoard(Number(cell.dataset.index));
  }

  handleEvents() {
    const gridCells = this.shadow.querySelectorAll(".grid-cell");

    Array.from(gridCells).forEach((cell) => {
      cell.addEventListener("click", (e) => {
        e.preventDefault();
        this.keyboardAccess = false;
        this.handleGridCellEvents(cell);
      });
      cell.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          this.keyboardAccess = true;
          this.handleGridCellEvents(cell);
        }
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
