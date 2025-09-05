$(document).ready(function() {
    // --- Part 1: Transform all <pre> blocks into <textarea> editors ---
    $('.html-code, .jquery-code').each(function() {
        const $codeBlock = $(this).find('pre');
        let codeText = '';

        // Handle blocks with and without an inner <code> tag
        if ($codeBlock.find('code').length) {
            codeText = $codeBlock.find('code').text();
        } else {
            codeText = $codeBlock.text();
        }

        // HTML in <pre><code> is encoded, so we need to decode it for the textarea
        const decodedText = $('<textarea/>').html(codeText).val();

        const $textarea = $('<textarea class="code-editor"></textarea>');
        $textarea.val(decodedText.trim());

        // Replace the <pre> block with the new <textarea>
        $codeBlock.replaceWith($textarea);
    });


    // --- Part 2: Add interactive "Run Example" functionality ---
    $('.row.code-example').each(function(index) {
        const sectionId = index + 1;
        $(this).attr('data-example-id', sectionId);

        // Find the newly created textareas
        $(this).find('.html-code textarea').attr('id', `html-editor-${sectionId}`);
        $(this).find('.jquery-code textarea').attr('id', `jquery-editor-${sectionId}`);

        const controls = $(`
            <div class="text-center my-3">
                <button class="btn btn-primary run-code-btn" data-target-id="${sectionId}">執行範例</button>
            </div>
            <div class="result-area-container p-3 border rounded" style="min-height: 100px;">
                <div class="result-area-content" id="result-area-${sectionId}"></div>
            </div>
            <hr class="my-5" style="border-top: 1px solid #495057;">
        `);
        $(this).after(controls);
    });

    // Event handler for all run buttons
    $('body').on('click', '.run-code-btn', function() {
        const sectionId = $(this).data('target-id');
        
        // Now we get the value from the textareas
        const htmlCode = $(`#html-editor-${sectionId}`).val();
        const jsCode = $(`#jquery-editor-${sectionId}`).val();
        const $resultArea = $(`#result-area-${sectionId}`);

        // Reset the result area and inject the new HTML
        $resultArea.html(htmlCode);
        
        if (jsCode && jsCode.trim()) {
             try {
                const script = document.createElement('script');
                script.textContent = jsCode;
                $resultArea.append(script);
            } catch (e) {
                $resultArea.prepend(`<div class="alert alert-danger">JavaScript Error: ${e.message}</div>`);
                console.error(`Error executing script for section ${sectionId}:`, e);
            }
        }
    });
});