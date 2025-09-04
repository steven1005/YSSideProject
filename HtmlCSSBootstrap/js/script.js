// 等待 DOM 完全載入後執行
$(document).ready(function () {
    // 獲取所有相關的 jQuery 元素物件
    const $htmlInput = $('#htmlInput');
    const $cssInput = $('#cssInput');
    const $jsInput = $('#jsInput');
    const $updatePreviewBtn = $('#updatePreviewBtn');
    const $runJsInPreviewBtn = $('#runJsInPreviewBtn');
    const $previewOutput = $('#previewOutput');

    /**
     * @function updatePreview
     * @description 讀取 HTML 和 CSS 輸入，並將其渲染到結果區塊。
     *注意：JS 程式碼不會在此時執行，只會被加載。
     */
    function updatePreview() {
        const htmlCode = $htmlInput.val();
        const cssCode = $cssInput.val();
        const jsCode = $jsInput.val(); // 獲取 JS 程式碼，但此時不執行

        // 清空結果區塊內容，避免重複渲染
        $previewOutput.empty();

        // 創建 <style> 標籤並添加 CSS
        const $styleElement = $('<style>').text(cssCode);

        // 創建 <div> 容器並添加 HTML
        const $html = $('<div>').html(htmlCode);

        // 將 <style> 和 HTML 內容添加到預覽區塊
        // <style> 必須在 HTML 之前才能正確應用樣式
        $previewOutput.append($styleElement).append($html);

        // 將 JS 程式碼儲存到一個 data 屬性中，供 '運行 JS' 按鈕使用
        $runJsInPreviewBtn.data('jsCode', jsCode);

        console.log("預覽已更新 (HTML & CSS)。JS 程式碼已加載，等待點擊 '運行 JavaScript'。");
    }

    /**
     * @function runJavaScript
     * @description 獲取並執行儲存在按鈕 data 屬性中的 JavaScript 程式碼。
     *注意：這會在瀏覽器當前頁面的上下文中執行，請小心使用。
     */
    function runJavaScript() {
        const jsCodeToRun = $runJsInPreviewBtn.data('jsCode');

        if (jsCodeToRun) {
            try {
                // 創建一個新的 <script> 標籤並將 JS 程式碼放入其中
                // 將其添加到 previewOutput，這樣 JS 就能操作結果區塊內的元素
                const $scriptElement = $('<script>').text(jsCodeToRun);
                $previewOutput.append($scriptElement);

                console.log("JavaScript 程式碼已運行。");
                // 執行後移除 script 標籤，防止重複執行或污染 DOM
                $scriptElement.remove();
            } catch (e) {
                alert("JavaScript 執行錯誤：\n" + e.message);
                console.error("JavaScript 執行錯誤：", e);
            }
        } else {
            console.log("沒有 JavaScript 程式碼可供運行。");
        }
    }

    // 綁定「更新預覽 (HTML & CSS)」按鈕的點擊事件
    $updatePreviewBtn.on('click', updatePreview);

    // 綁定「運行 JavaScript」按鈕的點擊事件
    $runJsInPreviewBtn.on('click', runJavaScript);

    // 頁面載入時，自動執行一次預覽，顯示初始範例效果
    updatePreview();
});