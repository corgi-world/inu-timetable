import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/timetable';
const MAJORMAP_URL = 'majorMap';

export const majorMapService = axios.create({
  baseURL: `${BASE_URL}/${MAJORMAP_URL}/`,
});
