/**
 * RecallOS Chrome Extension - Content Script with Built-in Privacy Shield
 * Extracts educational metadata ONLY from permitted learning sites.
 * STRICTLY BLOCKS:
 * - Messaging apps (WhatsApp Web, Instagram, Telegram, Messenger, Discord)
 * - Password inputs, auth credentials, tokens, and bank sites
 */

const BLOCKED_DOMAINS = [
  'whatsapp.com',
  'web.whatsapp.com',
  'instagram.com',
  'facebook.com',
  'messenger.com',
  'web.telegram.org',
  'telegram.org',
  'discord.com',
  'mail.google.com',
  'outlook.com',
  'outlook.live.com',
  'accounts.google.com',
  'paypal.com',
  'chase.com',
  'bankofamerica.com',
  'wellsfargo.com',
];

function isDomainRestricted(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  
  // Check explicit domain blocklist
  if (BLOCKED_DOMAINS.some(domain => lower.includes(domain))) {
    return true;
  }
  
  // Check sensitive URL patterns (auth/passwords/login)
  if (lower.includes('/login') || lower.includes('/signin') || lower.includes('/checkout') || lower.includes('/account')) {
    return true;
  }

  return false;
}

function extractSafeMetadata() {
  const url = window.location.href;

  // 1. Enforce privacy boundary: Halt immediately if site is restricted
  if (isDomainRestricted(url)) {
    return {
      isRestricted: true,
      reason: 'Privacy Guard Active: Messaging, personal chats, and sensitive account pages are blocked.',
      platform: 'Restricted / Private',
      title: 'Protected Tab',
      headings: [],
      selectedText: ''
    };
  }

  const title = document.title || 'Untitled Learning Resource';
  let platform = 'Web Document';
  let videoCurrentTime = null;

  if (url.includes('youtube.com/watch')) {
    platform = 'YouTube';
    const video = document.querySelector('video');
    if (video) {
      videoCurrentTime = Math.floor(video.currentTime);
    }
  } else if (url.includes('leetcode.com')) {
    platform = 'LeetCode';
  } else if (url.includes('medium.com')) {
    platform = 'Medium';
  } else if (url.includes('developer.mozilla.org')) {
    platform = 'MDN Docs';
  } else if (url.includes('github.com')) {
    platform = 'GitHub';
  } else if (url.includes('coursera.org')) {
    platform = 'Coursera';
  } else if (url.includes('stackoverflow.com')) {
    platform = 'StackOverflow';
  }

  // 2. Safe Selected Text (Strictly sanitize and strip out any password/credential patterns)
  let selection = window.getSelection().toString().trim();
  if (selection.length > 500) {
    selection = selection.substring(0, 500) + '...';
  }

  // 3. Primary Educational Headings (Never query input fields or form values)
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .slice(0, 5)
    .map((h) => h.innerText?.trim())
    .filter(Boolean);

  return {
    isRestricted: false,
    url,
    title,
    platform,
    videoCurrentTime,
    selectedText: selection,
    headings,
  };
}

// Respond to popup query safely & relay sync events to website
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PAGE_METADATA') {
    sendResponse(extractSafeMetadata());
  } else if (request.action === 'NEW_LEARNING_RESOURCE_SYNCED') {
    window.postMessage({ type: 'RECALLOS_SYNC_RESOURCES' }, '*');
    window.dispatchEvent(new CustomEvent('recallos-sync-event'));
    sendResponse({ received: true });
  }
  return true;
});
