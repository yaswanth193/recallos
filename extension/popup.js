const RESTRICTED_DOMAINS = [
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

function isUrlRestricted(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return RESTRICTED_DOMAINS.some(domain => lower.includes(domain)) ||
         lower.includes('/login') ||
         lower.includes('/signin') ||
         lower.includes('/checkout');
}

document.addEventListener('DOMContentLoaded', () => {
  let currentTab = null;
  let capturedScreenshotData = null;

  const platformPill = document.getElementById('platform-pill');
  const pageTitle = document.getElementById('page-title');
  const previewText = document.getElementById('preview-text');
  const screenshotImg = document.getElementById('screenshot-img');
  const captureBtn = document.getElementById('capture-screen-btn');
  const saveBtn = document.getElementById('save-session-btn');
  const openAppBtn = document.getElementById('open-app-btn');
  const noteInput = document.getElementById('learning-note');
  const successBanner = document.getElementById('success-banner');
  const privacyShieldBanner = document.getElementById('privacy-shield-banner');

  // 1. Detect active tab details & verify privacy restrictions
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      currentTab = tabs[0];
      const url = currentTab.url || '';
      pageTitle.innerText = currentTab.title || 'Untitled Web Page';

      // PRIVACY SHIELD CHECK:
      if (isUrlRestricted(url)) {
        privacyShieldBanner.style.display = 'block';
        platformPill.innerText = '🛡️ Restricted Tab (Privacy Protected)';
        platformPill.classList.add('restricted');
        
        // Disable screen capture and session save to guarantee zero leaks
        captureBtn.disabled = true;
        captureBtn.innerText = '🔒 Capture Blocked on Private Site';
        saveBtn.disabled = true;
        saveBtn.innerText = '🔒 Session Save Disabled';
        noteInput.disabled = true;
        noteInput.placeholder = 'Notes disabled on messaging / private account tabs';
        previewText.innerText = '🛡️ Privacy Guard: WhatsApp, Instagram, and sensitive account pages cannot be captured.';
        return;
      }

      // Educational platform categorization
      let platform = 'Web Document';
      if (url.includes('youtube.com')) platform = 'YouTube Tutorial';
      else if (url.includes('leetcode.com')) platform = 'LeetCode Problem';
      else if (url.includes('medium.com')) platform = 'Medium Article';
      else if (url.includes('developer.mozilla.org')) platform = 'MDN Documentation';
      else if (url.includes('github.com')) platform = 'GitHub Repository';
      else if (url.includes('coursera.org')) platform = 'Coursera Course';
      else if (url.includes('stackoverflow.com')) platform = 'StackOverflow';

      platformPill.innerText = platform;
    }
  });

  // 2. Capture screen via background worker
  captureBtn.addEventListener('click', () => {
    if (currentTab && isUrlRestricted(currentTab.url)) {
      alert('Privacy Guard: Screen capture is not permitted on private messaging or sensitive pages.');
      return;
    }

    captureBtn.innerText = 'Capturing screen...';
    captureBtn.disabled = true;

    chrome.runtime.sendMessage({ action: 'CAPTURE_SCREEN' }, (response) => {
      captureBtn.innerText = '📸 Re-Capture Screen';
      captureBtn.disabled = false;

      if (response && response.success && response.screenshotUrl) {
        capturedScreenshotData = response.screenshotUrl;
        screenshotImg.src = response.screenshotUrl;
        screenshotImg.style.display = 'block';
        previewText.style.display = 'none';
      } else {
        alert(response?.error || 'Could not capture screen. Ensure you are on an educational web page.');
      }
    });
  });

  // 3. Save learning session to RecallOS Knowledge Vault
  saveBtn.addEventListener('click', () => {
    if (!currentTab || isUrlRestricted(currentTab.url)) {
      alert('Cannot save session from restricted site.');
      return;
    }

    const sessionPayload = {
      id: 'ext-' + Date.now(),
      title: currentTab.title || 'Captured Learning Session',
      url: currentTab.url,
      platform: platformPill.innerText,
      notes: noteInput.value.trim() || 'Captured via RecallOS Screen Extension',
      screenshot: capturedScreenshotData || null,
      capturedAt: new Date().toISOString(),
      timeSpentMins: 30,
    };

    saveBtn.innerText = 'Saving to Vault...';
    saveBtn.disabled = true;

    chrome.runtime.sendMessage(
      { action: 'SAVE_LEARNING_SESSION', payload: sessionPayload },
      (response) => {
        saveBtn.innerText = '✓ Saved to Knowledge Vault';
        successBanner.style.display = 'block';
        setTimeout(() => {
          window.close();
        }, 1500);
      }
    );
  });

  // 4. Open RecallOS Web Dashboard
  openAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://yaswanth193.github.io/recallos/' });
  });
});
