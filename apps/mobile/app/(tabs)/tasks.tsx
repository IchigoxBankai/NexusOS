import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { theme } from '../../lib/theme';
import type { TaskItem } from '@nexus/types';

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't1',
    user_id: 'u1',
    title: 'Review and approve distributed token bucket algorithm in Rust',
    priority: 'urgent',
    status: 'in_progress',
    due_date: 'Today, 14:00',
    tags: ['Rust', 'Engine'],
    created_at: '',
    updated_at: '',
  },
  {
    id: 't2',
    user_id: 'u1',
    title: 'Finalize Supabase Row Level Security policy migration',
    priority: 'high',
    status: 'todo',
    due_date: 'Today, 17:30',
    tags: ['Supabase', 'Database'],
    created_at: '',
    updated_at: '',
  },
  {
    id: 't3',
    user_id: 'u1',
    title: 'Synthesize design system tokens for frosted aurora glassmorphism',
    priority: 'medium',
    status: 'todo',
    due_date: 'Tomorrow',
    tags: ['Design', 'Tokens'],
    created_at: '',
    updated_at: '',
  },
  {
    id: 't4',
    user_id: 'u1',
    title: 'Conduct weekly personal OKR and financial cashflow audit',
    priority: 'low',
    status: 'todo',
    due_date: 'Friday',
    tags: ['Finance', 'Strategy'],
    created_at: '',
    updated_at: '',
  },
];

type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low';

const PRIORITY_COLORS: Record<TaskItem['priority'], { bg: string; text: string }> = {
  urgent: { bg: '#FEE2E2', text: '#DC2626' },
  high: { bg: '#FFEDD5', text: '#EA580C' },
  medium: { bg: '#E0E7FF', text: '#4F46E5' },
  low: { bg: '#F1F5F9', text: '#64748B' },
};

export default function MobileTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<PriorityFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('high');

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.priority === activeFilter;
  });

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      user_id: 'u1',
      title: newTitle.trim(),
      priority: newPriority,
      status: 'todo',
      due_date: 'Today',
      tags: ['Mobile Queue'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const activeCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Actions & Tasks</Text>
            <Text style={styles.subtitle}>
              {activeCount} active • {completedCount} completed
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'urgent', 'high', 'medium', 'low'] as PriorityFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterPill,
                activeFilter === filter && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Task List */}
        <View style={styles.listContainer}>
          {filteredTasks.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Ionicons name="checkmark-done-circle-outline" size={44} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Queue Cleared</Text>
              <Text style={styles.emptySubtitle}>No pending tasks in this filter.</Text>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const pStyle = PRIORITY_COLORS[task.priority];

              return (
                <Card key={task.id} style={styles.taskCard}>
                  <View style={styles.taskRow}>
                    {/* Checkbox */}
                    <TouchableOpacity
                      onPress={() => handleToggleTask(task.id)}
                      style={[styles.checkbox, isCompleted && styles.checkboxActive]}
                    >
                      {isCompleted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </TouchableOpacity>

                    {/* Task Content */}
                    <View style={styles.taskContent}>
                      <Text
                        style={[
                          styles.taskTitle,
                          isCompleted && styles.taskTitleCompleted,
                        ]}
                      >
                        {task.title}
                      </Text>

                      <View style={styles.tagRow}>
                        <View style={[styles.priorityBadge, { backgroundColor: pStyle.bg }]}>
                          <Text style={[styles.priorityBadgeText, { color: pStyle.text }]}>
                            {task.priority.toUpperCase()}
                          </Text>
                        </View>

                        {task.due_date && (
                          <View style={styles.dueBadge}>
                            <Ionicons name="time-outline" size={11} color="#64748B" />
                            <Text style={styles.dueText}>{task.due_date}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Delete action */}
                    <TouchableOpacity
                      onPress={() => handleDeleteTask(task.id)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Action Item</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="What needs to be accomplished?"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              autoFocus
            />

            <Text style={styles.modalSectionLabel}>Priority Level</Text>
            <View style={styles.prioritySelector}>
              {(['urgent', 'high', 'medium', 'low'] as TaskItem['priority'][]).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setNewPriority(p)}
                  style={[
                    styles.priorityOption,
                    newPriority === p && styles.priorityOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      newPriority === p && styles.priorityOptionTextActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setIsModalOpen(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Create Task"
                onPress={handleCreateTask}
                style={{ flex: 1, backgroundColor: '#0F172A' }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    gap: 10,
  },
  taskCard: {
    padding: 14,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskContent: {
    flex: 1,
    gap: 6,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 20,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dueText: {
    fontSize: 11,
    color: '#64748B',
  },
  deleteBtn: {
    padding: 4,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  priorityOptionActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  priorityOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  priorityOptionTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
