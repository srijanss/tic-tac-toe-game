import css from "./MenuComponent.css?inline";

export default class MenuComponent extends HTMLElement {
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
      <div class="menu-component">
        <header-component extraClass="jc-center"></header-component>
        <main>
          <section class="mark-select-component">
            <fieldset>
              <legend>Pick player 1's mark</legend>
              <ul>
                <li>
                  <label for="x-mark" aria-label="Mark X">
                    <input type="radio" name="mark" id="x-mark" value="x" checked />
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
                        fill="#31C3BD"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </label>
                </li>
                <li>
                  <label for="o-mark" aria-label="Mark O">
                    <input type="radio" name="mark" id="o-mark" value="o" />
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"
                        fill="#F2B137"
                      />
                    </svg>
                  </label>
                </li>
              </ul>
            </fieldset>
            <p>Remember: X goes first</p>
          </section>
          <div class="button-block">
            <button class="button-1">New Game (vs CPU)</button>
            <button class="button-2">New Game (vs player)</button>
          </div>
        </main>
      </div>
    `;
  }
}
