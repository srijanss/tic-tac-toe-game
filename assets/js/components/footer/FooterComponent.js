import css from "./FooterComponent.css?inline";
import Store from "../../store";

export default class FooterComponent extends HTMLElement {
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
      <footer>
        <section class="score-component x-score">
          <h2>${Store.player1Mark} (${Store.player1})</h2>
          <p>${Store.player1Score}</p>
        </section>
        <section class="score-component tie-score">
          <h2>Ties</h2>
          <p>${Store.ties}</p>
        </section>
        <section class="score-component o-score">
          <h2>${Store.player2Mark} (${Store.player2})</h2>
          <p>${Store.player2Score}</p>
        </section>
      </footer>
    `;
  }
}
