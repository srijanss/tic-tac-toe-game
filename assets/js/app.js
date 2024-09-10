import HeaderComponent from "./components/header/HeaderComponent";
import MenuComponent from "./components/menu/MenuComponent";
import GameBoard from "./components/board/GameBoard";
import FooterComponent from "./components/footer/FooterComponent";
import ModalComponent from "./components/modal/ModalComponent";
import Store from "./store";

export default class App extends HTMLElement {
  constructor() {
    super();
    Store.subscribe(this);
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  renderMenu() {
    this.shadow.innerHTML = `
      <menu-component></menu-component>
      <modal-component></modal-component>
      `;
  }

  renderGameBoard() {
    this.shadow.innerHTML = `
      <game-board></game-board>
      <modal-component></modal-component>
    `;
  }
  render() {
    this.renderMenu();
  }
}

customElements.define("tic-tac-toe-app", App);
customElements.define("header-component", HeaderComponent);
customElements.define("menu-component", MenuComponent);
customElements.define("game-board", GameBoard);
customElements.define("footer-component", FooterComponent);
customElements.define("modal-component", ModalComponent);
