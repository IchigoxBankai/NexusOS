import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';

export default function MobileTasks() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Actions & Tasks</Text>
          <Text style={styles.subtitle}>Unified queue and priority triage.</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Stage 2 Planned</Text>
          </View>
          <Text style={styles.cardTitle}>Mobile Action Queue</Text>
          <Text style={styles.cardDesc}>
            Full mobile queue, drag-to-reorder prioritization, and push-synced external actions will be delivered in Stage 2.
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
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  card: {
    padding: theme.spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    marginBottom: 10,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
