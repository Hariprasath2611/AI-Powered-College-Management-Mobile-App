import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Check, X, Users, Save, AlertCircle } from 'lucide-react-native';

interface StudentRoll {
  id: string;
  name: string;
  rollNo: string;
  isPresent: boolean;
}

export const MarkAttendance: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedClass, setSelectedClass] = useState('CSE-A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [students, setStudents] = useState<StudentRoll[]>([
    { id: '1', name: 'Alex Mercer', rollNo: 'CSE-001', isPresent: true },
    { id: '2', name: 'Jane Miller', rollNo: 'CSE-002', isPresent: true },
    { id: '3', name: 'Bruce Wayne', rollNo: 'CSE-003', isPresent: false },
    { id: '4', name: 'Peter Parker', rollNo: 'CSE-004', isPresent: true },
    { id: '5', name: 'Clark Kent', rollNo: 'CSE-005', isPresent: true },
  ]);

  const toggleStudent = (id: string) => {
    setStudents(
      students.map((stu) =>
        stu.id === id ? { ...stu, isPresent: !stu.isPresent } : stu
      )
    );
  };

  const markAll = (status: boolean) => {
    setStudents(students.map((stu) => ({ ...stu, isPresent: status })));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    dispatch(showToast({ message: `Attendance saved for class ${selectedClass}!`, type: 'success' }));
  };

  const presentCount = students.filter((s) => s.isPresent).length;
  const absentCount = students.length - presentCount;

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Class Selector Bar */}
      <View className="flex-row px-6 py-4 items-center justify-between border-b" style={{ borderBottomColor: colors.border }}>
        <View className="flex-row items-center">
          <Users size={20} color={colors.primary} className="mr-2" />
          <Text style={{ color: colors.text }} className="text-base font-extrabold">
            Mark Attendance
          </Text>
        </View>

        {/* Selected Class Tabs */}
        <View className="flex-row bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setSelectedClass('CSE-A')}
            style={{ backgroundColor: selectedClass === 'CSE-A' ? colors.card : 'transparent' }}
            className="px-3.5 py-1.5 rounded-lg"
          >
            <Text style={{ color: selectedClass === 'CSE-A' ? colors.primary : colors.textMuted }} className="text-xs font-bold">CSE A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedClass('CSE-B')}
            style={{ backgroundColor: selectedClass === 'CSE-B' ? colors.card : 'transparent' }}
            className="px-3.5 py-1.5 rounded-lg"
          >
            <Text style={{ color: selectedClass === 'CSE-B' ? colors.primary : colors.textMuted }} className="text-xs font-bold">CSE B</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Box */}
      <View className="flex-row justify-between px-6 py-4 bg-slate-100 dark:bg-slate-900 border-b" style={{ borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textMuted }} className="text-xs font-bold">
          TOTAL: {students.length}
        </Text>
        <Text className="text-emerald-600 text-xs font-bold">
          PRESENT: {presentCount}
        </Text>
        <Text className="text-rose-500 text-xs font-bold">
          ABSENT: {absentCount}
        </Text>
      </View>

      {/* Bulk actions */}
      <View className="flex-row px-6 py-3 justify-between items-center">
        <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Bulk Action</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => markAll(true)}
            style={{ backgroundColor: colors.primaryLight }}
            className="px-3 py-1 rounded-lg mr-2"
          >
            <Text style={{ color: colors.primary }} className="text-[10px] font-bold">All Present</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => markAll(false)}
            style={{ backgroundColor: colors.border }}
            className="px-3 py-1 rounded-lg"
          >
            <Text style={{ color: colors.text }} className="text-[10px] font-bold">All Absent</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Student List */}
      <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
        {students.map((stu) => (
          <TouchableOpacity
            key={stu.id}
            onPress={() => toggleStudent(stu.id)}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="flex-row justify-between items-center p-4 rounded-2xl border mb-3 shadow-sm"
          >
            <View>
              <Text style={{ color: colors.text }} className="text-sm font-extrabold">{stu.name}</Text>
              <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">{stu.rollNo}</Text>
            </View>

            {/* Indicator Checkbox */}
            <View 
              style={{ 
                backgroundColor: stu.isPresent ? colors.success : colors.notification,
              }}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              {stu.isPresent ? (
                <Check size={16} color="#ffffff" strokeWidth={3} />
              ) : (
                <X size={16} color="#ffffff" strokeWidth={3} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <View className="p-6 border-t" style={{ borderTopColor: colors.border }}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{ backgroundColor: colors.primary }}
          className="flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-sky-500/20"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Save size={18} color="#ffffff" className="mr-2" />
              <Text className="text-white text-base font-bold">Save Attendance</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MarkAttendance;
