
import { fetchCountriesByName } from './data.js';
import { renderCountry, renderError, renderLoading, renderHistory, renderResults } from './render.js';
import { addToHistory, getHistory } from './storage.js';

export default class UI {
  constructor(inputEl, searchBtn, resultEl) {
    this.inputEl = inputEl;
    this.searchBtn = searchBtn;
    this.resultEl = resultEl;
    this.historyEl = document.getElementById('history');
    this.results = [];
    this.activeIndex = -1;
    this._onDocKeyDown = (e) => this.onKeyDown(e);
  }

  bindEvents() {
    this.searchBtn.addEventListener('click', () => this.search());
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.search();
      }
    });
    this.updateHistory();
  }

  async search() {
    const raw = (this.inputEl.value || '').trim();
    if (raw.length < 3) {
      renderError(this.resultEl, 'Type at least 3 characters.');
      this.clearResultsState();
      return;
    }
    renderLoading(this.resultEl);
    try {
      const list = await fetchCountriesByName(raw);
      if (list.length === 1) {
        const country = list[0];
        renderCountry(this.resultEl, country);
        addToHistory(country?.name?.common || raw);
        this.updateHistory();
        this.clearResultsState();
        return;
      }
      this.results = list;
      this.activeIndex = 0;
      this.updateResultsUI();
      this.enableKeyboardNav();
    } catch (err) {
      renderError(this.resultEl, err instanceof Error ? err.message : 'Something went wrong.');
      this.clearResultsState();
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

  updateResultsUI() {
    renderResults(this.resultEl, this.results, this.activeIndex, (index) => {
      const country = this.results[index];
      if (!country) return;
      renderCountry(this.resultEl, country);
      addToHistory(country?.name?.common || (this.inputEl.value || '').trim());
      this.updateHistory();
      this.clearResultsState();
    });
    this.highlightActive();
    this.scrollActiveIntoView();
  }

  highlightActive() {
    const items = this.resultEl.querySelectorAll('.result-item');
    items.forEach((el, i) => {
      if (i === this.activeIndex) {
        el.classList.add('active');
        el.setAttribute('aria-selected', 'true');
        el.setAttribute('tabindex', '0');
      } else {
        el.classList.remove('active');
        el.setAttribute('aria-selected', 'false');
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  scrollActiveIntoView() {
    const items = this.resultEl.querySelectorAll('.result-item');
    if (!items.length) return;
    const el = items[this.activeIndex];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  onKeyDown(e) {
    
    if (!this.results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.results.length;
      this.highlightActive();
      this.scrollActiveIntoView();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.results.length) % this.results.length;
      this.highlightActive();
      this.scrollActiveIntoView();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const country = this.results[this.activeIndex];
      if (!country) return;
      renderCountry(this.resultEl, country);
      addToHistory(country?.name?.common || (this.inputEl.value || '').trim());
      this.updateHistory();
      this.clearResultsState();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.clearResultsState();
      this.resultEl.innerHTML = '';
    }
  }

  enableKeyboardNav() {
    document.addEventListener('keydown', this._onDocKeyDown);
  }

  disableKeyboardNav() {
    document.removeEventListener('keydown', this._onDocKeyDown);
  }

  clearResultsState() {
    this.results = [];
    this.activeIndex = -1;
    this.disableKeyboardNav();
  }
}
