interface SVGAttributes {
    [key: string]: string;
}

const build = (attrs: SVGAttributes, innerHTML: string): SVGSVGElement => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.entries(attrs).map(([key, value]) => svg.setAttribute(key, value));
    if (innerHTML) svg.innerHTML = innerHTML;
    return svg;
}

export default class Icons {

    static get close() {
        return build({
            width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
            strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round",
        }, `<line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>`);
    }

    static get chevron() {
        return build({
            class: "chevron", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
            strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round",
        }, `<polyline points="6 9 12 15 18 9"></polyline>`);
    }

    static get partial() {
        return Icons.pending;
    }

    static get pending() {
        return build({
            class: "test-icon pending-icon", width: "16", height: "16", viewBox: "0 0 24 24",
            fill: "none", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", stroke: "orange",
        }, `<circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="6" x2="12" y2="12"></line>
            <circle cx="12" cy="16" r="1"></circle>`);
    }

    static get passed() {
        return build({
            class: "test-icon check-icon", width: "16", height: "16", viewBox: "0 0 24 24",
            fill: "none", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", stroke: "green",
        }, `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>`);
    }

    static get failed() {
        return build({
            class: "test-icon x-icon", width: "16", height: "16", viewBox: "0 0 24 24",
            fill: "none", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", stroke: "red",
        }, `<circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>`);
    }

}