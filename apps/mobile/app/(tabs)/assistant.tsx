import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';

export default function MobileAssistant() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>NEXUS AI Copilot</Text>
          <Text style={styles.subtitle}>Mobile autonomous operating assistant.</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Stage 4 Foundation</Text>
          </View>
          <Text style={styles.cardTitle}>Mobile Autonomous Copilot</Text>
          <Text style={styles.cardDesc}>
            Voice-command capture, daily schedule briefings, and on-device intelligent prompts will interface directly with the centralized NEXUS AI engine.
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
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    marginBottom: 10,
  },
  badgeText: {
    color: '#7C3AED',
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
