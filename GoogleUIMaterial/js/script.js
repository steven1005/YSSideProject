// 複製完整 HTML (章節 1 專用)
function copyFullHtml() {
    const label = document.querySelector('.editor-label');
    let text = label.innerText.trim();

    text = text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerText = '已複製！';
        setTimeout(() => btn.innerText = '複製完整 HTML', 2000);
    }).catch(err => console.error('複製失敗', err));
}

// 章節 3: 取得姓名
function getNameValue() {
    const field = document.getElementById('name-field-3');
    const result = document.getElementById('name-result-3');
    const value = field.value.trim();

    if (!value) {
        alert('請輸入姓名！');
        return;
    }
    result.innerHTML = `你好，<span style="color:var(--md-sys-color-primary, #d0bcff)">${value}</span>！`;
}

// 章節 9: 取得滑桿與開關狀態
function getSliderAndSwitch() {
    const slider = document.getElementById('slider-9');
    const sw = document.getElementById('switch-9');
    const res = document.getElementById('slider-result-9');

    // Material Web 中，Switch 的狀態屬性是 .selected (boolean)
    // Slider 的數值是 .value (number)
    res.innerHTML = `
        <span style="color:#afffb2">Value:</span> ${slider.value} <br>
        <span style="color:#afffb2">Status:</span> ${sw.selected ? 'ON (開啟)' : 'OFF (關閉)'}
    `;
}

// 通用複製 (其他章節的 copy-btn)
function copyToClipboard(btn) {
    const textarea = btn.parentElement.querySelector('.code-textarea');
    if (!textarea) return;

    const text = textarea.value; // 直接取原始文字

    navigator.clipboard.writeText(text).then(() => {
        btn.innerText = '已複製！';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerText = '複製';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => console.error('複製失敗', err));
}

// 在 script.js 內更新此邏輯
const updatePreview = (wrapper, value) => {
    const section = wrapper.closest('.code-section');
    if (section) {
        const preview = section.nextElementSibling;
        if (preview && preview.classList.contains('preview-area')) {
            preview.innerHTML = value;

            // 💡 技巧：確保動態產生的 Material Components 屬性被正確讀取
            // 對於 md-icon-button，如果預覽區顯示不對，可以手動強制更新一次屬性
            preview.querySelectorAll('md-icon-button[toggle]').forEach(btn => {
                if (btn.hasAttribute('selected')) btn.selected = true;
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.editor-wrapper').forEach(wrapper => {
        const textarea = wrapper.querySelector('.code-textarea');
        const pre = wrapper.querySelector('pre.prism-highlight');
        if (!textarea || !pre) return;

        const codeElement = pre.querySelector('code');
        let rawText = codeElement ? codeElement.textContent : pre.textContent;
        textarea.value = rawText.trim();

        const type = textarea.dataset.type;

        const updateHighlight = () => {
            const highlighted = Prism.highlight(textarea.value, Prism.languages[type], type);
            if (codeElement) {
                codeElement.innerHTML = highlighted;
            } else {
                pre.innerHTML = highlighted;
            }
            textarea.style.height = 'auto';
            textarea.style.height = pre.scrollHeight + 'px';
        };

        // --- 【新增：初始化預覽邏輯】 ---
        if (type === 'html') {
            const section = wrapper.closest('.code-section');
            if (section) {
                // 尋找緊鄰 code-section 後方的 preview-area
                const preview = section.nextElementSibling;
                if (preview && preview.classList.contains('preview-area')) {
                    preview.innerHTML = textarea.value;
                }
            }
        }
        // ------------------------------

        // 在 DOMContentLoaded 的迴圈中調用
        textarea.addEventListener('input', () => {
            updateHighlight();
            if (type === 'html') {
                updatePreview(wrapper, textarea.value);
            }
        });

        // 初始化時也要跑一次
        if (type === 'html') {
            updatePreview(wrapper, textarea.value);
        }

        updateHighlight();
    });
});

// 加入 script.js
document.querySelectorAll('md-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        // 等待元件更新狀態後檢查
        setTimeout(() => {
            console.log(`${chip.label} 是否被選中: ${chip.selected}`);
        }, 0);
    });
});