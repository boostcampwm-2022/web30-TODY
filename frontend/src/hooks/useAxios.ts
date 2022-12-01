import axios, { AxiosPromise } from 'axios';
import { useCallback, useState } from 'react';

export default function useAxios<T>(
  axiosFunction: (arg?: any) => AxiosPromise<T>,
): [
  (arg?: any) => Promise<void>,
  boolean,
  {
    statusCode: number | undefined;
    message: any;
    error: string;
  } | null,
  T | null,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    statusCode: number | undefined;
    message: any;
    error: string;
  } | null>(null);
  const [data, setData] = useState<T | null>(null);

  const request = useCallback(
    async (arg?: any) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await axiosFunction(arg);
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data);
          } else {
            setError({
              statusCode: undefined,
              message: err.message,
              error: err.message,
            });
          }
        }
      }
      setLoading(false);
    },
    [axiosFunction],
  );

  return [request, loading, error, data];
}
