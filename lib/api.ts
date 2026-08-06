import axios, { AxiosError, AxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  }
}

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
  headers: {   //istek atarken header eklemek için kullanılır. Örn: token, Content-Type, Accept vs.
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(  //ınterceptors ise Axios isteğinde sunucudan gelen yanıt; içinde status kodları, header bilgileri ve asıl verinin (data) olduğu büyük bir paket (zarf) olarak döner. Biz her defasında response.data yazmak zorunda kalmayalım diye interceptors (araya girici) kullanarak zarfı kapıda açıp sadece içindeki asıl veriyi (response.data) dışarıya veririz.
  (response) => response.data,
  (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

//Neden Axios?
//fetch kullanırken önce isteği atıp gelen yanıtı .json() ile dönüştürmen gerekirken, Axios bu yükü arkada otomatik halleder.
// timeout kolaylığı sağlar
