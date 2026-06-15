import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { FileDown, UploadCloud, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react-native';
import api from '../../services/api';

export const StudentAssignments: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const pendingAssignments = [
    { id: '1', title: 'Compiler Optimization Techniques', course: 'Compiler Design (CS602)', dueDate: 'June 18, 2026', maxMarks: 20, description: 'Analyze basic blocks, loop optimization techniques and generate assembly code for given three-address codes.' },
    { id: '2', title: 'Neural Network Layer Setup', course: 'Artificial Intelligence (CS603)', dueDate: 'June 22, 2026', maxMarks: 15, description: 'Implement forward propagation and backpropagation algorithms for a multi-layer perceptron from scratch.' },
  ];

  const submittedAssignments = [
    { id: '3', title: 'Requirements Specification Document', course: 'Software Engineering (CS601)', submittedDate: 'June 10, 2026', grade: 'A (18/20)', feedback: 'Excellent structural mapping and use case detailing.' },
  ];

  const handleDownload = (assignmentTitle: string) => {
    dispatch(showToast({ message: `Downloading attachments for "${assignmentTitle}"`, type: 'info' }));
  };

  const handleUpload = async (assignmentId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setUploadingId(assignmentId);

      // Setup multipart form data
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
      } as any);

      // API trigger to submission endpoint
      try {
        await api.post(`/assignments/${assignmentId}/submit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        dispatch(showToast({ message: 'Assignment uploaded successfully!', type: 'success' }));
      } catch (err: any) {
        console.warn('Backend unavailable, mocking assignment upload success...');
        // Mock loading transition delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        dispatch(showToast({ message: `Mock: Uploaded "${file.name}" successfully`, type: 'success' }));
      }
    } catch (error) {
      console.error('File selection error', error);
      dispatch(showToast({ message: 'Failed to select document', type: 'error' }));
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Tab Selectors */}
      <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mx-6 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('pending')}
          style={{ backgroundColor: activeTab === 'pending' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text 
            style={{ color: activeTab === 'pending' ? colors.primary : colors.textMuted }}
            className="text-sm font-bold"
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('submitted')}
          style={{ backgroundColor: activeTab === 'submitted' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text 
            style={{ color: activeTab === 'submitted' ? colors.primary : colors.textMuted }}
            className="text-sm font-bold"
          >
            Submitted
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
        {activeTab === 'pending' ? (
          pendingAssignments.length > 0 ? (
            pendingAssignments.map((assign) => (
              <View
                key={assign.id}
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm mb-6"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5">
                      {assign.title}
                    </Text>
                    <Text style={{ color: colors.primary }} className="text-xs font-bold mt-1">
                      {assign.course}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: colors.primaryLight }} className="px-2.5 py-1 rounded-lg">
                    <Text style={{ color: colors.primary }} className="text-xs font-bold">
                      {assign.maxMarks} Marks
                    </Text>
                  </View>
                </View>

                <Text style={{ color: colors.textMuted }} className="text-xs font-medium leading-4 mt-2 mb-4">
                  {assign.description}
                </Text>

                <View className="flex-row justify-between items-center border-t pt-4" style={{ borderTopColor: colors.border }}>
                  <View className="flex-row items-center">
                    <Clock size={14} color="#f59e0b" className="mr-1.5" />
                    <Text className="text-amber-600 text-xs font-semibold">
                      Due: {assign.dueDate}
                    </Text>
                  </View>

                  <View className="flex-row">
                    <TouchableOpacity 
                      onPress={() => handleDownload(assign.title)}
                      style={{ backgroundColor: colors.primaryLight }}
                      className="p-2.5 rounded-xl mr-2"
                    >
                      <FileDown size={18} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => handleUpload(assign.id)}
                      disabled={uploadingId === assign.id}
                      style={{ backgroundColor: colors.primary }}
                      className="flex-row items-center px-4 py-2.5 rounded-xl"
                    >
                      {uploadingId === assign.id ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <>
                          <UploadCloud size={16} color="#ffffff" className="mr-1.5" />
                          <Text className="text-white text-xs font-bold">Submit</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">All caught up! No pending assignments.</Text>
            </View>
          )
        ) : (
          submittedAssignments.length > 0 ? (
            submittedAssignments.map((assign) => (
              <View
                key={assign.id}
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm mb-6"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5">
                      {assign.title}
                    </Text>
                    <Text style={{ color: colors.primary }} className="text-xs font-bold mt-1">
                      {assign.course}
                    </Text>
                  </View>
                  <View className="bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                    <Text style={{ color: colors.success }} className="text-xs font-bold">
                      Graded
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl mb-4">
                  <FileText size={18} color={colors.textMuted} className="mr-2" />
                  <Text style={{ color: colors.text }} className="text-xs font-semibold flex-1">
                    Submitted.pdf
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-xs">
                    {assign.submittedDate}
                  </Text>
                </View>

                <View className="border-t pt-4" style={{ borderTopColor: colors.border }}>
                  <Text style={{ color: colors.text }} className="text-xs font-bold">
                    Grade: <Text style={{ color: colors.success }}>{assign.grade}</Text>
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-xs italic mt-1 font-medium">
                    Feedback: "{assign.feedback}"
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">No submitted assignments found.</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAssignments;
