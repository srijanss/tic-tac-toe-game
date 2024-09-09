import css from "./FooterComponent.css?inline";

export default class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.player1 = "You";
    this.player2 = "Cpu";
    this.player1Mark = "X";
    this.player2Mark = "O";
    this.player1Score = 0;
    this.player2Score = 0;
    this.ties = 0;
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
          <h2>${this.player1Mark} (${this.player1})</h2>
          <p>${this.player1Score}</p>
        </section>
        <section class="score-component tie-score">
          <h2>Ties</h2>
          <p>${this.ties}</p>
        </section>
        <section class="score-component o-score">
          <h2>${this.player2Mark} (${this.player2})</h2>
          <p>${this.player2Score}</p>
        </section>
      </footer>
    `;
  }
}
