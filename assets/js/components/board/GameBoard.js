import css from "./GameBoard.css?inline";

export default class GameBoard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>${css}</style>
      <div class="game-board">
        <header-component showTurn="true" showRestartButton="true"></header-component> 
        <main>
          <div class="grid">
            <button class="grid-cell" data-activemark="x"></button>
            <button class="grid-cell" data-activemark="o"></button>
            <button class="grid-cell cell-occupied" data-activemark="x"></button>
            <button class="grid-cell cell-occupied" data-activemark="x"></button>
            <button class="grid-cell" data-activemark="x"></button>
            <button class="grid-cell" data-activemark="o"></button>
            <button class="grid-cell" data-activemark="x"></button>
            <button class="grid-cell cell-occupied" data-activemark="o"></button>
            <button class="grid-cell" data-activemark="o"></button>
          </div>
        </main>
        <footer-component></footer-component>
      </div>
    `;
  }
}
