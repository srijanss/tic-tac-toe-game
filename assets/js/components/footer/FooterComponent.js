import css from "./FooterComponent.css?inline";
import Store from "../../store";

export default class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.playerWithXMark =
      Store.player1Mark === "x" ? Store.player1 : Store.player2;
    this.playerWithOMark =
      Store.player1Mark === "o" ? Store.player1 : Store.player2;
    this.XMarkScore =
      Store.player1Mark === "x" ? Store.player1Score : Store.player2Score;
    this.OMarkScore =
      Store.player1Mark === "o" ? Store.player1Score : Store.player2Score;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>${css}</style>
      <footer>
        <section class="score-component x-score">
          <h2>X (${this.playerWithXMark})</h2>
          <p>${this.XMarkScore}</p>
        </section>
        <section class="score-component tie-score">
          <h2>Ties</h2>
          <p>${Store.ties}</p>
        </section>
        <section class="score-component o-score">
          <h2>O (${this.playerWithOMark})</h2>
          <p>${this.OMarkScore}</p>
        </section>
      </footer>
    `;
  }
}
