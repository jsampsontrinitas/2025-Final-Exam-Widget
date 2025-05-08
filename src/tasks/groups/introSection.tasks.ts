import { makeTaskReport } from "../utils";

const introHeadingSelector = "body > main > section#intro > h2:first-child";

export default {
    name: "Intro Section",
    tests: [
        {
            "name": "Has `section#intro` element",
            "about": "The page must contain a `<section>` element with id `'intro'`, immediately within the `<body>` element.",
            "fn": () => !!document.querySelector('body > main > section#intro'),
        },
        {
            "name": "Has intro heading",
            "about": "The `section#intro` element must contain as its _first-child_ an `<h2>` element. The text content of this header should be \"_A word to our friends graduating this year…_\".",
            "fn": () => makeTaskReport([
                introHeadingSelector,
                () => ["word", "friends", "year"].every((w) => {
                    const element = document.querySelector(introHeadingSelector);
                    return element && element.textContent?.toLowerCase().includes(w);
                }),
            ]),
        },
        {
            "name": "Has greeting paragraph",
            "about": "The `section#intro` element must contain a `p#greeting` child as its _last-child_. This is where our greeting messages will be programmatically displayed (that functionality is handled in the `scripts/greetings.js` file).",
            "fn": () => !!document.querySelector('body > main > section#intro > p#greeting:last-child'),
        },
    ]
}
