import axios, { AxiosError, AxiosPromise } from 'axios';
import { useCallback, useState } from 'react';

export default function useAxios<T>(
  axiosFunction: (arg: any) => AxiosPromise<T>,
): [(arg: any) => Promise<null>, boolean, AxiosError | Error | null, T | null] {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const request = useCallback(
    async (arg: any) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await axiosFunction(arg);
        setData(response.data);
      } catch (err) {
        setData(null);
        setError(axios.isAxiosError(err) ? err : new Error('unexpected error'));
      }
      setLoading(false);
      return null;
    },
    [axiosFunction],
  );

  return [request, loading, error, data];
}
