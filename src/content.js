// Create container for our React app
const container = document.createElement("div");
container.id = "accessibility-widget-root";
container.style.position = "fixed";
container.style.bottom = "20px";
container.style.right = "20px";
container.style.zIndex = "999999";
container.style.pointerEvents = "auto";
document.body.appendChild(container);

// Function to inject scripts
const injectScript = (file) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(file);
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Initialize the app
const init = async () => {
  try {
    await injectScript("static/js/main.js");
    console.log("Accessibility Widget initialized");
  } catch (error) {
    console.error("Error initializing Accessibility Widget:", error);
  }
};

init();
