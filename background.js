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
        document.querySelectorAll(`img[src$="${filename}"]`).forEach(img => img.style.display = 'none');
      },
      args: [filename]
    });
  }

  if (info.menuItemId === 'toggle-auto-hide') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.autoHideEnabled = !window.autoHideEnabled;
        alert(`Auto-hide is now ${window.autoHideEnabled ? 'enabled' : 'disabled'}`);
      }
    });
  }

  if (info.menuItemId === 'restore-hidden-images') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelectorAll('img[style*="display: none"]').forEach(img => img.style.display = '');
      }
    });
  }
});