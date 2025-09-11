import autosize from 'https://cdn.skypack.dev/autosize@v4.0.2';

const selector = 'textarea[autosize]';
const supportsFieldSizing = CSS.supports('field-sizing', 'content');

if (supportsFieldSizing) {
    const style = document.createElement('style');
    style.textContent = `
        ${selector} {
            field-sizing: content;
        }
    `;
    document.head.appendChild(style);
} else {
    document.querySelectorAll(selector).forEach(autosize);
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches(selector)) {
                    autosize(node);
                }
            });
        });
    }).observe(document.body, { childList: true });
}
