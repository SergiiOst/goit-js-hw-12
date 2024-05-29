import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearContainer } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.search-form');
  const input = document.querySelector('.search-input');
  const container = document.querySelector('.gallery');
  const loader = document.getElementById('loader');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim();

    if (query === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query',
        backgroundColor: '#EF4040',
        closeOnClick: true,
        position: 'topRight',
      });
      return;
    }

    clearContainer(container);
    loader.style.display = 'block';

    fetchImages(query)
      .then(data => {
        loader.style.display = 'none';

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
      })
      .catch(error => {
        loader.style.display = 'none';
        console.error('Error fetching images:', error);
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
        input.value = '';
      });
  });
});
