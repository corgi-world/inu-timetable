import { AxiosInstance, AxiosResponse } from 'axios';

export function get(service: AxiosInstance, queryString = '') {
  return service
    .get(queryString)
    .then((response: AxiosResponse<any, any>) => response.data);
}

export function post<T>(service: AxiosInstance, data: unknown) {
  return service.post<T>('', data);
}

export function put(service: AxiosInstance, queryString = '', data: unknown) {
  return service.put(queryString, data);
}

export function _delete(service: AxiosInstance, queryString = '') {
  return service.delete(queryString);
}
