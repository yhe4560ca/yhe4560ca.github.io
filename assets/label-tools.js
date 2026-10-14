/* Shared helpers for the barcode label creators in tools/.
   Include after JsBarcode and before the page script:
   <script src="../assets/label-tools.js"></script> */

// Narrowest bar (one barcode module) most scanners read reliably: 7.5 mil
const MIN_MODULE_INCHES = 0.0075;

// Non-empty, trimmed lines of a textarea
function readLines(id) {
    return document.getElementById(id).value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
}

// Positive number from an input, or fallback while it is empty or invalid
function readNumber(id, fallback) {
    const n = parseFloat(document.getElementById(id).value);
    return n > 0 ? n : fallback;
}

function createIssues() {
    return { failed: [], tooSmall: [], tooTall: [] };
}

// Call once a label is complete: records text if its content does not fit the label
function checkFits(label, text, issues) {
    if (label.scrollHeight > label.clientHeight + 1) issues.tooTall.push(text);
}

// Creates an element with a class and optional text (text, not HTML, so any input is safe)
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

// Appends a CODE128 barcode for text to parent and records problems in issues.
// The SVG must be in the page before it can be measured, so it is appended first.
function addBarcode(parent, text, options, issues) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('barcode');
    parent.appendChild(svg);

    const opts = Object.assign({ format: 'CODE128', displayValue: false, margin: 0 }, options);
    // CODE128 rejects some characters; skip this barcode instead of aborting the rest
    try {
        JsBarcode(svg, text, opts);
    } catch (e) {
        svg.remove();
        issues.failed.push(text);
        return;
    }

    // The barcode shrinks to fit the label; check its bars stay wide enough to scan
    const scale = svg.getBoundingClientRect().width / svg.width.baseVal.value;
    if (opts.width * scale / 96 < MIN_MODULE_INCHES) issues.tooSmall.push(text);
}

function showIssues(id, issues, hint = 'shorten the text') {
    const box = document.getElementById(id);
    box.replaceChildren();
    if (issues.failed.length) {
        box.appendChild(el('div', '', `Could not create barcode for: ${issues.failed.join(', ')}`));
    }
    if (issues.tooSmall.length) {
        box.appendChild(el('div', '', `Barcode too small to scan reliably, ${hint}: ${issues.tooSmall.join(', ')}`));
    }
    if (issues.tooTall.length) {
        box.appendChild(el('div', '', `Too tall for the label, lower the barcode height: ${issues.tooTall.join(', ')}`));
    }
}

// "1 label", "3 labels"
function plural(n, word) {
    return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function showCount(id, text) {
    document.getElementById(id).textContent = text;
}

// Re-render, then print once layout (and any text fitting) has settled
function renderAndPrint(render) {
    render();
    requestAnimationFrame(() => setTimeout(() => window.print(), 50));
}
