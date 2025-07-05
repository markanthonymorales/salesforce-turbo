document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  let htmlEditors = document.querySelectorAll('.editorHtml');
  let cssEditors = document.querySelectorAll('.editorCss');
  let jsEditors = document.querySelectorAll('.editorJs');

  /**
      * Handle input events on our fields
      * @param  {Event}  event The event object
      */
  function inputHandler(event) {

    // Check if the input event happened on any of our editor fields
    const isHtmlEditor = Array.from(htmlEditors).includes(event.target);
    const isCssEditor = Array.from(cssEditors).includes(event.target);
    const isJsEditor = Array.from(jsEditors).includes(event.target);

    if (!(isHtmlEditor || isCssEditor || isJsEditor)) {
      return;
    }

    // Clone text into pre immediately
    let code = event.target.previousElementSibling.firstChild;
    if (!code) return;
    code.textContent = event.target.value;

    // Highlight the syntax
    // Assuming Prism.highlightElement can handle the code from any editor
    Prism.highlightElement(code);
  }

  // Listen for input events
  document.addEventListener('input', inputHandler);
});