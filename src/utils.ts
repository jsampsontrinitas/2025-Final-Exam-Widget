import Icons from "./Icons";
import { TestStatus } from "./types/declaration";

export function createElement(tagname: string, attributes: string | Record<string, any> = {}): HTMLElement {

    let id: string | undefined;
    let classes: string[] = [];

    if (tagname.includes("#") || tagname.includes(".")) {

        let mode = "tag";

        for (const part of tagname.split(/(\#|\.)/)) {

            if (part === "#") {
                mode = "id";
                continue;
            }

            if (part === ".") {
                mode = "class";
                continue;
            }

            if (mode === "tag") {
                tagname = part;
                continue;
            }

            if (mode === "id") {
                id = part;
                continue;
            }

            if (mode === "class") {
                classes.push(part);
                continue;
            }

        }

    }

    const element = document.createElement(tagname);

    if (id) element.setAttribute("id", id);
    if (classes) element.classList.add(...classes);

    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'innerHTML') {
            element.innerHTML = value;
            continue;
        } else if (key === 'classList') {
            for (const className of value.split(' ')) {
                element.classList.add(className);
            }
            continue;
        }

        element.setAttribute(key, value);
    }

    return element;
}

export function getTestStatusIcon(status: TestStatus) {

    if (status === 'passed') {
        return Icons.passed;
    } else if (status === 'failed') {
        return Icons.failed;
    } else if (status === 'pending' || status === 'partial') {
        return Icons.pending;
    }

    throw new Error("Unsupported status:", status);
}

export function miniMarkdown(src: string): string {
    const escapeHTML = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return src
        // inline code with class detection
        .replace(/`([^`]+)`/g, (_: any, code: string) => {
            let cls = "";
            if (/^\[[^\]]+\]$/.test(code)) cls = "attr";   // [src]
            else if (/^['"].*['"]$/.test(code)) cls = "string"; // "foo"
            else if (/^[a-zA-Z_$][\w$]*\s*\([^)]*\)$/.test(code)) cls = "func";   // double()
            else if (/^\.[a-zA-Z_$][\w$]*(?:\.[\w$]+)*$/.test(code)) cls = "prop";   // .textContent
            else if (/[<>]/.test(code)) cls = "html";   // <html>

            return `<code${cls ? ` class="${cls}"` : ""}>${escapeHTML(code)}</code>`;
        })
        .replace(/\*([^\*]+)\*/g, "<strong>$1</strong>")  // bold
        .replace(/_([^_]+)_/g, "<em>$1</em>");           // italic
}

export function clearState(name: string) {
    localStorage.removeItem(name);
}

export function saveState(name: string, value: string | number | boolean) {
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    localStorage.setItem(name, String(value));
}

export function loadState<T>(name: string, defaultValue: T): T {
    const value = localStorage.getItem(name);
    if (value === null) {
        return defaultValue;
    }
    try {
        return JSON.parse(value) as T;
    } catch (e) {
        return value as unknown as T;
    }
}
