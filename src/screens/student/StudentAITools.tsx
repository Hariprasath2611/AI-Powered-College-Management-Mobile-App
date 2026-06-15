import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Brain, FileText, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Send, User, Trophy } from 'lucide-react-native';

export const StudentAITools: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'resume' | 'interview' | 'roadmap'>('resume');

  // --- AI RESUME ANALYZER STATES ---
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeResult, setResumeResult] = useState<any | null>(null);

  // --- AI INTERVIEW PREP STATES ---
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<any | null>(null);

  const interviewQuestions = [
    { q: 'Explain the difference between Virtual DOM and Real DOM in React Native.', category: 'Technical' },
    { q: 'How do you handle state propagation issues in a deep component hierarchy?', category: 'Technical' },
    { q: 'Describe a situation where you had a conflict with a team member and how you resolved it.', category: 'HR' }
  ];

  // --- AI CAREER ROADMAP STATES ---
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const careerRoadmaps = [
    { 
      role: 'Full Stack JavaScript Architect', 
      skills: ['React Native / React', 'Node.js / Express', 'PostgreSQL / Prisma', 'System Design'],
      steps: ['Master ES6+ and TypeScript Core', 'Understand React Virtual DOM & Native Bridges', 'Build REST/GraphQL APIs with Node.js', 'Learn Database Partitioning and Indexing']
    },
    { 
      role: 'AI / Machine Learning Engineer', 
      skills: ['Python / PyTorch', 'TensorFlow', 'Data Pipelines', 'LLM Fine-tuning'],
      steps: ['Solidify Linear Algebra & Statistics', 'Learn Classical ML Algorithms', 'Deep Dive into Deep Learning & Transformers', 'Deploy Models with FastAPI / Docker']
    }
  ];

  // Resume Upload Analysis Trigger
  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setAnalyzingResume(true);
      setResumeResult(null);

      // Simulate network analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setResumeResult({
        score: 82,
        strengths: ['Strong technical skill listing', 'Excellent formatting consistency', 'Clear action-verbs in experience'],
        gaps: ['Missing Cloud Infrastructure details (AWS/GCP)', 'Project descriptions lack quantifiable metrics (e.g. improved speed by X%)'],
        recommendations: [
          'Add a summary section highlighting 3+ years of coding background.',
          'Add metrics like: "Reduced API load time by 30% using Redis caching".'
        ]
      });
      dispatch(showToast({ message: 'Resume analyzed successfully!', type: 'success' }));
    } catch (e) {
      dispatch(showToast({ message: 'Failed to analyze resume', type: 'error' }));
    } finally {
      setAnalyzingResume(false);
    }
  };

  // Mock Interview Answer Submit
  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;

    setInterviewLoading(true);
    // Simulate AI grading
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      dispatch(showToast({ message: 'Answer recorded! Loading next question.', type: 'info' }));
      setInterviewLoading(false);
    } else {
      // Completed last question
      setInterviewFeedback({
        score: 8.5,
        communication: 'Excellent vocabulary and clear structure. Try to add direct examples from your projects in future replies.',
        strengths: ['Technically accurate answers', 'Great explanation of DOM diffing'],
        areasToImprove: ['Use more active project examples', 'Reduce filler words']
      });
      setInterviewLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Dynamic Segment Buttons */}
      <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mx-6 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('resume')}
          style={{ backgroundColor: activeTab === 'resume' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'resume' ? colors.primary : colors.textMuted }} className="text-xs font-bold">Resume Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('interview')}
          style={{ backgroundColor: activeTab === 'interview' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'interview' ? colors.primary : colors.textMuted }} className="text-xs font-bold">Mock Prep</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('roadmap')}
          style={{ backgroundColor: activeTab === 'roadmap' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'roadmap' ? colors.primary : colors.textMuted }} className="text-xs font-bold">Career Guide</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
        {/* --- RESUME ANALYZER TAB --- */}
        {activeTab === 'resume' && (
          <View>
            <View 
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-6 rounded-3xl border shadow-sm items-center mb-6"
            >
              <View style={{ backgroundColor: colors.primaryLight }} className="p-4 rounded-full mb-4">
                <Brain size={44} color={colors.primary} />
              </View>
              <Text style={{ color: colors.text }} className="text-lg font-extrabold text-center">
                AI Resume ATS Scanner
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-xs text-center mt-1 leading-5 mb-5 px-4">
                Scan your resume against standard industry Application Tracking Systems (ATS) to identify gaps.
              </Text>

              {analyzingResume ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={{ color: colors.primary }} className="text-xs font-bold mt-2">Uploading and analyzing resume...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleUploadResume}
                  style={{ backgroundColor: colors.primary }}
                  className="px-6 py-3.5 rounded-2xl flex-row items-center"
                >
                  <FileText size={18} color="#ffffff" className="mr-2" />
                  <Text className="text-white font-bold text-sm">Select & Upload Resume</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Results display */}
            {resumeResult && (
              <View 
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm mb-6"
              >
                <View className="flex-row justify-between items-center mb-4 pb-4 border-b" style={{ borderBottomColor: colors.border }}>
                  <Text style={{ color: colors.text }} className="text-base font-extrabold">Analysis Result</Text>
                  <View style={{ backgroundColor: colors.success + '15' }} className="px-3 py-1 rounded-xl">
                    <Text style={{ color: colors.success }} className="text-sm font-black">ATS Score: {resumeResult.score}/100</Text>
                  </View>
                </View>

                {/* Strengths */}
                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2">Strengths</Text>
                {resumeResult.strengths.map((str: string, i: number) => (
                  <View key={i} className="flex-row items-center mb-2">
                    <CheckCircle2 size={14} color={colors.success} className="mr-2" />
                    <Text style={{ color: colors.textMuted }} className="text-xs flex-1 font-medium">{str}</Text>
                  </View>
                ))}

                {/* Skill Gaps */}
                <Text style={{ color: colors.text }} className="text-sm font-bold mt-4 mb-2">Skill Gaps</Text>
                {resumeResult.gaps.map((gap: string, i: number) => (
                  <View key={i} className="flex-row items-center mb-2">
                    <AlertTriangle size={14} color={colors.warning} className="mr-2" />
                    <Text style={{ color: colors.textMuted }} className="text-xs flex-1 font-medium">{gap}</Text>
                  </View>
                ))}

                {/* Suggestions */}
                <Text style={{ color: colors.text }} className="text-sm font-bold mt-4 mb-2">ATS Suggestions</Text>
                {resumeResult.recommendations.map((rec: string, i: number) => (
                  <View key={i} className="flex-row items-start mb-2">
                    <Sparkles size={14} color={colors.primary} className="mr-2 mt-0.5" />
                    <Text style={{ color: colors.textMuted }} className="text-xs flex-1 font-semibold">{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* --- AI MOCK INTERVIEW TAB --- */}
        {activeTab === 'interview' && (
          <View>
            {!interviewStarted ? (
              <View 
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-6 rounded-3xl border shadow-sm items-center"
              >
                <View style={{ backgroundColor: colors.warning + '15' }} className="p-4 rounded-full mb-4">
                  <Sparkles size={44} color={colors.warning} />
                </View>
                <Text style={{ color: colors.text }} className="text-lg font-extrabold text-center">
                  AI Real-Time Mock Interview
                </Text>
                <Text style={{ color: colors.textMuted }} className="text-xs text-center mt-1 leading-5 mb-5 px-4">
                  Practice responding to key industry technical and behavioral questions, and get graded instantly.
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setInterviewStarted(true);
                    setCurrentQuestionIndex(0);
                    setInterviewFeedback(null);
                  }}
                  style={{ backgroundColor: colors.primary }}
                  className="px-6 py-3.5 rounded-2xl"
                >
                  <Text className="text-white font-bold text-sm">Start Mock Interview</Text>
                </TouchableOpacity>
              </View>
            ) : interviewFeedback ? (
              <View 
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm"
              >
                <View className="items-center mb-6 pb-4 border-b" style={{ borderBottomColor: colors.border }}>
                  <View style={{ backgroundColor: colors.success + '15' }} className="p-4 rounded-full mb-3">
                    <Trophy size={40} color={colors.success} />
                  </View>
                  <Text style={{ color: colors.text }} className="text-lg font-extrabold">Interview Completed!</Text>
                  <Text style={{ color: colors.success }} className="text-xl font-black mt-1">Score: {interviewFeedback.score}/10</Text>
                </View>

                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2">Communication Feedback</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs leading-5 mb-4 font-medium">{interviewFeedback.communication}</Text>

                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2">Key Strengths</Text>
                {interviewFeedback.strengths.map((str: string, i: number) => (
                  <View key={i} className="flex-row items-center mb-2">
                    <CheckCircle2 size={14} color={colors.success} className="mr-2" />
                    <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">{str}</Text>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => setInterviewStarted(false)}
                  style={{ backgroundColor: colors.primary }}
                  className="w-full py-4 rounded-2xl items-center mt-6"
                >
                  <Text className="text-white font-bold">Restart Interview</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View 
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm"
              >
                <View className="flex-row justify-between items-center mb-4 pb-2 border-b" style={{ borderBottomColor: colors.border }}>
                  <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                  </Text>
                  <View className="bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                    <Text className="text-amber-600 text-[10px] font-bold">{interviewQuestions[currentQuestionIndex].category}</Text>
                  </View>
                </View>

                <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5 mb-6">
                  {interviewQuestions[currentQuestionIndex].q}
                </Text>

                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder="Type your response here..."
                  placeholderTextColor={colors.textMuted}
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  style={{ color: colors.text, borderColor: colors.border, textAlignVertical: 'top' }}
                  className="border rounded-2xl p-4 min-h-[120px] text-base mb-4 font-medium"
                />

                <TouchableOpacity
                  onPress={handleAnswerSubmit}
                  disabled={interviewLoading || !userAnswer.trim()}
                  style={{ backgroundColor: colors.primary }}
                  className="w-full py-4 rounded-2xl items-center justify-center flex-row"
                >
                  {interviewLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Text className="text-white font-bold mr-2">Submit Answer</Text>
                      <Send size={16} color="#ffffff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* --- CAREER ROADMAP TAB --- */}
        {activeTab === 'roadmap' && (
          <View>
            <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
              AI Job Recommendations
            </Text>
            {careerRoadmaps.map((road, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedCareer(selectedCareer === road.role ? null : road.role)}
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm mb-4"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold">{road.role}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs mt-1 font-medium">
                      Skills: {road.skills.join(' • ')}
                    </Text>
                  </View>
                  <BookOpen size={20} color={colors.primary} />
                </View>

                {selectedCareer === road.role && (
                  <View className="border-t mt-4 pt-4" style={{ borderTopColor: colors.border }}>
                    <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider mb-3">Recommended Learning Path</Text>
                    {road.steps.map((step, sIdx) => (
                      <View key={sIdx} className="flex-row items-start mb-3">
                        <View style={{ backgroundColor: colors.primary }} className="w-5 h-5 rounded-full items-center justify-center mr-3 mt-0.5">
                          <Text className="text-white text-[10px] font-black">{sIdx + 1}</Text>
                        </View>
                        <Text style={{ color: colors.text }} className="text-sm font-semibold flex-1 leading-5">{step}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAITools;
