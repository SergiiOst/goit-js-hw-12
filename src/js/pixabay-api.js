import axios from 'axios';

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
