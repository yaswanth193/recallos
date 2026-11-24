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

  // 1. Detect active tab details
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      currentTab = tabs[0];
      pageTitle.innerText = currentTab.title || 'Untitled Web Page';

      const url = currentTab.url || '';
      let platform = 'Web Document';
      if (url.includes('youtube.com')) platform = 'YouTube Tutorial';
      else if (url.includes('leetcode.com')) platform = 'LeetCode Problem';
      else if (url.includes('medium.com')) platform = 'Medium Article';
      else if (url.includes('developer.mozilla.org')) platform = 'MDN Documentation';
      else if (url.includes('github.com')) platform = 'GitHub Repository';
      else if (url.includes('coursera.org')) platform = 'Coursera Course';

      platformPill.innerText = platform;
    }
  });

  // 2. Capture screen via background worker
  captureBtn.addEventListener('click', () => {
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
        alert('Could not capture screen: ' + (response?.error || 'Ensure you are on a standard web page.'));
      }
    });
  });

  // 3. Save learning session to RecallOS
  saveBtn.addEventListener('click', () => {
    if (!currentTab) return;

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

  // 4. Open RecallOS Web App
  openAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://yaswanth193.github.io/recallos/' });
  });
});
