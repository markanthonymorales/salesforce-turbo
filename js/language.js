export function updateLanguage(lang) {
  const locale = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
  fetch(locale).then(res => res.json()).then(msgs => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (typeof msgs[key] != 'undefined') {
        el.textContent = msgs[key]?.message;
      }
    });
  });
}

export function initLanguageSelector() {
  chrome.storage.sync.get("lang", ({ lang }) => {
    if (lang) document.getElementById("languageSelector").value = lang;
    updateLanguage(lang || "en");
  });

  document.getElementById("languageSelector").addEventListener("change", e => {
    const lang = e.target.value;
    chrome.storage.sync.set({ lang });
    updateLanguage(lang);
  });
}
