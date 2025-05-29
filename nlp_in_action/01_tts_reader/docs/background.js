// Minimal background service worker for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Distraction-Free TTS Reader extension installed.');
});
