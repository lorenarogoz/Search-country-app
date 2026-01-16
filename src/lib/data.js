
export async function fetchCountryByName(name) {
  const query = (name || '').trim();
  if (!query) {
    throw new Error('Please enter a country name.');
  }

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('No results found.');
      }
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No results found.');
    }

    
    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

    const q = normalize(query);

    
    const match = data.find(country => {
      const names = [
        country.name?.common,
        country.name?.official,
        ...(country.altSpellings || [])
      ]
        .filter(Boolean)
        .map(normalize);

      return names.some(n => n.startsWith(q));
    });

    if (!match) {
      throw new Error(`No country starting with "${name}".`);
    }

    return match;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    throw new Error(message);
  }
}
