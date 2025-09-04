

// --- Other functions (updatePreview, runJS) ---
// These functions still need corresponding HTML elements (like textareas) to work.
// If you are no longer using them, you can remove them.
function updatePreview(cssId, htmlId, viewId) {
    const css = document.getElementById(cssId)?.value || '';
    const html = document.getElementById(htmlId)?.value || '';
    const preview = document.getElementById(viewId);
    if (preview) {
        preview.innerHTML = `<style>${css}</style>${html}`;
    }
}

function runJS() {
    const jsCode = document.getElementById('jsInput')?.value;
    if (jsCode) {
        try {
            new Function(jsCode)();
        } catch (err) {
            alert("執行錯誤：" + err.message);
        }
    }
}
