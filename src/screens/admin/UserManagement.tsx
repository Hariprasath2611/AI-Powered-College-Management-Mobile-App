import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Users, Plus, Trash2, Edit3, UserCheck, ShieldAlert, Search } from 'lucide-react-native';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
}

export const UserManagement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Creation state
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [dept, setDept] = useState('Computer Science');
  const [creating, setCreating] = useState(false);

  const [usersList, setUsersList] = useState<ManagedUser[]>([
    { id: '1', name: 'Dr. Sarah Connor', email: 'sarah.connor@college.edu', role: 'faculty', department: 'Computer Science' },
    { id: '2', name: 'Alex Mercer', email: 'alex.mercer@college.edu', role: 'student', department: 'Computer Science' },
    { id: '3', name: 'Dr. John Watson', email: 'john.watson@college.edu', role: 'faculty', department: 'Mechanical Engineering' },
    { id: '4', name: 'Jane Miller', email: 'jane.miller@college.edu', role: 'student', department: 'Electrical Engineering' },
  ]);

  const handleCreateUser = async () => {
    if (!name.trim() || !email.trim()) {
      dispatch(showToast({ message: 'Name and Email are required', type: 'warning' }));
      return;
    }
    setCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCreating(false);

    const newUser: ManagedUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      department: dept,
    };

    setUsersList([newUser, ...usersList]);
    dispatch(showToast({ message: `User "${name}" created successfully!`, type: 'success' }));
    setName('');
    setEmail('');
    setActiveTab('list');
  };

  const handleDeleteUser = (id: string, userName: string) => {
    setUsersList(usersList.filter((u) => u.id !== id));
    dispatch(showToast({ message: `Deleted user "${userName}"`, type: 'info' }));
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Header Tabs */}
      <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mx-6 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('list')}
          style={{ backgroundColor: activeTab === 'list' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'list' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            All Users ({usersList.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('create')}
          style={{ backgroundColor: activeTab === 'create' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'create' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            Create User
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH OR FORM LISTS */}
      {activeTab === 'list' ? (
        <View className="flex-1">
          {/* Search bar */}
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="flex-row items-center border rounded-2xl mx-6 px-4 py-3 mb-6"
          >
            <Search size={18} color={colors.textMuted} className="mr-3" />
            <TextInput
              placeholder="Search by name or email..."
              placeholderTextColor={colors.textMuted}
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={{ color: colors.text }}
              className="flex-1 text-base py-0.5"
            />
          </View>

          <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((userItem) => (
                <View
                  key={userItem.id}
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                  className="p-5 rounded-3xl border shadow-sm mb-4 flex-row items-center justify-between"
                >
                  <View className="flex-1 mr-4">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold">{userItem.name}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">{userItem.email}</Text>
                    <View className="flex-row mt-2 items-center">
                      <View style={{ backgroundColor: colors.primary + '15' }} className="px-2 py-0.5 rounded mr-2">
                        <Text style={{ color: colors.primary }} className="text-[10px] font-bold uppercase">{userItem.role}</Text>
                      </View>
                      <Text style={{ color: colors.textMuted }} className="text-[10px] font-semibold">{userItem.department}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(userItem.id, userItem.name)}
                    className="p-2.5 bg-rose-500/10 rounded-xl"
                  >
                    <Trash2 size={16} color="#f43f5e" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-12">
                <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">No users matched your search.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        /* CREATE FORM PANEL */
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-6 rounded-3xl border shadow-sm mb-6"
          >
            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Full Name</Text>
            <TextInput
              placeholder="e.g. John Watson"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">College Email</Text>
            <TextInput
              placeholder="e.g. john.watson@college.edu"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Department</Text>
            <TextInput
              placeholder="e.g. Computer Science"
              placeholderTextColor={colors.textMuted}
              value={dept}
              onChangeText={setDept}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-3 ml-1">System Role</Text>
            <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl mb-6">
              {(['student', 'faculty', 'admin'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={{ backgroundColor: role === r ? colors.card : 'transparent' }}
                  className="flex-1 py-2 rounded-xl items-center"
                >
                  <Text 
                    style={{ color: role === r ? colors.primary : colors.textMuted }}
                    className="text-[10px] font-black uppercase"
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleCreateUser}
              disabled={creating}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-2xl items-center justify-center flex-row shadow-md"
            >
              {creating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={18} color="#ffffff" className="mr-1.5" />
                  <Text className="text-white text-base font-bold">Register Account</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default UserManagement;
