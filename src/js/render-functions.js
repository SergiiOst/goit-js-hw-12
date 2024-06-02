import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = null;

export function renderImages(images, container) {
  const markup = images
    .map(
      image => `
    <a href="${image.largeImageURL}" class= "gallery-item">
      <img src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" class="gallery-img" />
      <div class="info">
      <p>Likes <br>${image.likes}</p>
      <p>Views <br>${image.views}</p>
      <p>Comments <br>${image.comments}</p>
      <p>Downloads <br>${image.downloads}</p>
      </div>
    </a>
  `
    )
    .join('');
  container.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a');
  } else {
    lightbox.refresh();
  }
}

export function clearContainer(container) {
  container.innerHTML = '';
}
