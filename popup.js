import { initAuth } from './js/auth.js';
import { initUIHandlers } from './js/ui.js';
import { initClipboardHandlers } from './js/clipboard.js';
import { initLanguageSelector } from './js/language.js';
import { isConnected } from './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  isConnected();
  initAuth();
  initClipboardHandlers();
  initUIHandlers();
  initLanguageSelector();
});
