import { AxiosInstance, AxiosResponse } from 'axios';

export function get(service: AxiosInstance, queryString = '') {
  return service
    .get(queryString)
    .then((response: AxiosResponse<any, any>) => response.data);
}

export function post(service: AxiosInstance, data: unknown) {
  return service.post('', data);
}

export function put(service: AxiosInstance, queryString = '', data: unknown) {
  return service.put(queryString, data);
}

export function _delete(service: AxiosInstance, queryString = '') {
  return service.delete(queryString);
}
