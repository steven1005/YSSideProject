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
    const slider = document.getElementById('slider-9-btnGet');
    const sw = document.getElementById('switch-9-btnGet');
    const res = document.getElementById('slider-result-9-btnGet');

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

    const chipSet = document.getElementById('chip-set-demo');
    const display = document.getElementById('status-content');

    if (chipSet && display) {
        // 監聽點擊事件
        chipSet.addEventListener('click', (e) => {
            const chip = e.target.closest('md-filter-chip');
            if (!chip) return;

            // 使用 setTimeout 確保在元件屬性切換完成後才抓取數值
            setTimeout(() => {
                const selectedList = Array.from(chipSet.querySelectorAll('md-filter-chip[selected]'))
                    .map(c => c.label);

                display.innerHTML = `
                    <span style="color: #64ffda;">> 最後點擊:</span> "${chip.label}" <br>
                    <span style="color: #64ffda;">> 該標籤狀態:</span> ${chip.selected ? 'Selected (已選)' : 'Unselected (未選)'} <br>
                    <span style="color: #ffb86c;">> 目前所有選中:</span> [ ${selectedList.join(', ')} ]
                `;
            }, 50);
        });

        // 監聽移除事件
        chipSet.addEventListener('remove', (e) => {
            display.innerHTML = `<span style="color: #ff5555;">> 事件: 標籤 "${e.target.label}" 已從集合中移除</span>`;
        });
    }
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

// 章節8：監聽DIALOG事件
document.addEventListener('DOMContentLoaded', () => {
    // 取得顯示區域
    const statusText = document.getElementById('dialog-status-text');

    // --- 1. 處理刪除確認 ---
    const diagDelete = document.getElementById('dialog-delete');
    // 請確認你的 HTML 裡 md-dialog 的 id 是不是 dialog-delete

    if (diagDelete) {
        diagDelete.addEventListener('close', () => {
            const action = diagDelete.returnValue; // 取得按鈕的 value ("delete" 或 "cancel")

            if (action === 'delete') {
                statusText.innerHTML = `<span style="color: #ff5555;">> [刪除成功] 已執行刪除動作 (returnValue: ${action})</span>`;
            } else {
                statusText.innerHTML = `<span style="color: #888;">> [取消] 使用者點擊了取消</span>`;
            }
        });
    }

    // --- 2. 處理登入輸入 ---
    const diagLogin = document.getElementById('dialog-login');
    if (diagLogin) {
        diagLogin.addEventListener('close', () => {
            const action = diagLogin.returnValue;
            if (action === 'login') {
                // 改用 ID 取值，最穩定
                const user = document.getElementById('login-user').value;
                const pass = document.getElementById('login-pass').value;
                statusText.innerHTML = `
                    <span style="color: #64ffda;">> [登入成功]</span><br>
                    帳號：${user || '未填'}<br>
                    密碼：${pass || '未填'}
                `;
                // 清空輸入框
                document.getElementById('login-user').value = '';
                document.getElementById('login-pass').value = '';
            } else {
                statusText.innerHTML = `<span style="color: #ffb86c;">> [登入取消] 使用者未提交</span>`;
            }
        });
    }

    // 章節9：即時監聽滑桿與開關
    const slider = document.getElementById('slider-9-realtime');
    const sliderText = document.getElementById('slider-val-text-realtime');
    const sw = document.getElementById('switch-9-realtime');
    const swText = document.getElementById('switch-val-text-realtime');
    const log = document.getElementById('realtime-log-9-realtime');

    // 監聽滑桿 (使用 input 事件達成即時跳動)
    slider.addEventListener('input', () => {
        sliderText.textContent = slider.value;
        log.innerHTML = `Value: ${slider.value}`;
    });

    // 監聽開關 (使用 change 事件)
    sw.addEventListener('change', () => {
        const status = sw.selected ? 'ON (開啟)' : 'OFF (關閉)';
        swText.textContent = status;
        log.innerHTML = `Switch: ${status}`;
    });

    // 章節10：更新 Scaffold 顯示內容
    const fab = document.getElementById('scaffold-fab-btn');
    if (fab) {
        fab.addEventListener('click', () => alert('點擊了新增！'));
    }
});

// 章節10：更新 Scaffold 顯示內容
function updateScaffold(title, text) {
    const titleEl = document.getElementById('scaffold-display-title');
    const contentEl = document.getElementById('scaffold-display-content');
    const logEl = document.getElementById('scaffold-debug-log');

    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.innerHTML = `<p>${text}</p>`;
    if (logEl) logEl.innerText = `> 目前分頁: ${title}`;

    console.log('頁面切換成功:', title);
}

// 章節11：處理 Checkbox 與 Radio 的選取狀態
document.addEventListener('DOMContentLoaded', () => {
    const selectionLog = document.getElementById('selection-log');

    // 1. 處理 Checkbox 多選
    const checkboxes = document.querySelectorAll('.interest-check');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateSelectionOutput);
    });

    // 2. 處理 Radio 單選
    const radios = document.querySelectorAll('md-radio[name="gender-group"]');
    radios.forEach(rd => {
        rd.addEventListener('change', updateSelectionOutput);
    });

    function updateSelectionOutput() {
        // 抓取所有被勾選的興趣
        const selectedInterests = Array.from(checkboxes)
            .filter(i => i.checked)
            .map(i => i.value);

        // 抓取目前選中的性別
        const selectedGender = Array.from(radios)
            .find(r => r.checked)?.value || '未選擇';

        // 更新日誌顯示
        if (selectionLog) {
            selectionLog.innerHTML = `
                <span style="color: #64ffda;">> 興趣:</span> [${selectedInterests.join(', ') || '無'}] <br>
                <span style="color: #64ffda;">> 性別:</span> ${selectedGender}
            `;
        }
    }

    // 初始化顯示一次
    updateSelectionOutput();
});