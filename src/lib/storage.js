
const KEY = 'country_search_history';
const MAX = 10;
const CACHE_KEY = 'country_cache_by_name';
const FAV_KEY = 'country_favorites_v1';

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(v => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function addToHistory(countryName) {
  const value = (countryName || '').trim();
  if (!value) return getHistory();
  let history = getHistory();
  const lower = value.toLowerCase();
  history = history.filter(item => item.toLowerCase() !== lower);
  history.unshift(value);
  history = history.slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(history));
  return history;
}

export function getCachedCountries(name) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    const key = (name || '').toLowerCase();
    const value = cache[key];
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

export function setCachedCountries(name, countries) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    const key = (name || '').toLowerCase();
    cache[key] = countries;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export function countryId(country) {
  return (
    country?.cca3 ||
    country?.cca2 ||
    country?.ccn3 ||
    country?.name?.common || ''
  );
}

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  } catch {}
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.some(f => f.id === id);
}

export function addFavorite(country) {
  const id = countryId(country);
  if (!id) return getFavorites();
  const favs = getFavorites();
  if (favs.some(f => f.id === id)) return favs;

  const entry = {
    id,
    name: country?.name?.common || '',
    languages: Object.values(country?.languages || {}), 
    flagPng: country?.flags?.png || '',
    flagAlt: country?.flags?.alt || `Flag of ${country?.name?.common || ''}`,
    //capital: Array.isArray(country?.capital) && country.capital.length ? country.capital[0] : '—',
  };


  favs.push(entry);
  saveFavorites(favs);
  return favs;
}

export function removeFavorite(id) {
  const favs = getFavorites().filter(f => f.id !== id);
  saveFavorites(favs);
  return favs;
}

export function toggleFavorite(country) {
  const id = countryId(country);
  if (!id) return getFavorites();
  if (isFavorite(id)) {
    return removeFavorite(id);
  }
  return addFavorite(country);
}
