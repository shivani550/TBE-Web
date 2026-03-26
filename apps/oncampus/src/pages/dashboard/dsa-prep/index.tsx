import {
  DsaPrepWorkspace,
  LearningEnvironmentLayout,
  LoadingSpinner,
  Text,
} from "@tbe/components";
import { DSA_STUDY_GUIDE_CONFIGS, routes } from "@tbe/constants";
import {
  useDsaCompletedQuestions,
  useDsaQuestionsForTopic,
  useDsaTopicSummaries,
  useUser,
} from "@tbe/hooks";
import type { DsaQuestion } from "@tbe/interface";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const DSAPrepPage = () => {
  const router = useRouter();
  const { loading: userLoading, isAuth } = useUser();

  const [selectedQuestion, setSelectedQuestion] = useState<DsaQuestion | null>(
    null,
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { data: topicsWithCounts, isLoading: topicsLoading } =
    useDsaTopicSummaries();
  const { questions, loading: questionsLoading } =
    useDsaQuestionsForTopic(selectedTopic);

  const { completedIds, toggleComplete } = useDsaCompletedQuestions();

  const topicsCompletionMap = useMemo(() => {
    return (topicsWithCounts ?? []).reduce(
      (acc, row) => {
        acc[row.topic] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }, [topicsWithCounts]);

  const pageLoading =
    userLoading || topicsLoading || (!!selectedTopic && questionsLoading);

  useEffect(() => {
    if (!userLoading && !isAuth) {
      router.push("/login");
    }
  }, [userLoading, isAuth, router]);

  const handleQuestionClick = (question: DsaQuestion) => {
    setSelectedQuestion(question);
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedQuestion(null);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedQuestion(null);
  };

  if (userLoading || topicsLoading) {
    return (
      <LearningEnvironmentLayout backHref={routes.oncampus.dashboard} isLoading>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner height={8} width={8} />
          <Text level="p" className="text-gray-400 ml-3">
            Loading...
          </Text>
        </div>
      </LearningEnvironmentLayout>
    );
  }

  return (
    <LearningEnvironmentLayout
      backHref={routes.oncampus.dashboard}
      layoutMode="workspace"
    >
      <DsaPrepWorkspace
        questions={questions || []}
        topicsWithCounts={topicsWithCounts || []}
        selectedTopic={selectedTopic}
        selectedQuestion={selectedQuestion}
        onTopicClick={handleTopicClick}
        onQuestionClick={handleQuestionClick}
        onBackToTopics={handleBackToTopics}
        studyGuideConfigs={DSA_STUDY_GUIDE_CONFIGS}
      />
    </LearningEnvironmentLayout>
  );
};

export default DSAPrepPage;
