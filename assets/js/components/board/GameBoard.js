import css from "./GameBoard.css?inline";
import Store from "../../store";

export default class GameBoard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleEvents();
  }

  render() {
    this.shadow.innerHTML = `
      <style>${css}</style>
      <div class="game-board">
        <header-component showTurn="true" showRestartButton="true"></header-component> 
        <main>
          <section class="grid">
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
            <button class="grid-cell"></button>
          </section>
        </main>
        <footer-component></footer-component>
      </div>
    `;
  }

  setMarkToGridCell(gridCells) {
    Array.from(gridCells).forEach((cell) => {
      if (!cell.classList.contains("cell-occupied")) {
        cell.dataset.activemark = Store.activeMark;
      }
    });
  }

  handleEvents() {
    const gridCells = this.shadow.querySelectorAll(".grid-cell");
    this.setMarkToGridCell(gridCells);

    Array.from(gridCells).forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (cell.classList.contains("cell-occupied")) {
          return;
        }
        cell.classList.add("cell-occupied");
        Store.switchPlayerTurn();
        setTimeout(() => {
          this.setMarkToGridCell(gridCells);
        }, 1);
      });
    });
  }
}
