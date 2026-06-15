import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { BookOpen, Plus, FolderPlus, Layers, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react-native';

export const DepartmentManagement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  
  const [selectedDept, setSelectedSubjectDept] = useState<string | null>('CSE');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [semesterVal, setSemesterVal] = useState('6');

  const [departments, setDepartments] = useState([
    { id: 'CSE', name: 'Computer Science & Engineering', code: 'CS', studentsCount: 780, subjectsCount: 42 },
    { id: 'MECH', name: 'Mechanical Engineering', code: 'ME', studentsCount: 450, subjectsCount: 38 },
    { id: 'ECE', name: 'Electronics & Communication', code: 'EC', studentsCount: 620, subjectsCount: 40 },
  ]);

  const [subjectsList, setSubjectsList] = useState([
    { id: '1', deptId: 'CSE', name: 'Software Engineering', code: 'CS601', semester: 6 },
    { id: '2', deptId: 'CSE', name: 'Compiler Design', code: 'CS602', semester: 6 },
    { id: '3', deptId: 'CSE', name: 'Artificial Intelligence', code: 'CS603', semester: 6 },
  ]);

  const handleAddSubject = () => {
    if (!subjectName.trim() || !subjectCode.trim()) {
      dispatch(showToast({ message: 'Subject details are required', type: 'warning' }));
      return;
    }

    const newSubject = {
      id: Date.now().toString(),
      deptId: selectedDept || 'CSE',
      name: subjectName,
      code: subjectCode,
      semester: parseInt(semesterVal, 10) || 6,
    };

    setSubjectsList([...subjectsList, newSubject]);
    dispatch(showToast({ message: `Subject "${subjectName}" added!`, type: 'success' }));
    setSubjectName('');
    setSubjectCode('');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          University Departments
        </Text>

        {departments.map((deptItem) => (
          <TouchableOpacity
            key={deptItem.id}
            onPress={() => setSelectedSubjectDept(selectedDept === deptItem.id ? null : deptItem.id)}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border shadow-sm mb-4"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-1 mr-2">
                <Text style={{ color: colors.text }} className="text-base font-extrabold">{deptItem.name}</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">{deptItem.code} Department</Text>
              </View>
              {selectedDept === deptItem.id ? (
                <ChevronDown size={20} color={colors.primary} />
              ) : (
                <ChevronRight size={20} color={colors.textMuted} />
              )}
            </View>

            <View className="flex-row mt-2 items-center">
              <View className="flex-row items-center mr-4">
                <GraduationCap size={14} color={colors.textMuted} className="mr-1" />
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">{deptItem.studentsCount} Students</Text>
              </View>
              <View className="flex-row items-center">
                <BookOpen size={14} color={colors.textMuted} className="mr-1" />
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">{deptItem.subjectsCount} Subjects</Text>
              </View>
            </View>

            {/* Render subjects details inside accordion expansion */}
            {selectedDept === deptItem.id && (
              <View className="border-t mt-4 pt-4" style={{ borderTopColor: colors.border }}>
                <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase mb-2">Course Curriculum</Text>
                {subjectsList.filter((s) => s.deptId === deptItem.id).map((subItem) => (
                  <View key={subItem.id} className="flex-row justify-between items-center py-2">
                    <Text style={{ color: colors.text }} className="text-sm font-semibold">{subItem.name}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs font-bold">{subItem.code} (Sem {subItem.semester})</Text>
                  </View>
                ))}

                {/* Add Subject inline inputs */}
                <View className="mt-4 pt-4 border-t" style={{ borderTopColor: colors.border }}>
                  <Text style={{ color: colors.text }} className="text-xs font-bold mb-2">Add Course Subject</Text>
                  <TextInput
                    placeholder="Subject Name"
                    placeholderTextColor={colors.textMuted}
                    value={subjectName}
                    onChangeText={setSubjectName}
                    style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                    className="rounded-xl px-4 py-2 text-xs mb-2 font-semibold"
                  />
                  <View className="flex-row justify-between">
                    <TextInput
                      placeholder="Code (e.g. CS601)"
                      placeholderTextColor={colors.textMuted}
                      value={subjectCode}
                      onChangeText={setSubjectCode}
                      style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                      className="rounded-xl px-4 py-2 text-xs w-[48%] font-semibold"
                    />
                    <TextInput
                      placeholder="Semester (1-8)"
                      placeholderTextColor={colors.textMuted}
                      value={semesterVal}
                      onChangeText={setSemesterVal}
                      keyboardType="numeric"
                      style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                      className="rounded-xl px-4 py-2 text-xs w-[48%] font-semibold"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleAddSubject}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full mt-3 py-2.5 rounded-xl items-center justify-center flex-row"
                  >
                    <Plus size={14} color="#ffffff" className="mr-1" />
                    <Text className="text-white text-xs font-bold">Add Subject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepartmentManagement;
