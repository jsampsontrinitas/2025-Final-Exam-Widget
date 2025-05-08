import Icons from "../../Icons";
import TestItem from "../testItem/testItem";
import ModalOverlay from "../modalOverlay/modalOverlay";
import { testGroups } from "../../tasks/index";
import { createElement, miniMarkdown, getTestStatusIcon, saveState, loadState } from "../../utils";
import sheet from './styles.css' with { type: 'css' };
export default class ExamTracker extends HTMLElement {
    modal;
    expanded;
    testData;
    statusContainer;
    constructor() {
        super();
        this.modal = new ModalOverlay();
        this.expanded = false;
        this.testData = [];
        this.initializeTestItemElements();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    connectedCallback() {
        this.render();
        this.addEventListeners();
        // Restore state?
        const expanded = loadState('test-status.expanded', false);
        if (expanded !== null) {
            // Expand the view
            this.expanded = expanded;
            this.statusContainer?.classList.toggle('expanded', this.expanded);
            // Update scrollTop
            const statusBody = this.shadowRoot.querySelector(".status-body");
            statusBody.scrollTop = loadState('test-status.scrollTop', 0);
            // Was the modal visible?
            const visible = loadState('modal.visible', false);
            if (visible) {
                // Just need to add the modal; it will restore itself
                document.body.appendChild(this.modal);
            }
        }
    }
    initializeTestItemElements() {
        const testData = [];
        for (let i = 0; i < testGroups.length; i++) {
            const tests = [];
            const group = testGroups[i];
            for (let j = 0; j < group.tests.length; j++) {
                const id = `g${i}:t${j}`;
                const status = 'pending';
                const { name, about, fn } = group.tests[j];
                tests.push(new TestItem({ id, name, about, fn, status, suite: this }));
            }
            testData.push({ name: group.name, tests });
        }
        this.testData = testData;
    }
    getStatusCounts() {
        const counts = { total: 0, partial: 0, pending: 0, passed: 0, failed: 0 };
        for (const { status } of this.testData.flatMap(g => g.tests)) {
            counts.total = (counts.total ?? 0) + 1;
            counts[status] = (counts[status] ?? 0) + 1;
        }
        return { ...counts, passRate: counts.passed / counts.total };
    }
    getStatusClass() {
        const { passRate } = this.getStatusCounts();
        if (passRate >= 0.8)
            return 'success';
        if (passRate >= 0.5)
            return 'warning';
        return 'error';
    }
    toggleExpand() {
        this.expanded = !this.expanded;
        this.statusContainer?.classList.toggle('expanded', this.expanded);
        saveState('test-status.expanded', this.expanded);
    }
    showTestDetailsInModal(testItem) {
        // Make sure our modal overlay is attached to the page
        if (!this.modal.isConnected) {
            document.body.appendChild(this.modal);
        }
        this.modal.setAll({
            icon: getTestStatusIcon(testItem.status),
            title: testItem.name,
            content: testItem.about,
        });
        this.modal.show();
    }
    addEventListeners() {
        // We have one listener, and use delegation to handle clicks
        this.shadowRoot.addEventListener('click', (event) => {
            const target = event.target;
            const item = target.closest('test-item');
            if (item)
                this.showTestDetailsInModal(item);
            if (target.closest('.status-header'))
                this.toggleExpand();
        });
        const statusBody = this.shadowRoot.querySelector(".status-body");
        statusBody.addEventListener('scroll', (event) => {
            const target = event.target;
            saveState('test-status.scrollTop', target.scrollTop);
        });
    }
    updateStatusCounts() {
        const header = this.shadowRoot.querySelector(".status-header");
        header.className = `status-header ${this.getStatusClass()}`;
        const { total, partial, pending, passed, passRate } = this.getStatusCounts();
        const label = header.querySelector(".counts");
        const percent = Math.round(passRate * 100);
        label.textContent = `${passed} of ${total} (${percent}%)`;
    }
    buildStatusContainerHeader() {
        return createElement('div.status-header', {
            innerHTML: `
                <span class="counts">00 of 00 (00%)</span>
                ${Icons.chevron.outerHTML}
            `
        });
    }
    buildStatusContainerBody() {
        const statusBody = createElement('div.status-body');
        // Create the test groups
        for (const group of this.testData) {
            // Create the group element
            const element = createElement("div.test-group", {
                innerHTML: `<div class="group-name">${miniMarkdown(group.name)}</div>`,
            });
            // Add the test items
            group.tests.forEach(t => element.appendChild(t));
            // Append group to div
            statusBody.appendChild(element);
        }
        return statusBody;
    }
    buildTimeRemainingElement() {
        // Starts at 8:05 AM on Friday, May 9th, 2025 (Central Time)
        // Ends   at 9:50 AM on Friday, May 9th, 2025 (Central Time)
        // Set the end time once when the element is created
        // const endTimeUTC = Date.now() + 60 * 60 * 1000; // one hour from now
        // New end time will be 5/9/2025 9:50 AM Central Time
        const endTimeUTC = new Date(2025, 4, 9, 14, 50); // UTC time
        function buildTimeRemainingString() {
            const nowUTC = Date.now();
            const timeRemaining = Math.max(0, endTimeUTC.getTime() - nowUTC);
            const totalSeconds = Math.floor(timeRemaining / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return timeRemaining > 0
                ? `
                <span class="h">${String(hours).padStart(2, '0')}</span> 
                <span class="m">${String(minutes).padStart(2, '0')}</span> 
                <span class="s">${String(seconds).padStart(2, '0')}</span>
            `
                : "TIMES UP";
        }
        let formattedTime = buildTimeRemainingString();
        const timeRemainingElement = createElement('div.time-remaining');
        function refreshLabel() {
            const newTime = buildTimeRemainingString();
            if (newTime !== formattedTime) {
                timeRemainingElement.innerHTML = newTime;
                formattedTime = newTime;
            }
            if (newTime === "TIMES UP") {
                timeRemainingElement.classList.add('expired');
                clearInterval(interval);
            }
        }
        const interval = setInterval(refreshLabel, 1000);
        refreshLabel();
        return timeRemainingElement;
    }
    buildStatusContainerElement() {
        const container = createElement('div.status-container');
        container.appendChild(this.buildStatusContainerHeader());
        container.appendChild(this.buildStatusContainerBody());
        container.appendChild(this.buildTimeRemainingElement());
        return container;
    }
    async render() {
        // Ensure all elements are created
        if (!this.statusContainer)
            this.statusContainer = this.buildStatusContainerElement();
        // Append elements to the shadow root
        this.shadowRoot.appendChild(this.statusContainer);
    }
}
// Register the custom element
customElements.define('exam-tracker', ExamTracker);
