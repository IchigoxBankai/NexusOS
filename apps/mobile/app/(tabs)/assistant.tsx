import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';
import type { AssistantMessage, AssistantActionProposal } from '@nexus/types';

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: 'asst_1',
    role: 'assistant',
    content: `Good day, Cassius. Your NEXUS mobile brain is synchronized.

• 2 hours 30 mins deep focus allocated today.
• 4 priority actions in engineering queue.
• Net cash flow remains positive (+$5,840).

How can I assist your workflow right now?`,
    timestamp: '09:00 AM',
    actions: [
      {
        id: 'act_mob_1',
        type: 'schedule_meeting',
        title: 'Protect 90-min Focus Slot at 14:00',
        payload: { duration: 90 },
      },
      {
        id: 'act_mob_2',
        type: 'create_task',
        title: 'Triage High-Priority Mobile Tasks',
        payload: { queue: 'Mobile' },
      },
    ],
  },
];

const STARTER_PROMPTS = [
  'Morning briefing',
  'Protect deep work',
  'Triage tasks',
  'Financial health',
];

export default function MobileAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const handleExecuteAction = (action: AssistantActionProposal) => {
    setExecutedActions((prev) => ({ ...prev, [action.id]: true }));
    Alert.alert('Action Executed', `NEXUS executed: "${action.title}"`);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: AssistantMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let reply = '';
      let actions: AssistantActionProposal[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('briefing') || lower.includes('morning')) {
        reply = `Morning Executive Summary:
1. Complete Rust token bucket review.
2. Synchronize Supabase RLS migrations.
3. Habit streak: 14 consecutive days on Deep Work.`;
        actions = [
          {
            id: `act_${Date.now()}_1`,
            type: 'reorganize_day',
            title: 'Auto-arrange calendar buffer slots',
            payload: {},
          },
        ];
      } else if (lower.includes('deep work') || lower.includes('protect')) {
        reply = `Deep work protected! External notifications muted between 15:30 and 17:00.`;
        actions = [
          {
            id: `act_${Date.now()}_2`,
            type: 'schedule_meeting',
            title: 'Lock in 15:30 - 17:00 Deep Work Block',
            payload: {},
          },
        ];
      } else if (lower.includes('finance') || lower.includes('health')) {
        reply = `Financial overview:
• Liquid Net Worth: $248,650
• Monthly cash flow: +$5,840
• SaaS & Cloud budget: $320 of $450 utilized (healthy).`;
      } else {
        reply = `Processed request: "${text}". Checked against your knowledge vault, calendar schedule, and priority queues.`;
        actions = [
          {
            id: `act_${Date.now()}_gen`,
            type: 'create_task',
            title: `Create follow-up task for "${text.slice(0, 30)}..."`,
            payload: {},
          },
        ];
      }

      const asstMsg: AssistantMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions,
      };

      setMessages((prev) => [...prev, asstMsg]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>NEXUS AI Copilot</Text>
            <Text style={styles.subtitle}>Autonomous Mobile Intelligence Engine</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Message Thread */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => {
            const isAsst = msg.role === 'assistant';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isAsst ? styles.asstWrapper : styles.userWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isAsst ? styles.asstBubble : styles.userBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isAsst ? styles.asstText : styles.userText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                  <Text
                    style={[
                      styles.timestampText,
                      isAsst ? styles.asstTimestamp : styles.userTimestamp,
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>

                {/* Embedded Action Proposals */}
                {msg.actions && msg.actions.length > 0 && (
                  <View style={styles.actionsContainer}>
                    <Text style={styles.actionLabel}>Proposed Actions:</Text>
                    {msg.actions.map((act) => {
                      const isDone = executedActions[act.id];

                      return (
                        <TouchableOpacity
                          key={act.id}
                          onPress={() => !isDone && handleExecuteAction(act)}
                          disabled={isDone}
                          style={[
                            styles.actionPill,
                            isDone && styles.actionPillDone,
                          ]}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name={isDone ? 'checkmark-circle' : 'flash-outline'}
                            size={14}
                            color={isDone ? '#10B981' : '#6366F1'}
                          />
                          <Text
                            style={[
                              styles.actionPillText,
                              isDone && styles.actionPillTextDone,
                            ]}
                          >
                            {act.title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Starters */}
        <View style={styles.starterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.starterScroll}>
            {STARTER_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSendMessage(prompt)}
                style={styles.starterPill}
              >
                <Text style={styles.starterText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask NEXUS to triage, plan or block..."
            placeholderTextColor="#94A3B8"
            style={styles.inputField}
            onSubmitEditing={() => handleSendMessage()}
          />
          <TouchableOpacity
            onPress={() => handleSendMessage()}
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
          >
            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  messagesContainer: {
    padding: theme.spacing.md,
    gap: 16,
  },
  messageWrapper: {
    maxWidth: '85%',
  },
  asstWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
  },
  asstBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#0F172A',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  asstText: {
    color: '#0F172A',
  },
  userText: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 9,
    marginTop: 4,
  },
  asstTimestamp: {
    color: '#94A3B8',
  },
  userTimestamp: {
    color: '#CBD5E1',
    alignSelf: 'flex-end',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 6,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  actionPillDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  actionPillTextDone: {
    color: '#059669',
    textDecorationLine: 'line-through',
  },
  starterBar: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  starterScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: 6,
  },
  starterPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  starterText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  inputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
