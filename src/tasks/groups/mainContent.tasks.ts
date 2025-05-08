import { makeTaskReport, getDocument } from "../utils";

export default {
    name: "Main Content",
    tests: [
        {
            name: "Main heading",
            about: "The page must have an `<h1>` element with id `'mainHeading'`, placed immediately within the `<body>`. This element should be the first child of the body. The content of this heading should be the message \"Hello, Web!\" (without quotes).",
            fn: () => makeTaskReport([
                "body > h1",
                "body > h1#mainHeading",
                "body > h1#mainHeading:first-child",
                async () => {
                    try {
                        const doc = await getDocument("index.html");
                        return doc && ["hello", "web"].every(word => {
                            const element = doc.querySelector("body > h1#mainHeading:first-child");
                            return element && element.textContent.toLowerCase().includes(word);
                        });
                    } catch (e) {
                        return false;
                    }
                }
            ])
        },
        {
            name: "Main heading image",
            about: "The `<h1>` element with id `'mainHeading'` must be immediately followed by an `<img>` element with the `src` attribute set to `'images/crest.png'` and an `alt` attribute that contains the word 'Trinitas'.",
            fn: () => !!document.querySelector("body > h1#mainHeading + img[src$='crest.png'][alt*='trinitas' i]"),
        },
        {
            name: "Navigation bar",
            about: "The page must contain a `<nav>` element as a child of the `<body>`.",
            fn: () => !!document.querySelector("body > nav"),
        },
        {
            name: "Navigation list",
            about: "The `<nav>` element must contain a `<ul>` element.",
            fn: () => !!document.querySelector("body > nav > ul"),
        },
        {
            name: "Navigation links",
            about: "The `<ul>` element must contain two `<li>` elements, each containing an `<a>` element. The first link should point to `index.html`, and the second to `about.html`. The text of these links should be \"Home\" and \"About\" (without quotes), respectively.",
            fn: () => makeTaskReport([
                "body > nav > ul > li + li",
                "body > nav > ul > li:has(a) + li:has(a)",
                "body > nav > ul > li:has(a[href$='index.html']) + li:has(a)",
                "body > nav > ul > li:has(a) + li:has(a[href$='about.html'])",
                () => "Home" == document.querySelector("a[href$='index.html']")?.textContent?.trim(),
                () => "About" == document.querySelector("a[href$='about.html']")?.textContent?.trim(),
            ])
        },
        {
            name: "Main content area",
            about: "The page must contain a `<main>` element after the `<nav>`.",
            fn: () => !!document.querySelector("body > nav + main"),
        },
        {
            name: "Main content sections",
            about: "The `<main>` element must contain two `<section>` elements. The first should have id `'intro'`, and the second should have id `'todo'`.",
            fn: () => !!document.querySelector(`body > main > section#intro:first-child + section#todo:last-child`),
        },
        {
            name: "Intro and greeting",
            about: "The first `<section>` (with id `'intro'`) must contain a `<p>` element with id `'greeting'`.",
            fn: () => !!document.querySelector(`body > main > section#intro:first-child > p#greeting:last-child`),
        },
        {
            name: "Footer content",
            about: "The last element within the `<body>` should be a footer element. The footer should contain a `<small>` element with the text \"2025 Final Exam Site\" (without quotes).",
            fn: () => {
                const footer = document.querySelector("body > footer");
                const smallEl = footer && footer.querySelector("small");
                return smallEl && ["2025", "final", "exam", "site"].every((word) =>
                    smallEl.innerHTML.trim().toLowerCase().includes(word));
            }
        }
    ]
}
