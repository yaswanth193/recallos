/**
 * RecallOS Chrome Extension - Background Service Worker (v1.2.0)
 * Features:
 * 1. Automatic background learning tracking on LeetCode, YouTube, MDN, GitHub
 * 2. Strict Privacy Guard against messaging & passwords (WhatsApp, Instagram, Banking)
 * 3. Direct PostgreSQL Cloud Sync into Supabase database
 * 4. Automatic live notification to open RecallOS web tabs
 */

const SUPABASE_URL = 'https://yqhkhvgmpjrwuotyfauv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NrbmEAlxUFLkHxMgWHSyXQ_UnXQiafU';

// Privacy Guard blocklist - NEVER track or read these
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
  'chase.com',
  'bank',
  'login',
  'signin',
  'checkout',
  'chrome://',
  'edge://',
];

function isRestrictedUrl(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return RESTRICTED_PATTERNS.some(pat => lower.includes(pat));
}

// In-memory cache to prevent duplicate inserts for the same URL in a 10-minute window
const capturedUrlsCache = new Map();

// Helper to push resource directly to Supabase cloud
async function syncToSupabase(resourcePayload) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/resources`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(resourcePayload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✓ RecallOS: Synced to Supabase cloud successfully:', data);

      // Notify any open RecallOS web tabs to refresh live!
      notifyOpenRecallOSTabs();

      return { success: true, data };
    } else {
      const errText = await res.text();
      console.warn('RecallOS Supabase sync warning:', errText);
      return { success: false, error: errText };
    }
  } catch (err) {
    console.error('RecallOS Supabase network error:', err);
    return { success: false, error: err.message };
  }
}

// Notify open RecallOS web dashboard tabs
function notifyOpenRecallOSTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && (tab.url.includes('recallos') || tab.url.includes('localhost:5173'))) {
        chrome.tabs.sendMessage(tab.id, { action: 'NEW_LEARNING_RESOURCE_SYNCED' }).catch(() => {
          // Tab may not have content script ready, safe to ignore
        });
      }
    });
  });
}

// Extract clean title and metadata from URL
function detectLearningPlatform(url, title) {
  const lower = url.toLowerCase();

  if (lower.includes('leetcode.com/problems/')) {
    // Extract problem slug from URL
    const match = url.match(/problems\/([^\/]+)/);
    const slug = match ? match[1].replace(/-/g, ' ') : 'Problem';
    const cleanTitle = title && !title.includes('LeetCode') ? title : `LeetCode: ${slug.toUpperCase()}`;

    return {
      isEducational: true,
      platform: 'LeetCode',
      domain: 'Data Structures & Algorithms',
      title: cleanTitle,
      tags: ['dsa', 'leetcode', 'algorithms', 'problem-solving'],
      timeSpentMins: 35,
      summary: `Practicing algorithmic problem solving on LeetCode: ${cleanTitle}`,
      extractedConcepts: ['Algorithm Invariant', 'Time Complexity O(N)'],
    };
  }

  if (lower.includes('youtube.com/watch')) {
    return {
      isEducational: true,
      platform: 'YouTube',
      domain: 'Frontend Engineering',
      title: title || 'YouTube Video Lecture',
      tags: ['youtube', 'video-tutorial', 'concepts'],
      timeSpentMins: 45,
      summary: `Studied video lecture: ${title}`,
      extractedConcepts: ['Video Lecture Notes', 'Practical Walkthrough'],
    };
  }

  if (lower.includes('developer.mozilla.org')) {
    return {
      isEducational: true,
      platform: 'MDN Docs',
      domain: 'Web Architecture',
      title: title || 'MDN Web Specification',
      tags: ['mdn', 'web-apis', 'javascript', 'specs'],
      timeSpentMins: 30,
      summary: `Consulted official MDN documentation: ${title}`,
      extractedConcepts: ['Web API Standards', 'Browser Specifications'],
    };
  }

  if (lower.includes('github.com')) {
    return {
      isEducational: true,
      platform: 'GitHub',
      domain: 'Software Engineering',
      title: title || 'GitHub Codebase',
      tags: ['github', 'open-source', 'code-review'],
      timeSpentMins: 30,
      summary: `Inspecting repository code and architecture on GitHub: ${title}`,
      extractedConcepts: ['Source Architecture', 'Version Control'],
    };
  }

  if (lower.includes('geeksforgeeks.org')) {
    return {
      isEducational: true,
      platform: 'GeeksforGeeks',
      domain: 'Computer Science',
      title: title || 'GeeksforGeeks Article',
      tags: ['gfg', 'cs-fundamentals', 'dsa'],
      timeSpentMins: 25,
      summary: `Read computer science article on GfG: ${title}`,
      extractedConcepts: ['CS Core Fundamentals'],
    };
  }

  return { isEducational: false };
}

// 1. AUTOMATIC BACKGROUND LEARNING DETECTOR (tabs.onUpdated)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only trigger once the page finishes loading and has a valid URL
  if (changeInfo.status !== 'complete' || !tab.url) return;

  // STRICT PRIVACY GUARD: Never process restricted/private tabs
  if (isRestrictedUrl(tab.url)) return;

  // Check if it's an educational learning site
  const platformInfo = detectLearningPlatform(tab.url, tab.title);
  if (!platformInfo.isEducational) return;

  // Prevent re-capturing the same URL within 10 minutes
  const now = Date.now();
  const lastCaptureTime = capturedUrlsCache.get(tab.url);
  if (lastCaptureTime && now - lastCaptureTime < 600000) {
    return; // Already recorded recently
  }
  capturedUrlsCache.set(tab.url, now);

  // Show visual badge on extension icon: "AUTO" in green
  chrome.action.setBadgeText({ text: 'AUTO', tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#10B981', tabId });

  console.log(`[RecallOS Auto-Tracker] Detected ${platformInfo.platform} session on tab:`, tab.url);

  // Create database payload
  const resourcePayload = {
    id: 'res-auto-' + Date.now(),
    title: platformInfo.title,
    url: tab.url,
    platform: platformInfo.platform,
    domain: platformInfo.domain,
    tags: platformInfo.tags,
    time_spent_mins: platformInfo.timeSpentMins,
    summary: platformInfo.summary,
    extracted_concepts: platformInfo.extractedConcepts,
    mastery_score: 70,
    status: 'Reviewing',
    notes: `Automatically recorded by RecallOS Learning Tracker on ${new Date().toLocaleDateString()}`,
  };

  // Sync to Supabase PostgreSQL database
  const result = await syncToSupabase(resourcePayload);

  // Update badge to checkmark '✓' for 3 seconds to indicate success
  if (result.success) {
    chrome.action.setBadgeText({ text: '✓', tabId });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '', tabId });
    }, 4000);
  }
});

// 2. MANUAL CAPTURE & POPUP MESSAGES
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CAPTURE_SCREEN') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs && tabs[0];
      if (!activeTab || !activeTab.url) {
        sendResponse({ success: false, error: 'No active tab found.' });
        return;
      }

      if (isRestrictedUrl(activeTab.url)) {
        sendResponse({
          success: false,
          error: '🛡️ Privacy Guard: Screen capture is strictly blocked on messaging apps and private accounts.',
        });
        return;
      }

      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true, screenshotUrl: dataUrl });
        }
      });
    });
    return true;
  }

  if (request.action === 'SAVE_LEARNING_SESSION') {
    const session = request.payload;

    if (isRestrictedUrl(session?.url)) {
      sendResponse({ success: false, error: 'Cannot save session from restricted private domain.' });
      return true;
    }

    const payload = {
      id: session.id || ('ext-' + Date.now()),
      title: session.title || 'Captured Learning Session',
      url: session.url || '',
      platform: session.platform || 'LeetCode',
      domain: session.platform?.includes('LeetCode')
        ? 'Data Structures & Algorithms'
        : 'Frontend Engineering',
      tags: ['learning', 'captured-session'],
      time_spent_mins: session.timeSpentMins || 30,
      summary: session.notes || 'Captured via RecallOS Chrome Extension',
      extracted_concepts: ['Core Principles', 'Problem Solving'],
      mastery_score: 75,
      status: 'Reviewing',
      notes: session.notes || '',
    };

    syncToSupabase(payload).then((res) => {
      sendResponse({ success: true, cloudSynced: res.success });
    });

    return true;
  }
});
