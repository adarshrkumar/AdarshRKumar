import autosize from 'https://cdn.skypack.dev/autosize@v4.0.2';

// Autosize anything in the DOM on page load
document.querySelectorAll("textarea[autosize]")
  .forEach(autosize);

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

// Simulate injecting new <textarea> nodes
setTimeout(() => {
  const t1 = document.createElement("textarea");
  t1.setAttribute("autosize", true);
  t1.innerHTML = "Injected after page load. Will auto resize."
  document.body.appendChild(t1);
  
  const t2 = document.createElement("textarea");
  t2.innerHTML = "Injected after page load. Will NOT auto resize."
  document.body.appendChild(t2);
}, 1000)