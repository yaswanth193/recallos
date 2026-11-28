/**
 * RecallOS Chrome Extension - Background Service Worker with Privacy Guard
 * Handles screen capture via chrome.tabs.captureVisibleTab with domain validation.
 */

const RESTRICTED_PATTERNS = [
  'whatsapp.com',
  'instagram.com',
  'facebook.com',
  'messenger.com',
  'telegram.org',
  'discord.com',
  'mail.google.com',
  'outlook.com',
  'accounts.google.com',
  'paypal.com',
  'bank',
  'chrome://',
  'edge://',
];

function isRestrictedUrl(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return RESTRICTED_PATTERNS.some(pat => lower.includes(pat));
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('RecallOS Screen & Learning Capture Extension installed with Privacy Guard.');
});

// Listen for capture requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CAPTURE_SCREEN') {
    // 1. Check current active tab to ensure it's not a private messaging or auth page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs && tabs[0];
      if (!activeTab || !activeTab.url) {
        sendResponse({ success: false, error: 'No active tab found.' });
        return;
      }

      if (isRestrictedUrl(activeTab.url)) {
        sendResponse({
          success: false,
          error: '🛡️ Privacy Guard: Screen capture is strictly blocked on messaging apps (WhatsApp, Instagram) and sensitive accounts to protect your private chats and credentials.'
        });
        return;
      }

      // Capture visible tab as PNG
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error('Screen capture error:', chrome.runtime.lastError.message);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true, screenshotUrl: dataUrl });
        }
      });
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'SAVE_LEARNING_SESSION') {
    const session = request.payload;

    // Secondary check: Never save session if URL is restricted
    if (isRestrictedUrl(session?.url)) {
      sendResponse({ success: false, error: 'Cannot save session from restricted private domain.' });
      return true;
    }

    // Save to chrome.storage.local
    chrome.storage.local.get(['recallos_sessions'], (result) => {
      const existing = result.recallos_sessions || [];
      const updated = [session, ...existing];
      chrome.storage.local.set({ recallos_sessions: updated }, () => {
        sendResponse({ success: true, total: updated.length });
      });
    });
    return true;
  }
});
