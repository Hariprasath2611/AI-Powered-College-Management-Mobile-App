import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Plus, Check, FileText, Calendar, Award, BookOpen } from 'lucide-react-native';

export const ManageAssignments: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'create' | 'grade'>('grade');
  
  // Create Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [points, setPoints] = useState('20');
  const [selectedClass, setSelectedClass] = useState('CSE-A');
  const [creating, setCreating] = useState(false);

  // Grading State
  const [gradingStudentId, setGradingStudentId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gradingInProgress, setGradingInProgress] = useState(false);

  const pendingSubmissions = [
    { id: '1', name: 'Alex Mercer', rollNo: 'CSE-001', assignment: 'Neural Network Layer Setup', date: 'June 14, 2026', fileName: 'Alex_ML_Layers.pdf' },
    { id: '2', name: 'Peter Parker', rollNo: 'CSE-004', assignment: 'Neural Network Layer Setup', date: 'June 13, 2026', fileName: 'Parker_Web_Layers.pdf' },
  ];

  const handleCreateAssignment = async () => {
    if (!title.trim() || !desc.trim()) {
      dispatch(showToast({ message: 'Please enter Title and Description', type: 'warning' }));
      return;
    }
    setCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCreating(false);
    dispatch(showToast({ message: 'Assignment published successfully!', type: 'success' }));
    setTitle('');
    setDesc('');
    setActiveTab('grade');
  };

  const handleGradeSubmit = async (studentId: string) => {
    if (!gradeScore.trim()) {
      dispatch(showToast({ message: 'Please input score', type: 'warning' }));
      return;
    }
    setGradingInProgress(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setGradingInProgress(false);
    dispatch(showToast({ message: 'Grade and Feedback saved!', type: 'success' }));
    setGradingStudentId(null);
    setGradeScore('');
    setFeedback('');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Tabs */}
      <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mx-6 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('grade')}
          style={{ backgroundColor: activeTab === 'grade' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'grade' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            Grade Submissions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('create')}
          style={{ backgroundColor: activeTab === 'create' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'create' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            Create Assignment
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
        {/* CREATE ASSIGNMENT FORM */}
        {activeTab === 'create' ? (
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border shadow-sm"
          >
            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Assignment Title</Text>
            <TextInput
              placeholder="e.g. Design Patterns Analysis"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Instructions / Description</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Detail assignment scope..."
              placeholderTextColor={colors.textMuted}
              value={desc}
              onChangeText={setDesc}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', textAlignVertical: 'top' }}
              className="rounded-2xl px-4 py-3 mb-4 min-h-[100px] text-base font-medium"
            />

            <View className="flex-row justify-between mb-6">
              <View className="w-[48%]">
                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Max Marks</Text>
                <TextInput
                  keyboardType="numeric"
                  value={points}
                  onChangeText={setPoints}
                  style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                  className="rounded-2xl px-4 py-3 text-base font-semibold"
                />
              </View>
              <View className="w-[48%]">
                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Target Class</Text>
                <View style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }} className="rounded-2xl flex-row overflow-hidden">
                  <TouchableOpacity onPress={() => setSelectedClass('CSE-A')} className={`flex-1 py-3.5 items-center ${selectedClass === 'CSE-A' ? 'bg-sky-500' : ''}`}>
                    <Text className={`text-sm font-bold ${selectedClass === 'CSE-A' ? 'text-white' : 'text-slate-500'}`}>CSE A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedClass('CSE-B')} className={`flex-1 py-3.5 items-center ${selectedClass === 'CSE-B' ? 'bg-sky-500' : ''}`}>
                    <Text className={`text-sm font-bold ${selectedClass === 'CSE-B' ? 'text-white' : 'text-slate-500'}`}>CSE B</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCreateAssignment}
              disabled={creating}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-2xl items-center justify-center flex-row shadow-md"
            >
              {creating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={18} color="#ffffff" className="mr-1.5" />
                  <Text className="text-white text-base font-bold">Publish Assignment</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* PENDING SUBMISSIONS LIST */
          pendingSubmissions.length > 0 ? (
            pendingSubmissions.map((sub) => (
              <View
                key={sub.id}
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm mb-4"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text style={{ color: colors.text }} className="text-base font-extrabold">{sub.name}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">{sub.rollNo}</Text>
                  </View>
                  <Text style={{ color: colors.primary }} className="text-xs font-bold">{sub.date}</Text>
                </View>

                <View className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl flex-row items-center mb-4">
                  <FileText size={18} color={colors.primary} className="mr-2" />
                  <Text style={{ color: colors.text }} className="text-xs font-bold flex-1" numberOfLines={1}>
                    {sub.fileName}
                  </Text>
                  <Text style={{ color: colors.primary }} className="text-[10px] font-bold">Open File</Text>
                </View>

                {gradingStudentId === sub.id ? (
                  <View className="border-t pt-4" style={{ borderTopColor: colors.border }}>
                    <Text style={{ color: colors.text }} className="text-xs font-bold mb-2 ml-1">Grade Marks (Max 20)</Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="e.g. 18"
                      placeholderTextColor={colors.textMuted}
                      value={gradeScore}
                      onChangeText={setGradeScore}
                      style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                      className="rounded-xl px-4 py-2.5 mb-3 text-sm font-semibold"
                    />

                    <Text style={{ color: colors.text }} className="text-xs font-bold mb-2 ml-1">Feedback Comments</Text>
                    <TextInput
                      placeholder="e.g. Great job!"
                      placeholderTextColor={colors.textMuted}
                      value={feedback}
                      onChangeText={setFeedback}
                      style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                      className="rounded-xl px-4 py-2.5 mb-4 text-sm font-medium"
                    />

                    <View className="flex-row justify-end">
                      <TouchableOpacity
                        onPress={() => setGradingStudentId(null)}
                        className="px-4 py-2 rounded-xl mr-2"
                      >
                        <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleGradeSubmit(sub.id)}
                        disabled={gradingInProgress}
                        style={{ backgroundColor: colors.primary }}
                        className="px-5 py-2 rounded-xl flex-row items-center"
                      >
                        {gradingInProgress ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <>
                            <Check size={14} color="#ffffff" className="mr-1" />
                            <Text className="text-white text-xs font-bold">Save Grade</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setGradingStudentId(sub.id)}
                    style={{ backgroundColor: colors.primaryLight }}
                    className="w-full py-2.5 rounded-xl items-center"
                  >
                    <Text style={{ color: colors.primary }} className="text-xs font-bold">Grade Submission</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">No submissions to grade.</Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageAssignments;
