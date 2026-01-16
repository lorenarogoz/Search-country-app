import UI from './lib/ui.js';
export const App = () => {
    const inputEl = document.getElementById('country-input');
    const searchBtn = document.getElementById('search-btn');
    const resultEl = document.getElementById('result');

    const ui = new UI(inputEl, searchBtn, resultEl);
    ui.bindEvents();
} 