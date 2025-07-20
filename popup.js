document.addEventListener('DOMContentLoaded', async () => {
  await renderRules();

  document.getElementById('clear-all').addEventListener('click', clearAllRules);
});

async function renderRules() {
  const container = document.getElementById('rules-container');
  const clearAllBtn = document.getElementById('clear-all');
  container.innerHTML = '';

  const { imageRules } = await chrome.storage.sync.get(['imageRules']) || {};
  const domains = Object.keys(imageRules || {});

  if (domains.length === 0) {
    container.innerHTML = '<div class="no-rules">No rules set</div>';
    clearAllBtn.style.display = 'none';
    return;
  }

  clearAllBtn.style.display = 'block';

  domains.forEach(domain => {
    const section = document.createElement('div');
    section.className = 'domain-section';

    const domainTitle = document.createElement('div');
    domainTitle.className = 'domain-name';
    domainTitle.textContent = domain;
    section.appendChild(domainTitle);

    imageRules[domain].forEach(filename => {
      const item = document.createElement('div');
      item.className = 'image-item';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = filename;
      item.appendChild(nameSpan);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => removeRule(domain, filename));
      item.appendChild(removeBtn);

      section.appendChild(item);
    });

    container.appendChild(section);
  });
}

async function removeRule(domain, filename) {
  const { imageRules } = await chrome.storage.sync.get(['imageRules']) || {};
  if (!imageRules[domain]) return;

  imageRules[domain] = imageRules[domain].filter(f => f !== filename);
  if (imageRules[domain].length === 0) delete imageRules[domain];

  await chrome.storage.sync.set({ imageRules });
  await renderRules();
}

async function clearAllRules() {
  if (confirm('Are you sure you want to clear all rules?')) {
    await chrome.storage.sync.set({ imageRules: {} });
    await renderRules();
  }
}