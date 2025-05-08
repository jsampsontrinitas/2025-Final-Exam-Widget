import { makeTaskReport } from "../utils";

export default {
    name: "Page Styling",
    tests: [
        {
            name: "Main CSS Attached",
            about: "The page must include a `<link>` element that loads the `\"main.css\"` stylesheet. The element should use the `[rel]` attribute to specify the relationship of the linked document to the current document. The value of this attribute should be \"`stylesheet`\". The proper location for a `<link>` element is within the `<head>` element.",
            fn: () => makeTaskReport([
                "head > link",
                "link[href$='main.css']",
                "link[href$='main.css'][rel='stylesheet']",
                "head > link[href$='main.css'][rel='stylesheet']",
            ])
        },
        {
            "name": "Text color is `midnightblue`",
            "about": "The text color of our page should be `\"midnightblue\"`.",
            "fn": () => {
                const body = document.querySelector("body")!;
                const computedStyle = window.getComputedStyle(body);
                return computedStyle.color === "rgb(25, 25, 112)";
            },
        },
        {
            "name": "Background is `ghostwhite`",
            "about": "The background color of the page should be `\"ghostwhite\"`.",
            "fn": () => {
                const body = document.querySelector("body")!;
                const computedStyle = window.getComputedStyle(body);
                return computedStyle.backgroundColor === "rgb(248, 248, 255)";
            },
        },
    ]
}
