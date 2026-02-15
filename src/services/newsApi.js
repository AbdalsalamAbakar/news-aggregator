import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY; 
const BASE_URL = 'https://newsapi.org/v2';

export const fetchTopHeadlines = async (category = 'general', page = 1) => {
  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: {
      category,
      page,
      apiKey: API_KEY,
      country: 'us',
      pageSize: 10,
    },
  });
  return response.data;
};

export const searchNews = async (query, page = 1) => {
  const response = await axios.get(`${BASE_URL}/everything`, {
    params: {
      q: query,
      page,
      apiKey: API_KEY,
      pageSize: 10,
    },
  });
  return response.data;
};