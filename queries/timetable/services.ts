import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/timetable';
const MAJOR_MAP_URL = 'majorMap';
const USER_POST_URL = 'user/post';

export const majorMapService = axios.create({
  baseURL: `${BASE_URL}/${MAJOR_MAP_URL}/`,
});

export const userPostService = axios.create({
  baseURL: `${BASE_URL}/${USER_POST_URL}/`,
});
