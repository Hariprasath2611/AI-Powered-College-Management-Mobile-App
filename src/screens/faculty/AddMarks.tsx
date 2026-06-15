import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Award, BookOpen, Save, FileSpreadsheet } from 'lucide-react-native';

interface StudentMark {
  id: string;
  name: string;
  rollNo: string;
  marks: string;
}

export const AddMarks: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedSubject, setSelectedSubject] = useState('Software Engineering');
  const [examType, setExamType] = useState('Internal 1');
  const [saving, setSaving] = useState(false);

  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([
    { id: '1', name: 'Alex Mercer', rollNo: 'CSE-001', marks: '42' },
    { id: '2', name: 'Jane Miller', rollNo: 'CSE-002', marks: '38' },
    { id: '3', name: 'Bruce Wayne', rollNo: 'CSE-003', marks: '45' },
    { id: '4', name: 'Peter Parker', rollNo: 'CSE-004', marks: '32' },
    { id: '5', name: 'Clark Kent', rollNo: 'CSE-005', marks: '49' },
  ]);

  const handleMarkChange = (id: string, text: string) => {
    setStudentMarks(
      studentMarks.map((stu) =>
        stu.id === id ? { ...stu, marks: text } : stu
      )
    );
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    dispatch(showToast({ message: `Marks updated for ${examType} (${selectedSubject})`, type: 'success' }));
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Dropdown/Headers */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <View className="flex-row items-center mb-3">
          <BookOpen size={20} color={colors.primary} className="mr-2" />
          <Text style={{ color: colors.text }} className="text-base font-extrabold">
            Add Internal Marks
          </Text>
        </View>

        {/* Configurations selector */}
        <View className="flex-row justify-between mt-2">
          {/* Subject Tab */}
          <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-[55%]">
            <TouchableOpacity
              onPress={() => setSelectedSubject('Software Engineering')}
              style={{ backgroundColor: selectedSubject === 'Software Engineering' ? colors.card : 'transparent' }}
              className="flex-1 py-2 rounded-lg items-center"
            >
              <Text style={{ color: selectedSubject === 'Software Engineering' ? colors.primary : colors.textMuted }} className="text-[10px] font-black uppercase">SE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSubject('Compiler Design')}
              style={{ backgroundColor: selectedSubject === 'Compiler Design' ? colors.card : 'transparent' }}
              className="flex-1 py-2 rounded-lg items-center"
            >
              <Text style={{ color: selectedSubject === 'Compiler Design' ? colors.primary : colors.textMuted }} className="text-[10px] font-black uppercase">CD</Text>
            </TouchableOpacity>
          </View>

          {/* Exam Tab */}
          <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-[40%]">
            <TouchableOpacity
              onPress={() => setExamType('Internal 1')}
              style={{ backgroundColor: examType === 'Internal 1' ? colors.card : 'transparent' }}
              className="flex-1 py-2 rounded-lg items-center"
            >
              <Text style={{ color: examType === 'Internal 1' ? colors.primary : colors.textMuted }} className="text-[10px] font-bold">Term 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExamType('Internal 2')}
              style={{ backgroundColor: examType === 'Internal 2' ? colors.card : 'transparent' }}
              className="flex-1 py-2 rounded-lg items-center"
            >
              <Text style={{ color: examType === 'Internal 2' ? colors.primary : colors.textMuted }} className="text-[10px] font-bold">Term 2</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Marks Table Headings */}
      <View className="flex-row justify-between px-6 py-3 bg-slate-100 dark:bg-slate-900 border-b" style={{ borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textMuted }} className="text-xs font-bold w-[60%]">STUDENT NAME</Text>
        <Text style={{ color: colors.textMuted }} className="text-xs font-bold w-[40%] text-center">MARKS (MAX 50)</Text>
      </View>

      {/* Student Marks Inputs */}
      <ScrollView className="px-6 flex-1 mt-4" showsVerticalScrollIndicator={false}>
        {studentMarks.map((stu) => (
          <View
            key={stu.id}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="flex-row justify-between items-center p-4 rounded-2xl border mb-3 shadow-sm"
          >
            <View className="w-[60%]">
              <Text style={{ color: colors.text }} className="text-sm font-extrabold">{stu.name}</Text>
              <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">{stu.rollNo}</Text>
            </View>

            {/* Input marks */}
            <View className="w-[40%] items-center">
              <TextInput
                keyboardType="numeric"
                value={stu.marks}
                onChangeText={(text) => handleMarkChange(stu.id, text)}
                style={{ color: colors.text, borderColor: colors.border }}
                className="w-16 text-center border rounded-xl py-1.5 text-base font-bold bg-slate-100 dark:bg-slate-950"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Save Button */}
      <View className="p-6 border-t" style={{ borderTopColor: colors.border }}>
        <TouchableOpacity
          onPress={handleSaveMarks}
          disabled={saving}
          style={{ backgroundColor: colors.primary }}
          className="flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-sky-500/20"
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Save size={18} color="#ffffff" className="mr-2" />
              <Text className="text-white text-base font-bold">Save Academic Marks</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddMarks;
