import { useEffect, useMemo, useState } from "react";
import { useUser, useToast } from "@tbe/hooks";
import { useQuery } from "@tanstack/react-query";
import { APIError, quizApi } from "@tbe/services";
import type { PerformanceMetrics, CategoryPerformance } from "@tbe/types";
import { formatDate } from "@tbe/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Button,
} from "@tbe/components";
import {
  Search,
  Trophy,
  Clock,
  BookMarked,
  Calendar,
  BookOpen,
  ClipboardList,
  Activity,
  Star,
  Zap,
  ArrowRight,
  CheckSquare,
} from "lucide-react";
import { useRouter } from "next/router";
const CampusPrepDashboard = () => {
  const { user, loading, isAuth } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { toast } = useToast();

  // Fetch quiz performance metrics (includes streak, avg score, recent attempts)
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: ["performance-metrics", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const data = await quizApi.getUserAnalytics(user.id);
      console.log('🔍 RAW METRICS DATA:', data); // This will work
      return data;
    },
    enabled: !!user?.id,
  });


  // Fetch all interview-prep questions for the user to compute progress
  const {
    data: sheetQuestionsResp,
    isLoading: sheetsLoading,
    error: sheetsError,
  } = useQuery<Array<{ isCompleted?: boolean }>>({
    queryKey: ["interview-questions", user?.id],
    queryFn: async (): Promise<Array<{ isCompleted?: boolean }>> => {
      if (!user?.id) throw new Error("User not authenticated");
      const res = await fetch(`/api/v1/user/interview-prep/sheet?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to load interview questions");
      const json = await res.json();
      if (!json.success) throw new Error("Failed to load interview questions");
      return json.data as Array<{ isCompleted?: boolean }>;
    },
    enabled: !!user?.id,
  });


  const userName = user?.name || user?.email?.split('@')[0] || "Student";

  // Continue learning sessions (kept simple demo data)
  const continueLearningSessions = [
    {
      id: 1,
      courseName: "Operating Systems Essentials",
      module: "Module 4 - Deadlocks",
      progress: 60,
    },
    {
      id: 2,
      courseName: "Aptitude - Quant Basics",
      module: "Set theory - 40% done",
      progress: 40,
    },
  ];

  const progressData = useMemo(() => {
    const weeklyStudyHours = { current: 12.5, goal: 20 };
    const coursesActive = 5;
    const practiceStreak = (metricsData as PerformanceMetrics | undefined)?.streakDays ?? 7;
    const interviewsPrepared = 3;
    return { weeklyStudyHours, coursesActive, practiceStreak, interviewsPrepared };
  }, [metricsData]);

  useEffect(() => {
    if (metricsError) {
      const err = metricsError as unknown;
      const msg = err instanceof APIError ? err.message : "Failed to load metrics";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }

    if (sheetsError) {
      toast({ title: "Error", description: "Failed to load interview progress", variant: "destructive" });
    }
  }, [metricsError, sheetsError, toast]);

  // Derived stats for new cards
  const metrics = metricsData as PerformanceMetrics | undefined;
  const quizzesAttempted = metrics?.totalAttempts ?? 0;
  const totalQuizzes = metrics?.totalQuizzes ?? 0;
  const averageScore = metrics?.averageScore ?? 0;
  const interviewQuestions = (sheetQuestionsResp ?? []) as Array<{ isCompleted?: boolean }>;
  const totalInterviewQuestions = interviewQuestions.length;
  const completedInterviewQuestions = interviewQuestions.filter((q) => q.isCompleted).length;
  const interviewProgressPercent = totalInterviewQuestions
    ? Math.round((completedInterviewQuestions / totalInterviewQuestions) * 100)
    : 0;
  type RecentAttempt = { _id: string; categoryName: string; score: number; completedAt: string; totalTimeSpent: number };
  const recentActivity: RecentAttempt[] = (metrics?.recentAttempts?.slice(0, 5) ?? []) as RecentAttempt[];
  const categoryBreakdown: CategoryPerformance[] = (metrics?.categoryBreakdown ?? []) as CategoryPerformance[];

  // Redirect to login if not authenticated
  if (!loading && !isAuth) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className=" border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-gray-400">Ready to prepare today?</p>
            </div>
            <Button
              variant="PRIMARY"
              text="Continue learning"
              size="MEDIUM"
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning Summary */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Learning summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Quizzes Attempted */}
          <Card className="border-gray-800 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                Quizzes Attempted
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {quizzesAttempted} / {totalQuizzes}
                </div>
                <p className="text-xs text-gray-400">Keep attempting to improve scores</p>
              </div>
            </CardContent>
          </Card>

          {/* Average Quiz Score */}
          <Card className="border-gray-800 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Average Quiz Score
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">Overall</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{averageScore}%</div>
                <Progress value={averageScore} className="h-2 bg-gray-800" />
              </div>
            </CardContent>
          </Card>

          {/* Interview Sheets Progress */}
          <Card className="border-gray-800 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Interview Sheets Progress
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">Across all sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{interviewProgressPercent}%</div>
                <Progress value={interviewProgressPercent} className="h-2 bg-gray-800" />
                <p className="text-xs text-gray-400">{completedInterviewQuestions} / {totalInterviewQuestions} questions completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Streak */}
          <Card className="border-gray-800 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Active Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{progressData.practiceStreak} days</div>
                <p className="text-xs text-gray-400">Keep the streak going 🔥</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="border-gray-800 lg:col-span-1 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150 hover:shadow-[0_0_12px_rgba(99,102,241,0.12)] cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-primary" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Last 3–5 activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-400">No recent activity</p>
                ) : (
                  recentActivity.map((item) => (
                    <div key={item._id} className="p-3 bg-[#1A1A1A] rounded-lg border border-gray-800 group hover:border-primary hover:shadow-sm transition-colors duration-150 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium group-hover:text-primary transition-colors duration-150">{item.categoryName}</p>
                          <p className="text-xs text-gray-400 mt-1">Score: {item.score}% • {formatDate({ dateAndTime: item.completedAt }).date}</p>
                        </div>
                        <div className="text-xs text-gray-400">{item.totalTimeSpent}s</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insight */}
          <Card className="border-gray-800 lg:col-span-1 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150 hover:shadow-[0_0_12px_rgba(99,102,241,0.12)] cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-primary" />
                <span>Performance insight</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Strong areas & improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Strong areas</p>
                  <div className="text-sm text-white font-medium group-hover:text-primary transition-colors duration-150">
                    {categoryBreakdown && categoryBreakdown.length > 0 ? (
                      <span className="group-hover:text-primary transition-colors duration-150">{categoryBreakdown
                        .slice()
                        .sort((a, b) => b.averageScore - a.averageScore)
                        .slice(0, 2)
                        .map((c) => c.categoryName)
                        .join(", ")}</span>
                    ) : (
                      <span className="text-gray-400 group-hover:text-primary transition-colors duration-150">JavaScript Basics, Arrays</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Needs improvement</p>
                  <div className="text-sm text-white font-medium group-hover:text-primary transition-colors duration-150">
                    {categoryBreakdown && categoryBreakdown.length > 0 ? (
                      <span className="group-hover:text-primary transition-colors duration-150">{categoryBreakdown
                        .slice()
                        .sort((a, b) => a.averageScore - b.averageScore)
                        .slice(0, 2)
                        .map((c) => c.categoryName)
                        .join(", ")}</span>
                    ) : (
                      <span className="text-gray-400 group-hover:text-primary transition-colors duration-150">Recursion, React State Management</span>
                    )}
                  </div>
                </div>

                <div className="px-3 py-2 bg-[#111111] rounded border border-gray-800">
                  <p className="text-sm text-gray-400 group-hover:text-primary transition-colors duration-150">{metricsData?.improvementRate && metricsData.improvementRate < 0 ? `Your overall quiz scores dropped by ${Math.abs(metricsData.improvementRate)}% last week.` : "Your React quiz scores dropped by 10% last week."}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Next Actions */}
          <Card className="border-gray-800 lg:col-span-1 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150 hover:shadow-[0_0_12px_rgba(99,102,241,0.12)] cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckSquare className="w-5 h-5 text-primary" />
                <span>Recommended Next Actions</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Personalized suggestions to boost engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-gray-800">
                <div>
                  <p className="text-sm text-white font-medium">Complete DSA – Linked List Sheet</p>
                  <p className="text-xs text-gray-400">Finish 10 questions</p>
                </div>
                <Button variant="OUTLINE" size="SMALL" text="Open" onClick={() => router.push('/interview-prep/dsa-interview-questions')} />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-gray-800">
                <div>
                  <p className="text-sm text-white font-medium">Retake React Quiz (Medium)</p>
                  <p className="text-xs text-gray-400">Improve your React score</p>
                </div>
                <Button variant="OUTLINE" size="SMALL" text="Retake" onClick={() => router.push('/dashboard/quizzes')} />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-gray-800">
                <div>
                  <p className="text-sm text-white font-medium">Try 2 new quizzes</p>
                  <p className="text-xs text-gray-400">Maintain your streak</p>
                </div>
                <Button variant="OUTLINE" size="SMALL" text="Explore" onClick={() => router.push('/dashboard/quizzes')} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Challenge and Continue Learning Side by Side 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Challenge Card
        <Card className=" border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Daily challenge</CardTitle>
            <CardDescription className="text-gray-400">
              Solve 10 medium-level array problems in under 40 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="PRIMARY"
              text="Start challenge"
              size="LARGE"
            />
            <p className="text-sm text-gray-500">Status: Not started</p>
          </CardContent>
        </Card>
        */}

      {/* Continue Learning Card
        <Card className=" border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Continue learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {continueLearningSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-gray-800"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    {session.courseName}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {session.module}
                  </p>
                </div>
                <Button
                  variant="OUTLINE"
                  size="SMALL"
                  className="border-gray-700 text-white hover:bg-gray-800"
                  text="Resume"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Practice Section */}
      <Card className="border-gray-800 lg:col-span-1 hover:border-primary focus-within:border-primary active:border-primary transition-colors duration-150 hover:shadow-[0_0_12px_rgba(99,102,241,0.12)] cursor-pointer">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#FF5757]" />
            Practice
          </CardTitle>
          <CardDescription className="text-gray-400">
            Quick practice modules to keep your streak going
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-gray-800">
            <div>
              <p className="text-white font-semibold">Quizzes</p>
              <p className="text-xs text-gray-400 mt-1">
                Topic-wise MCQs with instant results
              </p>
            </div>
            <Button
              variant="OUTLINE"
              size="SMALL"
              className="border-gray-700 text-white hover:bg-gray-800"
              text="Explore"
              onClick={() => router.push("/dashboard/quizzes")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-gray-800">
            <div>
              <p className="text-white font-semibold">Interview Sheets</p>
              <p className="text-xs text-gray-400 mt-1">
                Practice interview questions and mark progress
              </p>
            </div>
            <Button
              variant="OUTLINE"
              size="SMALL"
              className="border-gray-700 text-white hover:bg-gray-800"
              text="Open"
              onClick={() => router.push("/dashboard/interview-prep")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampusPrepDashboard;
