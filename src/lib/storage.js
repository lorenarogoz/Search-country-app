
const KEY = 'country_search_history';
const MAX = 10;
const CACHE_KEY = 'country_cache_by_name';

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
