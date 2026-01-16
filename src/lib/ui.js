
import { fetchCountryByName } from './data.js';
import {
  renderCountry,
  renderError,
  renderLoading,
  renderHistory
} from './render.js';
import { addToHistory, getHistory } from './storage.js';

export default class UI {
  constructor(inputEl, searchBtn, resultEl) {
    this.inputEl = inputEl;
    this.searchBtn = searchBtn;
    this.resultEl = resultEl;
    this.historyEl = document.getElementById('history');
  }

  bindEvents() {
    
    this.searchBtn.addEventListener('click', () => this.search());

    
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.search();
    });

    
    this.updateHistory();
  }

  async search() {
    const raw = (this.inputEl.value || '').trim();

    
    if (raw.length < 3) {
      renderError(this.resultEl, 'Type at least 3 characters.');
      return;
    }

    
    const query = raw;

    renderLoading(this.resultEl);

    try {
      const country = await fetchCountryByName(query);
      renderCountry(this.resultEl, country);
      addToHistory(country?.name?.common || raw);
      this.updateHistory();
    } catch (err) {
      renderError(
        this.resultEl,
        err instanceof Error ? err.message : 'Something went wrong.'
      );
      console.error(err);
    }
  }

  updateHistory() {
    if (!this.historyEl) return;

    const items = getHistory();

    renderHistory(this.historyEl, items, (value) => {
      this.inputEl.value = value;
      this.search();
    });
  }
}
