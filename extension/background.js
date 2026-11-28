/**
 * RecallOS Chrome Extension - Background Service Worker with Privacy Guard & Supabase Cloud Sync
 */

const SUPABASE_URL = 'https://yqhkhvgmpjrwuotyfauv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NrbmEAlxUFLkHxMgWHSyXQ_UnXQiafU';

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

// Push captured session directly to Supabase Cloud Database
async function syncToSupabase(session) {
  try {
    const payload = {
      id: session.id || ('ext-' + Date.now()),
      title: session.title || 'Captured Learning Session',
      url: session.url || '',
      platform: session.platform || 'LeetCode',
      domain: session.platform?.includes('LeetCode') ? 'Data Structures & Algorithms' : 'Frontend Engineering',
      tags: session.tags || ['learning', 'captured-session'],
      time_spent_mins: session.timeSpentMins || 30,
      summary: session.notes || 'Captured via RecallOS Chrome Extension',
      extracted_concepts: session.extractedConcepts || ['Core Principles'],
      mastery_score: 70,
      status: 'Reviewing',
      notes: session.notes || ''
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/resources`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('Successfully synced session to Supabase cloud!');
      return { success: true };
    } else {
      const errText = await res.text();
      console.warn('Supabase sync returned non-200:', errText);
      return { success: false, error: errText };
    }
  } catch (err) {
    console.error('Supabase cloud sync error:', err);
    return { success: false, error: err.message };
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('RecallOS Screen & Learning Capture Extension installed with Privacy Guard & Cloud Sync.');
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

    if (isRestrictedUrl(session?.url)) {
      sendResponse({ success: false, error: 'Cannot save session from restricted private domain.' });
      return true;
    }

    // 1. Sync directly to Supabase cloud database
    syncToSupabase(session).then((syncResult) => {
      // 2. Also keep local copy in chrome.storage.local
      chrome.storage.local.get(['recallos_sessions'], (result) => {
        const existing = result.recallos_sessions || [];
        const updated = [session, ...existing];
        chrome.storage.local.set({ recallos_sessions: updated }, () => {
          sendResponse({
            success: true,
            total: updated.length,
            cloudSynced: syncResult.success
          });
        });
      });
    });

    return true;
  }
});
