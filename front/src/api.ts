import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5131', // Certifique-se de que a URL está correta
});

export default api; 