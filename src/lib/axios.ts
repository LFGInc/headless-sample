import axios, { AxiosResponse } from "axios";

export class LfgAxios {
  static async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: D,
  ): Promise<R> {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error?.response?.data;
      } else {
        throw new Error("Got a different error than axios");
      }
    }
  }
}
