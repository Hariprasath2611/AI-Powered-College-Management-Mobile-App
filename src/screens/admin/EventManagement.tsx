import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Calendar, Plus, MapPin, Clock, Edit3, Trash2 } from 'lucide-react-native';

export const EventManagement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [desc, setDesc] = useState('');
  const [publishing, setPublishing] = useState(false);

  const [events, setEvents] = useState([
    { id: '1', title: 'AI Hackathon 2026', date: 'June 20, 10:00 AM', venue: 'Auditorium 2', desc: 'Build real-world LLM and CV projects in 24 hours.' },
    { id: '2', title: 'Placement Drive: Google', date: 'June 25, 09:00 AM', venue: 'Placement Cell', desc: 'Recruitment presentations and coding assessments.' },
  ]);

  const handleCreateEvent = async () => {
    if (!title.trim() || !date.trim() || !venue.trim()) {
      dispatch(showToast({ message: 'Title, Date, and Venue are required', type: 'warning' }));
      return;
    }
    setPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPublishing(false);

    const newEvent = {
      id: Date.now().toString(),
      title,
      date,
      venue,
      desc,
    };

    setEvents([newEvent, ...events]);
    dispatch(showToast({ message: `Event "${title}" published successfully!`, type: 'success' }));
    setTitle('');
    setDate('');
    setVenue('');
    setDesc('');
    setActiveTab('list');
  };

  const handleDeleteEvent = (id: string, eventTitle: string) => {
    setEvents(events.filter((e) => e.id !== id));
    dispatch(showToast({ message: `Event "${eventTitle}" deleted`, type: 'info' }));
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Tabs */}
      <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mx-6 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('list')}
          style={{ backgroundColor: activeTab === 'list' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'list' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            All Events ({events.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('create')}
          style={{ backgroundColor: activeTab === 'create' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'create' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            Publish Event
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
        {/* LIST VIEW */}
        {activeTab === 'list' ? (
          events.map((event) => (
            <View
              key={event.id}
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-5 rounded-3xl border shadow-sm mb-4"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text style={{ color: colors.text }} className="text-base font-extrabold flex-1 mr-3 leading-5">
                  {event.title}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteEvent(event.id, event.title)}
                  className="p-2 bg-rose-500/10 rounded-lg"
                >
                  <Trash2 size={14} color="#f43f5e" />
                </TouchableOpacity>
              </View>

              <Text style={{ color: colors.textMuted }} className="text-xs leading-4 mb-4 font-semibold">
                {event.desc}
              </Text>

              <View className="flex-row items-center pt-3 border-t" style={{ borderTopColor: colors.border }}>
                <Clock size={12} color={colors.textMuted} className="mr-1" />
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mr-4">{event.date}</Text>

                <MapPin size={12} color={colors.textMuted} className="mr-1" />
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">{event.venue}</Text>
              </View>
            </View>
          ))
        ) : (
          /* CREATE EVENT FORM */
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border shadow-sm"
          >
            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Event Title</Text>
            <TextInput
              placeholder="e.g. Annual Symposium"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Event Date & Time</Text>
            <TextInput
              placeholder="e.g. June 25, 09:00 AM"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Event Venue</Text>
            <TextInput
              placeholder="e.g. Auditorium 1"
              placeholderTextColor={colors.textMuted}
              value={venue}
              onChangeText={setVenue}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Description</Text>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Enter event details..."
              placeholderTextColor={colors.textMuted}
              value={desc}
              onChangeText={setDesc}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', textAlignVertical: 'top' }}
              className="rounded-2xl px-4 py-3 mb-6 min-h-[80px] text-base font-medium"
            />

            <TouchableOpacity
              onPress={handleCreateEvent}
              disabled={publishing}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-2xl items-center justify-center flex-row shadow-md"
            >
              {publishing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={18} color="#ffffff" className="mr-1.5" />
                  <Text className="text-white text-base font-bold">Publish Event Feed</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventManagement;
