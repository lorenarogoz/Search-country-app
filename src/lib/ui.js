
import { fetchCountriesByName } from './data.js';
import { renderCountry, renderError, renderLoading, renderHistory, renderFavorites } from './render.js';
import { addToHistory, getHistory, isFavorite, toggleFavorite, getFavorites, removeFavorite, countryId } from './storage.js';

export default class UI {
  constructor(inputEl, searchBtn, resultEl) {
    this.inputEl = inputEl;
    this.searchBtn = searchBtn;
    this.resultEl = resultEl;
    this.formEl = document.getElementById('country-search-form');
    this.historyEl = document.getElementById('history');
    this.favoritesEl = document.getElementById('favorites');
    this.loading = false;
  }

  bindEvents() {
    if (this.formEl) {
      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        this.search();
      });
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.search());
    }

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.search();
      }
    });

    this.updateHistory();
    this.updateFavorites();
  }

  async search() {
    if (this.loading) return;

    const raw = (this.inputEl.value || '').trim();
    if (raw.length < 3) {
      renderError(this.resultEl, 'Type at least 3 characters.');
      this.clearResultsState();
      return;
    }

    this.loading = true;
    this.resultEl.setAttribute('aria-busy', 'true');
    if (this.searchBtn) this.searchBtn.disabled = true;
    renderLoading(this.resultEl);

    try {
      const list = await fetchCountriesByName(raw);
      this.resultEl.innerHTML = '';
      list.forEach((country) => {
        const id = countryId(country);
        const fav = isFavorite(id);
        renderCountry(this.resultEl, country, {
          isFav: fav,
          onToggleFav: (c, setState) => {
            toggleFavorite(c);
            const next = isFavorite(id);
            setState(next);
            this.updateFavorites();
          },
        });
      });
      addToHistory(raw);
      this.updateHistory();

      const firstCard = this.resultEl.querySelector('.country-card');
      if (firstCard) {
        firstCard.setAttribute('tabindex', '-1');
        firstCard.focus();
      }
    } catch (err) {
      renderError(
        this.resultEl,
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      this.resultEl.setAttribute('aria-busy', 'false');
      if (this.searchBtn) this.searchBtn.disabled = false;
      this.loading = false;
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

  updateFavorites() {
    if (!this.favoritesEl) return;
    const favs = getFavorites();
    renderFavorites(this.favoritesEl, favs, (id) => {
      removeFavorite(id);
      this.updateFavorites();
      this.refreshStarButtons();
    });
  }

  refreshStarButtons() {
    const favIdSet = new Set(getFavorites().map((f) => f.id));
    this.resultEl.querySelectorAll('.fav-btn').forEach((btn) => {
      const id = btn.dataset?.id;
      if (!id) return;
      const shouldBeFav = favIdSet.has(id);
      btn.classList.toggle('is-fav', shouldBeFav);
      btn.setAttribute('aria-pressed', String(shouldBeFav));
      btn.title = shouldBeFav ? 'Remove from favorites' : 'Add to favorites';
      btn.textContent = shouldBeFav ? '★' : '☆';
    });
  }

  clearResultsState() {
    this.resultEl.setAttribute('aria-busy', 'false');
    if (this.searchBtn) this.searchBtn.disabled = false;
    this.loading = false;
  }
}
