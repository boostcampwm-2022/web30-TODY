import axios, { AxiosPromise } from 'axios';
import { useCallback, useEffect, useState } from 'react';

export default function useAxios<T>(
  axiosFunction: (arg?: any) => AxiosPromise<T>,
  options?: { onMount?: boolean; arg?: any },
): [
  (arg?: any) => Promise<void>,
  boolean,
  { status: number | undefined; data: any } | null,
  T | null,
] {
  const onMount = options?.onMount || false;
  const argument = options?.arg || undefined;
  const [loading, setLoading] = useState<boolean>(onMount);
  const [error, setError] = useState<{
    status: number | undefined;
    data: any;
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
            setError(err.response);
          } else {
            setError({ status: undefined, data: 'network error' });
          }
        } else {
          setError({ status: undefined, data: 'unexpected error' });
        }
      }
      setLoading(false);
    },
    [axiosFunction],
  );

  useEffect(() => {
    if (!onMount) return;
    request(argument);
  }, []);

  return [request, loading, error, data];
}
