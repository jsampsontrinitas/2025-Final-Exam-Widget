import { getDocument, makeTaskReport } from "../utils";

export default {
    name: "Site",
    tests: [
        {
            name: "Create `about.html`",
            about: "Alongside your `index.html`, create an `about.html` page. It should contain the Trinitas Crest image, and an `<h1>` element that says \"Coming soon\". Do not worry about styling this page.",
            fn: async () => {
                try {
                    const doc = await getDocument("about.html");
                    return makeTaskReport([
                        "h1",
                        "img[src$='images/crest.png']",
                        () => ["coming", "soon"].every((word) =>
                            doc.querySelector("h1")?.textContent?.trim().toLowerCase().includes(word)),
                    ]);
                } catch {
                    return false;
                }
            }
        }
    ]
}