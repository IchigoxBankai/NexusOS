import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { nexusQueryKeys } from '@nexus/api';
import { dashboardService } from '../../lib/services';
import { useMobileAuthStore } from '../../lib/authStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { theme } from '../../lib/theme';
import type { ActionItem } from '@nexus/types';

export default function MobileDashboard() {
  const { user, profile, usePreviewData, togglePreviewData } = useMobileAuthStore();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...nexusQueryKeys.dashboard.commandCenter(user?.id), usePreviewData],
    queryFn: async () => {
      return dashboardService.getCommandCenterData({
        userId: user?.id,
        usePreviewSample: usePreviewData,
        userFullName: profile?.full_name || undefined,
      });
    },
  });

  const handleTaskAction = (actionId: string, actionKey: string, title: string) => {
    if (actionKey === 'complete') {
      setCompletedTaskIds((prev) => [...prev, actionId]);
      Alert.alert('Action Completed', `"${title}" marked as complete.`);
    } else {
      Alert.alert('Action Triggered', `Triggered ${actionKey} for "${title}".`);
    }
  };

  const displayName = profile?.full_name?.split(' ')[0] || 'Cassius';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Syncing NEXUS Command Center...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load Command Center.</Text>
          <Button title="Retry" onPress={() => refetch()} style={{ marginTop: 12 }} />
        </View>
      </SafeAreaView>
    );
  }

  const activeActions = data.actions.filter((a) => !completedTaskIds.includes(a.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Floating Prompt & Date Bar */}
        <View style={styles.topBar}>
          <View style={styles.searchPill}>
            <Ionicons name="mic" size={14} color="#64748B" />
            <Text style={styles.searchPillText}>How can I help?</Text>
            <View style={styles.cmdBadge}>
              <Text style={styles.cmdBadgeText}>⌘K</Text>
            </View>
          </View>

          <Text style={styles.dateText}>{data.formattedDate}</Text>
        </View>

        {/* Development Environment Flag Toggle */}
        <TouchableOpacity
          onPress={togglePreviewData}
          style={styles.previewToggleBar}
          activeOpacity={0.8}
        >
          <Ionicons
            name={usePreviewData ? 'eye' : 'eye-off'}
            size={14}
            color={theme.colors.primary}
          />
          <Text style={styles.previewToggleText}>
            {usePreviewData ? 'Preview Sample Mode Active' : 'Authentic Empty State Active'}
          </Text>
          <Text style={styles.previewToggleAction}>[Switch]</Text>
        </TouchableOpacity>

        {/* Greeting Banner */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            {data.greeting},{' '}
            <Text style={{ fontWeight: '700', color: theme.colors.textPrimary }}>{displayName}</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>
            Your unified operating system across apps and tasks.
          </Text>
        </View>

        {/* Daily Stats Grid */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{data.stats.pendingTasksCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>
              {data.stats.completedTodayCount}
            </Text>
            <Text style={styles.statLabel}>Done Today</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
              {data.stats.upcomingMeetingsCount}
            </Text>
            <Text style={styles.statLabel}>Events</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
              {data.stats.activeHabitsStreak}d
            </Text>
            <Text style={styles.statLabel}>Streak</Text>
          </Card>
        </View>

        {/* Actions Card matching reference image */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Actions</Text>
              <Text style={styles.sectionSubtitle}>
                {activeActions.length === 0
                  ? 'No tasks remaining'
                  : `${activeActions.length} tasks to complete`}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => Alert.alert('New Action', 'Create new action item.')}
                style={styles.iconCircle}
              >
                <Ionicons name="add" size={16} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          {activeActions.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Queue clear</Text>
              <Text style={styles.emptySubtitle}>No pending tasks for today.</Text>
            </View>
          ) : (
            activeActions.map((task: ActionItem) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <View style={styles.taskAppIcon}>
                    <Text style={styles.taskAppText}>
                      {task.sourceApp === 'Slack' ? '#' : 'Fg'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    {task.subtitle && <Text style={styles.taskSubtitle}>{task.subtitle}</Text>}
                  </View>
                </View>

                {/* Action Pills */}
                <View style={styles.pillsRow}>
                  {task.actions.map((act) => (
                    <TouchableOpacity
                      key={act.id}
                      onPress={() => handleTaskAction(task.id, act.actionKey, task.title)}
                      style={styles.actionPill}
                    >
                      <Text style={styles.actionPillText}>{act.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </Card>

        {/* For You Feed Card matching reference image */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>For you</Text>
              <Text style={styles.sectionSubtitle}>What's going on around you</Text>
            </View>
          </View>

          {data.forYouItems.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No activity feeds</Text>
              <Text style={styles.emptySubtitle}>Connected apps haven't sent events.</Text>
            </View>
          ) : (
            data.forYouItems.map((item) => (
              <View key={item.id} style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.feedTitle}>{item.title}</Text>
                  {item.subtitle && <Text style={styles.feedSubtitle}>{item.subtitle}</Text>}
                </View>
                <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
              </View>
            ))
          )}
        </Card>

        {/* AI Copilot Card */}
        <Card style={[styles.sectionCard, styles.aiCard]}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
            <Text style={styles.aiTitle}>NEXUS AI Copilot</Text>
          </View>
          <Text style={styles.aiDescription}>
            Autonomous engine ready to coordinate your schedule, prioritize action items, and draft responses.
          </Text>
        </Card>
      </ScrollView>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.danger,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchPillText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  cmdBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  cmdBadgeText: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  previewToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: theme.radius.md,
    padding: 8,
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  previewToggleText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  previewToggleAction: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  greetingSection: {
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: theme.radius.md,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  taskAppIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskAppText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  taskSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionPillText: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  feedTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  feedSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  aiCard: {
    backgroundColor: '#F5F3FF',
    borderColor: '#EDE9FE',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338CA',
  },
  aiDescription: {
    fontSize: 11,
    color: '#6366F1',
    lineHeight: 16,
  },
  emptyBox: {
    padding: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});

