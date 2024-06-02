import axios from 'axios';
import { renderImages } from './render-functions.js';

const container = document.querySelector('.gallery');
let page = 1;

export async function fetchImages(query, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '43954842-86e0551d49d52b31999082e7b',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  });

  const url = `${BASE_URL}?${params}`;
  const response = await axios.get(url);
  return response.data;
}

export async function onLoadMore(query) {
  page += 1;
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

    return data;
  } catch (error) {
    alert(error.message);
  }
}
