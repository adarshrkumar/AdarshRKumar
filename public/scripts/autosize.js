import autosize from 'https://cdn.skypack.dev/autosize@v4.0.2';

// Autosize anything in the DOM on page load
document.querySelectorAll("textarea[autosize]").forEach(autosize);

// Setup observer to autosize anything after page load
new MutationObserver(mutations => {
  Array.from(mutations).forEach(mutation => {
    Array.from(mutation.addedNodes).forEach(node => {
      if (node.matches("textarea[autosize]")) {
        autosize(node);
      }
    });
  });
}).observe(document.body, { childList: true });