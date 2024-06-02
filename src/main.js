import { fetchImages, onLoadMore } from './js/pixabay-api.js';
import { renderImages, clearContainer } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.btn-load');
const loader = document.querySelector('#loader');
const container = document.querySelector('.gallery');

let query = '';
let page = 1;
let totalHits = 0;

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  query = e.currentTarget.elements.query.value.trim();
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query',
      backgroundColor: '#EF4040',
      closeOnClick: true,
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearContainer(container);
  loadMoreBtn.classList.add('btn-load-hidden');
  loader.style.display = 'block';

  fetchImages(query, page)
    .then(data => {
      totalHits = data.totalHits;
      if (data.hits.length === 0) {
        iziToast.warning({
          title: 'No Results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          backgroundColor: '#EF4040',
          closeOnClick: true,
          position: 'topRight',
          maxWidth: 432,
        });
        return;
      }
      renderImages(data.hits, container);
      if (totalHits > 15) {
        loadMoreBtn.classList.remove('btn-load-hidden');
      }
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images. Please try again later.',
        backgroundColor: '#EF4040',
        closeOnClick: true,
        position: 'topRight',
        maxWidth: 432,
      });
    })
    .finally(() => {
      loader.style.display = 'none';
      searchForm.reset();
    });
});

loadMoreBtn.addEventListener('click', () => {
  loader.style.display = 'block';
  loadMoreBtn.classList.add('btn-load-hidden');
  onLoadMore(query)
    .then(data => {
      page += 1;
      if (page * 15 >= data.totalHits) {
        loadMoreBtn.classList.add('btn-load-hidden');
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          backgroundColor: '#B8E3FF',
          closeOnClick: true,
          position: 'topRight',
          maxWidth: 432,
        });
      } else {
        loadMoreBtn.classList.remove('btn-load-hidden');
      }
    })
    .finally(() => {
      loader.style.display = 'none';
    });
});
