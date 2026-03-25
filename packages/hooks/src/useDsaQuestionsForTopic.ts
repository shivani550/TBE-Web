import { routes } from "@tbe/constants";
import type { DsaQuestion } from "@tbe/interface";
import { CACHE_TIMES, queryKeys, useQuery } from "@tbe/query";
import { sendRequest, transformDsaQuestion } from "@tbe/utils";
import { useMemo } from "react";

export const useDsaQuestionsForTopic = (topic: string | null) => {
  const { data: response, isLoading } = useQuery<any>({
    queryKey: queryKeys.dsa.questions({ topic: topic ?? "all" }),
    queryFn: () =>
      sendRequest({
        url: `${routes.api.base}${routes.api.dsaSheet}?topic=${topic}`,
      }),
    ...CACHE_TIMES.STABLE,
    enabled: !!topic,
  });

  const rawQuestions = useMemo(() => {
    const data = response?.data?.questions;
    if (!Array.isArray(data)) return [];
    return data;
  }, [response]);

  const questions = useMemo(() => {
    return rawQuestions.map(transformDsaQuestion);
  }, [rawQuestions]);

  return { questions, rawQuestions, loading: isLoading };
};
