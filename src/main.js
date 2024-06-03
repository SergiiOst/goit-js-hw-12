import { fetchImages } from './js/pixabay-api.js';
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

searchForm.addEventListener('submit', async e => {
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

  try {
    const data = await fetchImages(query, page);
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
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again!',
      closeOnClick: true,
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
    searchForm.reset();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';
  loadMoreBtn.classList.add('btn-load-hidden');

  try {
    const data = await fetchImages(query, page);
    renderImages(data.hits, container);
    const card = document.querySelector('.gallery-item');
    const cardHeight = card.getBoundingClientRect().height;
    window.scrollBy({
      left: 0,
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (page * 15 >= totalHits) {
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
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again!',
      closeOnClick: true,
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
  }
});
