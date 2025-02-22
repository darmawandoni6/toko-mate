import { toast } from 'react-toastify';

import { ResponseAPI } from '../global-types';
import { config } from './base';

export class HttpFetch {
  readonly baseUrl: string;
  private readonly initDefault: RequestInit;
  private init: RequestInit;
  private option: RequestInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.initDefault = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    this.init = this.initDefault;
    this.option = {};
  }

  static init() {
    const http = new HttpFetch(`${config.baseUrl}/api-v1`);
    return http;
  }

  async request<T>(url: string): Promise<ResponseAPI<T>> {
    try {
      const res = await fetch(this.baseUrl + url, this.init);

      const data: ResponseAPI<T> = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      this.init = this.initDefault;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      toast.error(message);
      throw error;
    }
  }

  async GET<R, P = { [k: string]: unknown }>(url: string, options?: { params: P }): Promise<R> {
    this.option = {
      method: 'GET',
    };
    if (options && options.params) {
      url =
        url +
        '?' +
        new URLSearchParams(Object.entries(options.params).map(([key, value]) => [key, String(value)])).toString();
    }
    this.init = { ...this.init, ...this.option };
    const { data } = await this.request<R>(url);

    return data;
  }
  async POST<R, P>(
    url: string,
    payload: P,
    options: Pick<RequestInit, 'headers'> & { json?: boolean } = { json: true },
  ): Promise<R | null> {
    this.option = {
      method: 'POST',
      ...(payload ? { body: options.json ? JSON.stringify(payload) : (payload as BodyInit) } : {}),
    };
    if (options.headers) {
      this.option.headers = options.headers;
    }

    this.init = { ...this.init, ...this.option };
    const { data } = await this.request<R>(url);
    return data;
  }
  async PATCH<T>(url: string, payload: T) {
    this.option = {
      method: 'PATCH',
      body: JSON.stringify(payload),
    };
    this.init = { ...this.init, ...this.option };
    await this.request(url);
  }
  async PUT<T>(url: string, payload: T) {
    this.option = {
      method: 'PUT',
      body: JSON.stringify(payload),
    };
    this.init = { ...this.init, ...this.option };
    await this.request(url);
  }
  async DELETE<T>(url: string, payload?: T) {
    this.option = {
      method: 'DELETE',
    };
    if (payload) {
      this.option.body = JSON.stringify(payload);
    }

    this.init = { ...this.init, ...this.option };
    await this.request(url);
  }
}
