
export function renderLoading(container) {
  container.textContent = 'Loading...';
}

export function renderError(container, message) {
  container.textContent = message;
}


export function renderCountry(container, country) {
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'country-card';

  const img = document.createElement('img');
  img.src = country.flags.png;
  img.alt = country.flags.alt || `Flag of ${country.name.common}`;

  const name = document.createElement('h2');
  name.textContent = country.name.common;

  const capital = document.createElement('p');
  capital.textContent = `Capital: ${
    country.capital ? country.capital[0] : '—'
  }`;

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(capital);

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

    chip.addEventListener('click', () => {
      onClick(item);
    });

    list.appendChild(chip);
  });

  container.appendChild(list);
}


