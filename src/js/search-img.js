import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40977106-cc638815c8129760ea3020b74';

async function searchImg(searchTerm, page, perPage) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchTerm,
    page: page,
    per_page: perPage,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  return axios.get(`${BASE_URL}?${params}`).then(({ data }) => data);
}
export { searchImg };
