import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import getRefs from './get-refs';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let name = e.target.value;
  if (!name) {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(createMarkup)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createMarkup(data) {
  if (data.length > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (data.length >= 3 && data.length < 10) {
    refs.info.innerHTML = '';
    refs.list.innerHTML = data
      .map(item => {
        return `<li><img src=${item.flags.svg} width = 40px, height = 30px></img><span class="preview-country">${item.name.official}</span></li>`;
      })
      .join('');
    return;
  }
  refs.list.innerHTML = '';
  const country = data[0];
  refs.info.innerHTML = `<div class = 'wrapper'><img src=${
    country.flags.svg
  } width = 40px, height = 30px></img><span class = 'name'>${
    country.name.official
  }</span></div>
  <p>Capital: <span class = 'span-info'>${country.capital}</span></p>
  <p>Population: <span class = 'span-info'>${country.population}</span></p>
  <p>Languages: <span class = 'span-info'>${Object.values(
    country.languages
  )}</span></p>
    `;
}
