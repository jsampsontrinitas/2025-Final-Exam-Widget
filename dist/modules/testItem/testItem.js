import Icons from "../../Icons";
import { miniMarkdown, getTestStatusIcon } from "../../utils";
import sheet from './styles.css' with { type: 'css' };
export default class TestItem extends HTMLElement {
    #id;
    #name;
    #about;
    #fn;
    #status;
    #suite;
    #partialResults;
    constructor({ id, name, about, status, fn, suite, }) {
        super();
        this.#id = id;
        this.#name = name;
        this.#about = about;
        this.#fn = fn;
        this.#suite = suite;
        this.#status = status;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <div class="test-item">
                ${Icons.pending.outerHTML}
                <span class="test-name" data-test-id="${this.#id}">
                    ${miniMarkdown(this.#name)}
                </span>
                <span class="partial-results"></span>
            </div>
        `;
        this.status = 'pending';
        this.run();
    }
    async run() {
        try {
            const results = await this.#fn();
            if (typeof results === "boolean") {
                this.status = results ? 'passed' : 'failed';
            }
            else if (results && typeof results === "object" && !Array.isArray(results)) {
                this.partialResults = results;
                if (results.completed === results.total) {
                    this.status = 'passed';
                }
                else if (results.completed === 0) {
                    this.status = 'failed';
                }
                else {
                    this.status = 'partial';
                }
            }
        }
        catch (e) {
            this.status = 'failed';
        }
    }
    get id() { return this.#id; }
    get name() { return this.#name; }
    get about() { return this.#about; }
    get status() { return this.#status; }
    set name(newName) {
        if (this.#name === newName) {
            return;
        }
        this.#name = newName;
        this.shadowRoot.querySelector(".test-name").innerHTML = miniMarkdown(newName);
    }
    set partialResults(results) {
        if (this.#partialResults === results) {
            return;
        }
        this.#partialResults = results;
        const element = this.shadowRoot.querySelector(".partial-results");
        if (results.completed == 0) {
            element.textContent = "";
        }
        else if (results.completed < results.total) {
            element.textContent = `${Math.round(results.completed / results.total * 100)}% Validated`;
        }
    }
    set status(newStatus) {
        if (newStatus === this.#status) {
            return;
        }
        this.#status = newStatus;
        this.#suite.updateStatusCounts();
        this.icon = getTestStatusIcon(this.#status);
    }
    set icon(newIcon) {
        const icon = this.shadowRoot.querySelector(".test-icon");
        newIcon.classList.add("test-icon");
        icon.replaceWith(newIcon);
    }
}
customElements.define('test-item', TestItem);
