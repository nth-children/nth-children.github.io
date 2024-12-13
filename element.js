customElements.define(
  "nth-children",
  class extends HTMLElement {
    // todo: add observedAttributes: count, columns, smile (and add to UI)
    connectedCallback() {
      const cellcount = ~~(this.getAttribute("cellcount") || 30); // integer
      const columns = ~~(this.getAttribute("columns") || 10);
      const smile = this.getAttribute("smile") || "😀";
      // ========================================================================= examples
      const nthExamples = [
        {
          nth: ":nth-child(4n+3)",
          title:
            "Starts from the 3rd element, picks every 4th element after that",
        },
        {
          nth: ":nth-child(4n):nth-child(3n)",
          title: "Select elements divisible by 4 and 3",
        },
        {
          nth: ":nth-child(2n+3)",
          title: "Matches every odd-indexed element (excluding the first).",
        },
        {
          nth: ":nth-child(-3n+10)",
          title: "Starts at the 10th element and works backward in steps of 3",
        },
        {
          nth: ":nth-child(n+5):nth-child(-n+10)",
          title:
            "Matches all elements from the 5th onward. -n+10: Matches all elements up to the 10th",
        },
        {
          nth: ":not(:nth-child(5n))",
          title:
            "selects multiples of 5.  not() negates this, targeting all other elements",
        },
      ];
      // ========================================================================= helper functions
      // Helper function creating Elements
      const createElement = (tag, { append = [], ...props } = {}) => {
        const element = Object.assign(document.createElement(tag), props);
        element.append(...append);
        return element;
      };
      // =========================================================================
      // attach shadowDOM to Custom Element
      this.attachShadow({ mode: "open" }).append(
        // ----------------------------------------------------------------------- create DOM
        // ----------------------------------------------------------------------- create main styles
        createElement("style", {
          textContent:
            `:host{display:block;font-family:sans-serif;max-width:1200px;width:1000px;margin:0 auto}` +
            // grid
            `grid-container{display:grid;gap:4px;grid-template-columns:repeat(${columns},1fr);` +
            // display numbers with CSS counter
            `counter-reset:cell-counter}` +
            // <grid-cell>
            `grid-cell{background:lightgrey;width:100%;text-align:center;height:100%}` +
            `grid-cell{font-size:50px}` +
            `grid-cell .include{display:none}` + // hide smileys by default
            // nth examples
            `.nthselector{font-weight:bold}summary{padding:0 0 .3em 2.3em}` +
            `grid-cell::before{counter-increment:cell-counter;content:counter(cell-counter);` +
            `font-size:35%;display:block;width:100%;text-align:center}` +
            // Examples
            `#examples{cursor:pointer;margin:1em}` +
            `.example{padding:4px}` +
            `.example{cursor:pointer;transition:background .3s}` +
            `.example:hover{background:lightgreen}` +
            // edit input
            `#edit{zoom:1.5;text-align:center;padding:1em}`,
        }),
        // ----------------------------------------------------------------------- nth CSS
        (this.nth = createElement("style" /* CSS nth-child injected here */)),
        // ----------------------------------------------------------------------- H1
        createElement("H1", {
          textContent: `:nth-child builder`,
        }),
        // ----------------------------------------------------------------------- Examples
        createElement("DIV", {
          id: "examples",
          innerHTML: "<b>Examples</b> click to select:",
          append: nthExamples.map(({ nth, title }) =>
            createElement("div", {
              className: "example",
              innerHTML: `<div class="nthselector">${nth}</div><summary>${title}</summary>`,
              onclick: (evt) => this.setnth(nth),
              onmouseenter: (evt) => {
                this.setnth(nth);
              },
              onmouseleave: (evt) => this.setnth(this.savednth),
            })
          ),
        }),
        // ----------------------------------------------------------------------- edit <input>
        createElement("div", {
          id: "edit",
          append: [
            "Edit: ",
            (this.input = createElement("input", {
              onkeyup: (evt) => this.setnth(this.input.value),
              attrs: [
                //pattern: "(?:(-?[0-9]*)n{1})?((?:[0-9]+)|(?:(\s*(?:\+|-)\s*[0-9]+)))?",
                //required: true
              ],
            })),
          ],
        }),
        // ----------------------------------------------------------------------- Smileys
        createElement("grid-container", {
          append: Array(cellcount)
            .fill(0)
            .map((_, idx) =>
              createElement("grid-cell", {
                innerHTML: `<span class="include">${smile}</span>`,
              })
            ),
        }) // create <grid-container>
      ); // shadowRoot append
      // -----------------------------------------------------------------------
      this.setnth();
      // -----------------------------------------------------------------------
    } // connectedCallback
    // =========================================================================
    setnth(formula = ":nth-child(4n+3)") {
      this.savednth = this.input.value;
      this.input.value = formula;
      // build active CSS
      this.nth.textContent =
        `grid-cell${formula}{background-color:green}` +
        `grid-cell${formula}::before{color:gold;font-weight:bold}` +
        `grid-cell${formula} .include{display:block}`; // show smileys
    }
    // =========================================================================
  } // extends class HTMLElement
); // define
