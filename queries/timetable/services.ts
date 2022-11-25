import axios from 'axios';

// const BASE_URL = 'http://localhost:3000/api/timetable';
const BASE_URL = '/api/timetable';
const MAJOR_MAP_URL = 'majorMap';
const USER_POST_URL = 'user/post';
const USER_GET_URL = 'user/get';
const USER_DELETE_URL = 'user/delete';
const STATISTICS_GET_URL = 'statistics/get';
const FEED_GET_URL = 'feed/get';

export const majorMapService = axios.create({
  baseURL: `${BASE_URL}/${MAJOR_MAP_URL}/`,
});

export const userPostService = axios.create({
  baseURL: `${BASE_URL}/${USER_POST_URL}/`,
});

export const userGetService = axios.create({
  baseURL: `${BASE_URL}/${USER_GET_URL}/`,
});

export const userDeleteService = axios.create({
  baseURL: `${BASE_URL}/${USER_DELETE_URL}/`,
});

export const statisticsGetService = axios.create({
  baseURL: `${BASE_URL}/${STATISTICS_GET_URL}/`,
});

export const feedGetService = axios.create({
  baseURL: `${BASE_URL}/${FEED_GET_URL}/`,
});
