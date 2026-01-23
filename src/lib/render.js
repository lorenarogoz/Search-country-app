import { countryId } from "./storage.js";

export function renderLoading(container) {
  container.textContent = 'Loading...';
}

export function renderError(container, message) {
  container.textContent = message;
}

export function renderCountry(container, country, opts = {}) {

  const { isFav = false, onToggleFav } = opts;
  const card = document.createElement('div');
  card.className = 'country-card';
  const img = document.createElement('img');
  img.src = country.flags.png;
  img.alt = country.flags.alt || `Flag of ${country.name.common}`;
  const info = document.createElement('div');
  const name = document.createElement('h2');
  name.textContent = country.name.common;
  const capital = document.createElement('p');
  capital.textContent = `Capital: ${country.capital ? country.capital[0] : '—'}`;
  const favBtn = document.createElement('button');
  favBtn.dataset.id = countryId(country);
  favBtn.setAttribute('aria-pressed', String(isFav));
  favBtn.type='button';
  favBtn.className = `fav-btn${isFav ? ' is-fav' : ''}`;
  favBtn.setAttribute('aria-label', isFav ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} from favorites`);
  favBtn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
  favBtn.textContent= isFav ? '★' : '☆';
     
  favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onToggleFav === 'function') {
      onToggleFav(country, (nextIsFav) => {
        favBtn.classList.toggle('is-fav', nextIsFav);
        favBtn.setAttribute('aria-pressed', String(nextIsFav));
        favBtn.title = nextIsFav ? 'Remove from favorites' : 'Add to favorites';
        favBtn.textContent = nextIsFav ? '★' : '☆';
      });
    }
  });

  info.appendChild(name);
  info.appendChild(capital);
  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(favBtn)
  container.appendChild(card);
}


export function renderHistory(container, items, onClick) {
  container.innerHTML = '';
  if (!items.length) return;
  const list = document.createElement('div');
  list.className = 'history-list';
  items.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'history-item';
    chip.textContent = item;
    chip.addEventListener('click', () => onClick(item));
    list.appendChild(chip);
  });
  container.appendChild(list);
}


export function renderFavorites(container, favorites, onRemove) {
  container.innerHTML = '';

  const section = document.createElement('div');
  section.className = 'favorites';

  const title = document.createElement('h2');
  title.id = 'favorites-title';
  title.className = 'favorites-title';
  title.textContent = '⭐ Favorites';
  section.appendChild(title);

  if (!favorites.length) {
    const empty = document.createElement('p');
    empty.className = 'favorites-empty';
    empty.textContent = 'No favorites yet.';
    section.appendChild(empty);
    container.appendChild(section);
    return;
  }

  const list = document.createElement('div');
  list.className = 'favorites-list-cards';

  favorites.forEach(f => {
    const card = document.createElement('div');
    card.className = 'country-card';

    const img = document.createElement('img');
    img.src = f.flagPng || '';             
    img.alt = f.flagAlt || `Flag of ${f.name}`;
    img.width = 64;
    img.height = 42;

    const info = document.createElement('div');

    const name = document.createElement('h2');
    name.textContent = f.name || 'Unknown';

    /*const capital = document.createElement('p');
    capital.textContent = `Capital: ${f.capital || '—'}`;
    */
    info.appendChild(name);
    //info.appendChild(capital);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'favorites-remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => onRemove?.(f.id));

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(removeBtn);
    list.appendChild(card);
  });

  section.appendChild(list);
  container.appendChild(section);
}

