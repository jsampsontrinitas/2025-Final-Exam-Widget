import Icons from "../../Icons";
import { clearState, saveState, loadState, createElement, miniMarkdown } from "../../utils";

import sheet from './styles.css' with { type: 'css' };

export default class ModalOverlay extends HTMLElement {

    #modal: HTMLDivElement | undefined;
    #overlay: HTMLDivElement | undefined;

    #icon: HTMLSpanElement | undefined;
    #title: HTMLSpanElement | undefined;
    #content: HTMLDivElement | undefined;
    #closeButton: HTMLButtonElement | undefined;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [sheet as unknown as CSSStyleSheet];
    }

    connectedCallback() {
        this.buildModalOverlayElement();
        this.setupEventListeners();
        this._restoreState();
    }

    _restoreState() {
        const visible = loadState('modal.visible', false);

        if (!visible) {
            return;
        }

        const title = loadState('modal.title', '');
        const content = loadState('modal.content', '');
        const icon = loadState('modal.icon', '');

        this.setAll({ title, content, icon });
        this.show();
    }

    _saveState() {
        const title = this.#title?.innerHTML ?? "";
        const content = this.#content?.innerHTML ?? "";
        const icon = this.#icon?.firstElementChild?.outerHTML ?? "";

        saveState('modal.visible', true);
        saveState('modal.title', title);
        saveState('modal.content', content);
        saveState('modal.icon', icon);
    }

    _clearState() {
        clearState('modal.visible');
        clearState('modal.title');
        clearState('modal.content');
        clearState('modal.icon');
    }

    buildModalOverlayElement() {

        const buildModalTitle = () => {
            const container = createElement('div.modal-title');
            this.#icon = container.appendChild(createElement('span.modal-icon'));
            this.#title = container.appendChild(createElement('span.modal-test-name'));
            return container;
        }

        const buildModalHeader = () => {
            const container = createElement('div.modal-header');
            container.appendChild(buildModalTitle());
            this.#closeButton = container.appendChild(createElement('button.close-btn', {
                innerHTML: Icons.close.outerHTML
            })) as HTMLButtonElement;

            return container;
        }

        const modalOverlay = this.#overlay = createElement('div.modal-overlay') as HTMLDivElement;
        const testModal = this.#modal = modalOverlay.appendChild(createElement('div.test-modal')) as HTMLDivElement;

        testModal.appendChild(buildModalHeader());
        this.#content = testModal.appendChild(createElement('div.modal-content')) as HTMLDivElement;

        // Append elements to shadow root
        this.shadowRoot?.appendChild(modalOverlay);
    }

    setupEventListeners() {
        const _ = this.shadowRoot!;
        const d = document;
        const b = _.querySelector('.close-btn')!;
        const o = _.querySelector('.modal-overlay')!;
        b.addEventListener('click', () => this.hide());
        o.addEventListener('click', ({ target: t }) => (t == o) && this.hide());
        d.addEventListener('keydown', ({ key: k }) => (k == 'Escape') && this.hide());
    }

    setAll({ icon, title, content } : { icon?: string | SVGSVGElement, title?: string, content?: string }) {
        if (title) this.#title!.innerHTML = miniMarkdown(title);
        if (content) this.#content!.innerHTML = miniMarkdown(content);
        if (icon && icon instanceof SVGSVGElement) {
            this.#icon!.firstElementChild
                ? this.#icon!.firstElementChild.replaceWith(icon)
                : this.#icon!.appendChild(icon);
        } else if (icon && typeof icon === 'string') {
            this.#icon!.innerHTML = icon;
        }
    }

    show() {
        [this.#modal, this.#overlay].map(o =>
            o!.classList.add('visible'));
        this._saveState();
    }

    hide() {
        [this.#modal, this.#overlay].map(o =>
            o!.classList.remove('visible'));
        this._clearState();
    }

}

customElements.define('modal-overlay', ModalOverlay);
