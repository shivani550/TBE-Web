import type { APIMakeRequestProps, APIResponseType } from '@tbe/types';
import { sendRequest } from '@tbe/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const useApi = (
  queryKey: string[],
  params?: APIMakeRequestProps,
  options = { enabled: !!params }
) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
    isSuccess
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!params) throw new Error('Params are required');
      return sendRequest(params) as Promise<APIResponseType>;
    },
    enabled: options.enabled,
  });

  const makeRequest = (overrideParams?: APIMakeRequestProps) => {
    const finalParams = overrideParams || params;
    if (!finalParams) throw new Error('Params are required');
    return queryClient.fetchQuery({
      queryKey: [...queryKey, finalParams],
      queryFn: () => sendRequest(finalParams) as Promise<APIResponseType>,
    });
  };

  return {
    response: data,
    isSuccess,
    error: error?.message || null,
    loading: isLoading,
    makeRequest,
    refetch,
  };
};

export default useApi;
