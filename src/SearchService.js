
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40461807-ebea3baaa711ea52e01789531';

async function searchService(currentPage, searchQuery) {
  const parameters = new URLSearchParams({
    key: API_KEY,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    per_page: '40',
    q: searchQuery,
    page: currentPage,
  });

  return axios.get(`${BASE_URL}?${parameters}`);
}

export { searchService };
