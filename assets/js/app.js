import HeaderComponent from "./components/header/HeaderComponent";
import MenuComponent from "./components/menu/MenuComponent";
import GameBoard from "./components/board/GameBoard";

export default class App extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  renderMenu() {
    return `
      <menu-component></menu-component>
      `;
  }

  renderGameBoard() {
    return `
      <game-board></game-board>
    `;
  }
  render() {
    this.shadow.innerHTML = `
      ${this.renderGameBoard()}
    `;
  }
}

customElements.define("tic-tac-toe-app", App);
customElements.define("header-component", HeaderComponent);
customElements.define("menu-component", MenuComponent);
customElements.define("game-board", GameBoard);
