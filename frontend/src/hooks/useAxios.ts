import axios, { AxiosPromise } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAxios<T>(
  axiosFunction: (arg?: any) => AxiosPromise<T>,
  options?: { onMount?: boolean; arg?: any; errNavigate?: boolean },
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
  const onMount = options?.onMount || false;
  const argument = options?.arg || undefined;
  const errNavigate = options?.errNavigate ?? true;
  const [loading, setLoading] = useState<boolean>(onMount);
  const [error, setError] = useState<{
    statusCode: number | undefined;
    message: any;
    error: string;
  } | null>(null);
  const [data, setData] = useState<T | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;
    if (errNavigate) navigate('/error', { state: error });
  }, [error]);

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

  useEffect(() => {
    if (!onMount) return;
    request(argument);
  }, []);

  return [request, loading, error, data];
}
