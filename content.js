(async () => {
  const { imageRules } = await chrome.storage.sync.get(['imageRules']);
  const domain = window.location.hostname;
  const rules = imageRules?.[domain] || [];

  rules.forEach(filename => {
    document.querySelectorAll(`img[src$="${filename}"]`).forEach(img => img.style.display = 'none');
  });
})();