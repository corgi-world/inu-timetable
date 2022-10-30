import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/auth';
const SIGNUP_URL = 'signup';

export const signupService = axios.create({
  baseURL: `${BASE_URL}/${SIGNUP_URL}/`,
});
