function injectedCommentIndex(element: HTMLElement): number {
    for (let i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeType === Node.COMMENT_NODE) {
            if (element.childNodes[i].textContent?.includes("injected")) {
                return i;
            }
        }
    }
    return -1;
}

function cleanIndents(element: HTMLElement) {
    const nodes = Array.from(element.childNodes);
    const index = injectedCommentIndex(element);
    const relevantNodes = index !== -1 ? nodes.slice(0, index) : nodes;
    const elementChildren = relevantNodes.filter(n => n.nodeType === Node.ELEMENT_NODE);

    // Get indentation (number of leading spaces/tabs) for each element child
    const indents = elementChildren.map(el => {
        const prev = el.previousSibling;
        if (prev && prev.nodeType === Node.TEXT_NODE) {
            const match = prev.textContent?.match(/[\t ]*$/);
            return match ? match[0].length : 0;
        }
        return 0;
    });

    // If there are no element children, consider it "clean"
    if (indents.length === 0) return true;

    return indents.every(indent => indent === indents[0]);
}

export default {
    name: "Document Details",
    tests: [
        {
            name: "Valid Doctype",
            about: "The doctype ensures the browser supports modern HTML features. It should be the first line of our page. It is included automatically when using the HTML5 template in Codespaces.",
            fn: () => document.doctype?.name?.toLowerCase() === 'html',
        },
        {
            name: "English Content",
            about: "Our page should declare that its content is written in English. This is typically handled via an attribute on the `<html>` element itself.",
            fn: () => document.documentElement.getAttribute("lang")?.toLowerCase() == "en",
        },
        {
            name: "Personalized title",
            about: "The title of the page (as seen in the browser tab) should say \"Jane's Web Final Exam\". Replace \"Jane\" with your first name.",
            fn: () => {
                const names = ["Jackson", "Brandon", "Jonathan", "Jon", "Jon Anthony"];
                const pattern = new RegExp(`^(${names.join("|")})'s Web Final Exam$`);
                return pattern.test(document.title);
            },
        },
        {
            name: "HTML neatly formatted",
            about: "The HTML of our page should be neatly formatted. This means that the HTML should be indented properly. Codespaces has a built-in formatter that can help with this.",
            fn: () => [document.documentElement, document.head, document.body].every(cleanIndents),
        },
    ]
}
