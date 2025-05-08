import { getDocument, makeTaskReport } from "../utils";
export default {
    name: "JavaScript",
    tests: [
        {
            "name": "Dynamically change heading",
            "about": "By default, the `h1#mainHeading` greeting says \"Hello, Web!\". You must dynamically change the text content of this element to say `'Hello, Trinitas!'`. Implement this in `main.js`.",
            fn: () => makeTaskReport([
                "h1#mainHeading",
                () => ["hello", "trinitas"].every((word) => document.querySelector("#mainHeading")?.textContent?.toLowerCase().includes(word)),
                async () => {
                    try {
                        const doc = await getDocument("index.html");
                        return doc && ["hello", "web"].every(word => {
                            const element = doc.querySelector("body > h1#mainHeading:first-child");
                            return element && element.textContent.toLowerCase().includes(word);
                        });
                    }
                    catch (e) {
                        return false;
                    }
                }
            ]),
        },
        {
            "name": "`double()` function",
            "about": "Implement in `main.js` a function called `\"double\"`; it should return a value twice as large as that which is provided.",
            // We expect a global function `double` to be defined
            // @ts-ignore
            "fn": () => typeof double === 'function' && double(2) === 4,
        },
    ]
};
