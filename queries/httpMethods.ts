import { AxiosInstance } from 'axios';

export function get(service: AxiosInstance, queryString = '') {
  return service.get(queryString).then((response) => response.data);
}

export function post<T>(service: AxiosInstance, data: unknown) {
  return service.post<T>('', data);
}

export function put(service: AxiosInstance, queryString = '', data: unknown) {
  return service.put(queryString, data);
}

export function _delete<T>(service: AxiosInstance, queryString = '') {
  return service.delete<T>(queryString);
}
