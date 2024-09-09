import css from "./FooterComponent.css?inline";

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
          <h2>X (You)</h2>
          <p>14</p>
        </section>
        <section class="score-component tie-score">
          <h2>Ties</h2>
          <p>32</p>
        </section>
        <section class="score-component o-score">
          <h2>O (Cpu)</h2>
          <p>11</p>
        </section>
      </footer>
    `;
  }
}
