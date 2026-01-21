
import { getCachedCountries, setCachedCountries } from "./storage.js";

export async function fetchCountriesByName(name) {
  const query = (name || '').trim();
  if (!query) throw new Error('Please enter a country name.');
  const cached = getCachedCountries(query);
  if (cached) return cached;

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error('No results found.');
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('No results found.');

  const normalize = (str) =>
    String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

  const q = normalize(query);

  const starts = data.filter(country => {
    const names = [
      country.name?.common,
      country.name?.official,
      ...(country.altSpellings || [])
    ].filter(Boolean).map(normalize);
    return names.some(n => n.startsWith(q));
  });

  const includes = starts.length ? [] : data.filter(country => {
    const names = [
      country.name?.common,
      country.name?.official,
      ...(country.altSpellings || [])
    ].filter(Boolean).map(normalize);
    return names.some(n => n.includes(q));
  });

  const results = (starts.length ? starts : includes).slice(0, 10);
  if (!results.length) throw new Error('No results found.');
  setCachedCountries(query, results);
  return results;
}
