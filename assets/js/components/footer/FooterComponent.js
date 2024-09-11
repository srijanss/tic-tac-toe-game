import css from "./FooterComponent.css?inline";
import Store from "../../store";

export default class FooterComponent extends HTMLElement {
  constructor() {
    super();
    Store.subscribe(this);
    this.playerWithXMark =
      Store.player1Mark === Store.MARK.X ? Store.player1 : Store.player2;
    this.playerWithOMark =
      Store.player1Mark === Store.MARK.O ? Store.player1 : Store.player2;
    this.XMarkScore =
      Store.player1Mark === Store.MARK.X
        ? Store.player1Score
        : Store.player2Score;
    this.OMarkScore =
      Store.player1Mark === Store.MARK.O
        ? Store.player1Score
        : Store.player2Score;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }
  disconnectedCallback() {
    Store.unsubscribe(this);
  }

  update(result) {
    if (result === Store.RESULT.WIN || result === Store.RESULT.TIE) {
      this.XMarkScore =
        Store.player1Mark === Store.MARK.X
          ? Store.player1Score
          : Store.player2Score;
      this.OMarkScore =
        Store.player1Mark === Store.MARK.O
          ? Store.player1Score
          : Store.player2Score;
      this.render();
    }
  }

  render() {
    this.shadow.innerHTML = `
      <style>${css}</style>
      <footer>
        <section class="score-component x-score" aria-labelledby="x-player" aria-describedby="x-score">
          <h2 id="x-player">X (${this.playerWithXMark})</h2>
          <p id="x-score"">${this.XMarkScore}</p>
        </section>
        <section class="score-component tie-score" aria-labelledby="tie-heading" aria-describedby="tie-score">
          <h2 id="tie-heading">Ties</h2>
          <p id="tie-score">${Store.ties}</p>
        </section>
        <section class="score-component o-score" aria-labelledby="o-player" aria-describedby="o-score">
          <h2 id="o-player">O (${this.playerWithOMark})</h2>
          <p id="o-score">${this.OMarkScore}</p>
        </section>
      </footer>
    `;
  }
}
