import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImg } from './js/search-img';
import { createMarkup } from './js/create-markup';

let onlightbox = new SimpleLightbox('.img_wrap a');
const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  // btn: document.querySelector('.load-more'),
};
// const { form, gallery, btn } = refs;
const { form, gallery } = refs;
const perPage = 40;
let searchTerm = '';
let page = 0;
const param1 = {
  position: 'top-right',
  timeout: 3000,
  width: '400px',
  fontSize: '30px',
};

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  page = 0;
  gallery.innerHTML = '';
  searchTerm = event.currentTarget.searchQuery.value.trim().toLowerCase();
  if (searchTerm === '') {
    Notiflix.Notify.info('Enter your request, please!', param1);
    return;
  }
  page += 1;
  window.removeEventListener('scroll', nextPage);

  searchImg(searchTerm, page, perPage)
    .then(data => {
      const results = data.hits;
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          param1
        );
      } else {
        Notiflix.Notify.info(`Found ${data.totalHits} results.`, param1);
        gallery.innerHTML = createMarkup(results);
        onlightbox.refresh();
      }
      if (data.totalHits > perPage) {
        // btn.classList.remove('hidden');
        window.addEventListener('scroll', nextPage);
      }
    })
    .catch(onSearchError);

  // btn.addEventListener('click', clickLoadMore);

  event.currentTarget.reset();
}

function clickLoadMore() {
  page += 1;
  searchImg(searchTerm, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfPage = Math.ceil(data.totalHits / perPage);

      gallery.insertAdjacentHTML('beforeend', createMarkup(searchResults));

      if (page > numberOfPage) {
        // btn.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results.",
          param1
        );
        // btn.removeEventListener('click', clickLoadMore);
        window.removeEventListener('scroll', nextPage);
      }
      onlightbox.refresh();
    })
    .catch(onSearchError);
}

function onSearchError() {
  Notiflix.Notify.failure('Something went wrong! Please try again.', param1);
}

function nextPage() {
  const totalHeight = window.innerHeight + window.scrollY;
  if (totalHeight >= document.documentElement.scrollHeight) {
    clickLoadMore();
  }
}
