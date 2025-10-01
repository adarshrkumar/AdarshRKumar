// Load autosize library dynamically
const loadAutosize = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.skypack.dev/autosize@v4.0.2';
        script.onload = () => {
            // Access autosize from global scope
            const autosize = window.autosize || window.default;
            resolve(autosize);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

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
    // Load autosize and initialize
    loadAutosize().then(autosize => {
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
    }).catch(error => {
        console.error('Failed to load autosize library:', error);
    });
}
