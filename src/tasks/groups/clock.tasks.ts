import { makeTaskReport } from "../utils"

export default {
    name: "Clock Element",
    tests: [
        {
            name: "Has `clock.js` linked",
            about: "The page must attach `'scripts/clock.js'` via a `<script>` element. This script needs to access elements on the page, so make sure to defer its loading.",
            fn: () => makeTaskReport([
                "head script[src$='scripts/clock.js']",
                "head script[src$='scripts/clock.js'][defer]",
            ])
        },
        {
            name: "Has `div#clock` element",
            about: "The page must contain a `<div>` element with id `'clock'`. This element should be the first child of the `footer` element.",
            fn: () => makeTaskReport([
                "footer > div",
                "footer > div#clock",
                "footer > div#clock:first-child",
            ])
        },
        {
            name: "Clock is updateable",
            about: "The `clock.js` script stores the current time in a variable called `now`. This variable should be updateable.",
            fn: () => {
                let nowExists = false;
                let initialValue: Date | null = null;
                let updatedValue: Date | null = null;
                try {
                    // Check if `now` is defined and is a Date object
                    // @ts-ignore
                    nowExists = typeof now !== "undefined" && now instanceof Date;
                    if (!nowExists) {
                        return false;
                    }
                    // Store the initial value of `now`
                    // @ts-ignore
                    initialValue = now;

                    // Simulate a clock update
                    // @ts-ignore
                    now = new Date();

                    // Check if `now` has been updated
                    // @ts-ignore
                    updatedValue = now;

                    // Check if the initial and updated values are different
                    return nowExists && initialValue?.getTime() !== updatedValue?.getTime();
                } catch (e) {
                    return false;
                }
            }
        },
        {
            name: "Clock updates",
            about: "The clock should update every 500ms (showing a new time roughly every ~1 second). If it doesn't, the time will remain unchanged in the footer.",
            fn: () =>
                new Promise((resolve, reject) => {
                    const clock = document.querySelector("#clock");
                    if (!clock) return reject();

                    let updates = 0;
                    let lastValue = clock.textContent;
                    const observer = new MutationObserver(() => {
                        if (clock.textContent !== lastValue) {
                            lastValue = clock.textContent;
                            updates++;
                            if (updates === 3) {
                                observer.disconnect();
                                resolve(true);
                            }
                        }
                    });

                    observer.observe(clock, { childList: true, characterData: true, subtree: true });

                    setTimeout(() => {
                        observer.disconnect();
                        reject();
                    }, 3000);
                })
        },
    ]
}
