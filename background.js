chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'auto-hide-image',
    title: 'Auto-hide this image on this site',
    contexts: ['image']
  });

  chrome.contextMenus.create({
    id: 'toggle-auto-hide',
    title: 'Toggle auto-hide on this page',
    contexts: ['all']
  });

  chrome.contextMenus.create({
    id: 'restore-hidden-images',
    title: 'Restore hidden images (this page)',
    contexts: ['all']
  });
});

// Listen for a message from the content script to check if hiding is enabled
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === 'isAutoHideEnabled') {
    chrome.storage.session.get(['disabledTabs']).then(data => {
      const disabledTabs = data.disabledTabs || [];
      const isEnabled = !disabledTabs.includes(sender.tab.id);
      sendResponse({ enabled: isEnabled });
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

// Clear the disabled tab from session storage when it's closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.get(['disabledTabs'], (data) => {
    const disabledTabs = data.disabledTabs || [];
    const index = disabledTabs.indexOf(tabId);
    if (index > -1) {
      disabledTabs.splice(index, 1);
      chrome.storage.session.set({ disabledTabs });
    }
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const domain = new URL(info.pageUrl).hostname;

  if (info.menuItemId === 'auto-hide-image') {
    const url = new URL(info.srcUrl);
    const filename = url.pathname.split('/').pop();

    const data = await chrome.storage.sync.get(['imageRules']);
    const rules = data.imageRules || {};

    if (!rules[domain]) rules[domain] = [];
    if (!rules[domain].includes(filename)) {
      rules[domain].push(filename);
    }

    await chrome.storage.sync.set({ imageRules: rules });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (filename) => {
        document.querySelectorAll(`img[src$="${filename}"]`).forEach(img => {
          img.style.display = 'none';
          img.setAttribute('data-hidden-by-extension', 'true');
        });
      },
      args: [filename]
    });
  }

  if (info.menuItemId === 'toggle-auto-hide') {
    const { disabledTabs = [] } = await chrome.storage.session.get(['disabledTabs']);
    const tabId = tab.id;
    const isDisabled = disabledTabs.includes(tabId);

    if (isDisabled) {
      // Enable it: remove from disabled list
      const newDisabledTabs = disabledTabs.filter(id => id !== tabId);
      await chrome.storage.session.set({ disabledTabs: newDisabledTabs });
      // Re-apply hiding rules
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      console.log(`Auto-hide enabled for tab ${tabId}`);

    } else {
      // Disable it: add to disabled list
      disabledTabs.push(tabId);
      await chrome.storage.session.set({ disabledTabs });
       // Restore images
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.querySelectorAll('img[data-hidden-by-extension="true"]').forEach(img => {
            img.style.display = '';
            img.removeAttribute('data-hidden-by-extension');
          });
        }
      });
      console.log(`Auto-hide disabled for tab ${tabId}`);
    }
  }

  if (info.menuItemId === 'restore-hidden-images') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelectorAll('img[data-hidden-by-extension="true"]').forEach(img => {
          img.style.display = '';
          img.removeAttribute('data-hidden-by-extension');
        });
      }
    });
  }
});