import { makeTaskReport } from "../utils";

export default {
    name: "TODO List",
    tests: [
        {
            "name": "Has `todo.css` attached",
            "about": "The page must include a `<link>` element with the `href` attribute set to `'styles/todo.css'`.",
            "fn": () => !!document.querySelector('link[href="styles/todo.css"]'),
        },
        {
            "name": "Has `todo.js` properly attached",
            "about": "The page must include a `<script>` element with the `src` attribute set to `'scripts/todo.js'`. Our script queries the document for various elements, so we must ensure the document has fully loaded before our script is executed.",
            fn: () => makeTaskReport([
                "head script[src$='scripts/todo.js']",
                "head script[src$='scripts/todo.js'][defer]",
            ]),
        },
        {
            name: "Has heading",
            about: "The `section#todo` element must contain as its _first-child_ an `<h3>` element with the text \"Summer TODO List\" (without quotes).",
            fn: () => makeTaskReport([
                "section#todo > h3",
                "section#todo > h3:first-child",
                () => {
                    const element = document.querySelector("section#todo > h3");
                    return element && ["summer", "todo", "list"].every((word) =>
                        element.textContent?.trim().toLowerCase().includes(word));
                }
            ]),
        },
        {
            "name": "Has `ul#list` list element",
            "about": "The page must contain a `<ul>` element with id `'list'`. This element is expected to be the last child of the `section#todo` element. It should have no children by default.",
            fn: () => makeTaskReport([
                "ul#list",
                "section#todo > ul",
                "section#todo > ul:last-child",
                "section#todo > ul#list:last-child",
                "section#todo > ul#list:last-child:empty",
            ])
        },
        {
            name: "Has `div#listControls` element",
            about: "The `section#todo` must contain a `<div>` with id \"`listControls`\". This element should be the second child of the `section#todo`. It must contain an `<input>` with an `id` attribute of \"`#newItem`\".",
            fn: () => makeTaskReport([
                "div#listControls",
                "section#todo > div#listControls",
                "section#todo > div#listControls:nth-child(2)",
                "section#todo > div#listControls > input",
                "section#todo > div#listControls > input:nth-child(1)",
                "section#todo > div#listControls > input#newItem",
            ])
        },
        {
            "name": "Has `input#newItem` element",
            "about": "Our TODO list controls should contain an `<input>` element with id \"`newItem`\".",
            "fn": () => !!document.querySelector('input#newItem'),
        },
        {
            "name": "Has `button#addItem` element",
            "about": "Our TODO list controls should contain a `<button>` element with id \"`addItem`\". The text content of this button should be \"_Add Item_\" (without quotes).",
            "fn": () => makeTaskReport([
                "button#addItem",
                () => {
                    const element = document.querySelector("button#addItem");
                    return element && ["add", "item"].every((word) =>
                        element.textContent?.trim().toLowerCase().includes(word));
                }
            ])
        },
        {
            "name": "Has `button#clearList` element",
            "about": "Our TODO list controls should contain a `<button>` element with id \"`clearList`\". The text content of this button should be \"_Clear List_\" (without quotes).",
            "fn": () => makeTaskReport([
                "button#clearList",
                () => {
                    const element = document.querySelector("button#clearList");
                    return element && ["clear", "list"].every((word) =>
                        element.textContent?.trim().toLowerCase().includes(word));
                }
            ]),
        },
        {
            "name": "Can add items",
            "about": "We should be able to add items to our TODO list.",
            "fn": () => {
                const todo = document.querySelector("#todo");
                const input = todo && document.querySelector("#newItem");
                const button = input && document.querySelector("#addItem");
                const list = button && document.querySelector("#list");

                if (list && input instanceof HTMLInputElement && button instanceof HTMLButtonElement) {
                    const beforeLength = list.children.length;
                    input.value = "Test Entry";
                    button.click();
                    const afterLength = list.children.length;
                    input.value = "";
                    list.innerHTML = "";

                    return afterLength > beforeLength;
                }

                return false;
            }
        },
        {
            "name": "Can clear list",
            "about": "We should be able to click the _Clear List_ button to remove all items in the list.",
            "fn": () => {
                const list = document.querySelector("#list");
                const button = list && document.querySelector("#clearList");

                if (button instanceof HTMLButtonElement && list instanceof HTMLUListElement) {
                    list.appendChild(document.createElement("li"));
                    let count = list.children.length;
                    button.click();
                    return list.innerHTML === "" && count > 0;
                }

                return false;
            }
        }
    ]
}