import { ModulePlaceholder } from './ModulePlaceholder';

export function TasksPage() {
  return (
    <ModulePlaceholder
      moduleName="Tasks & Queues"
      tagline="Dynamic task backlogs, prioritization matrices, and unified triage."
      iconName="CheckSquare"
      stage="Planned for Stage 2"
      plannedFeatures={[
        {
          title: 'Kanban & Matrix Views',
          description: 'Eisenhower priority matrices, custom stages, and velocity tracking.',
        },
        {
          title: 'Autonomous Triage',
          description: 'AI-assisted task sorting, due date estimation, and recurring schedules.',
        },
        {
          title: 'Cross-App Synced Actions',
          description: 'Bidirectional sync with GitHub Issues, Linear, Jira, and Slack saves.',
        },
        {
          title: 'Subtasks & Checklists',
          description: 'Hierarchical subtask trees with contextual file attachments.',
        },
      ]}
    />
  );
}

export function ProjectsPage() {
  return (
    <ModulePlaceholder
      moduleName="Projects & Initiatives"
      tagline="Multi-stage projects, strategic roadmaps, and delivery milestones."
      iconName="Briefcase"
      stage="Planned for Stage 2"
      plannedFeatures={[
        {
          title: 'Gantt & Roadmap Timelines',
          description: 'Visual timeline projection, dependencies, and critical paths.',
        },
        {
          title: 'Milestone Tracking',
          description: 'Deliverable-based checkpoints with automatic completion metrics.',
        },
        {
          title: 'Document & Vault Association',
          description: 'Direct binding of project docs, design briefs, and code repositories.',
        },
        {
          title: 'Health & Risk Indicators',
          description: 'Automated warnings for overdue deliverables and blocked dependencies.',
        },
      ]}
    />
  );
}

export function CalendarPage() {
  return (
    <ModulePlaceholder
      moduleName="Smart Calendar"
      tagline="Time-blocking, schedule orchestration, and cognitive load balancing."
      iconName="Calendar"
      stage="Planned for Stage 2"
      plannedFeatures={[
        {
          title: 'Dynamic Time-Blocking',
          description: 'Automated deep work slots scheduled around meetings.',
        },
        {
          title: 'Calendar Provider Sync',
          description: 'Google Calendar, Outlook, and Apple Calendar bidirectional sync.',
        },
        {
          title: 'Buffer Time & Commute Intelligence',
          description: 'Smart buffer allocation between meetings to reduce cognitive fatigue.',
        },
        {
          title: 'One-Click Meeting Briefs',
          description: 'AI prep documents compiled 10 minutes prior to calls.',
        },
      ]}
    />
  );
}

export function NotesPage() {
  return (
    <ModulePlaceholder
      moduleName="Notes & Knowledge Vault"
      tagline="Personal networked wiki, markdown journaling, and vector semantic search."
      iconName="FileText"
      stage="Planned for Stage 3"
      plannedFeatures={[
        {
          title: 'Bidirectional Wiki Links',
          description: 'Connected graph database of knowledge with [[wiki-style]] linking.',
        },
        {
          title: 'Vector Semantic Search',
          description: 'Retrieve ideas by concepts and themes rather than literal keywords.',
        },
        {
          title: 'Rich Block Editor',
          description: 'Markdown, code syntax highlighting, KaTeX equations, and media embeds.',
        },
        {
          title: 'Daily Journaling Engine',
          description: 'Structured reflection prompts and weekly review summaries.',
        },
      ]}
    />
  );
}

export function HabitsPage() {
  return (
    <ModulePlaceholder
      moduleName="Habits & Routines"
      tagline="Consistency tracking, habit stacking, and behavioral analytics."
      iconName="Repeat"
      stage="Planned for Stage 3"
      plannedFeatures={[
        {
          title: 'Habit Stacking Chains',
          description: 'Trigger next habits upon completion of preceding routines.',
        },
        {
          title: 'Streak Protection',
          description: 'Grace days and vacation pauses to prevent accidental streak losses.',
        },
        {
          title: 'Completion Heatmaps',
          description: 'Yearly GitHub-style habit execution heatmaps and trends.',
        },
        {
          title: 'Smart Reminders',
          description: 'Context-aware notifications calibrated to your daily schedule.',
        },
      ]}
    />
  );
}

export function GoalsPage() {
  return (
    <ModulePlaceholder
      moduleName="Goals & Horizons"
      tagline="Life vision, OKRs, quarterly targets, and milestone celebrations."
      iconName="Target"
      stage="Planned for Stage 3"
      plannedFeatures={[
        {
          title: 'Horizon Hierarchy',
          description: 'Link 5-year visions down to annual goals, quarters, and daily tasks.',
        },
        {
          title: 'Quantitative OKR Meters',
          description: 'Key results tracked with numerical progress and live delta calculations.',
        },
        {
          title: 'Quarterly Review Workflow',
          description: 'Guided end-of-quarter retrospectives and recalibration prompts.',
        },
        {
          title: 'Life Wheel Categories',
          description: 'Balance career, health, relationships, finance, and intellect.',
        },
      ]}
    />
  );
}

export function FinancePage() {
  return (
    <ModulePlaceholder
      moduleName="Personal Finance"
      tagline="Net worth tracking, budget allocations, cash flow, and financial health."
      iconName="CreditCard"
      stage="Planned for Stage 4"
      plannedFeatures={[
        {
          title: 'Net Worth & Asset Tracking',
          description: 'Unified balance sheet spanning liquid cash, investments, and debt.',
        },
        {
          title: 'Cash Flow & Run Rate',
          description: 'Income vs. expense velocity curves and monthly runway estimates.',
        },
        {
          title: 'Zero-Based Budgeting',
          description: 'Allocate every dollar into intentional envelopes and savings buckets.',
        },
        {
          title: 'Recurring Subscription Audit',
          description: 'Automatic detection of recurring charges and unused subscriptions.',
        },
      ]}
    />
  );
}

export function AssistantPage() {
  return (
    <ModulePlaceholder
      moduleName="NEXUS AI Assistant"
      tagline="Your autonomous personal copilot and proactive operating intelligence."
      iconName="Sparkles"
      stage="Planned for Stage 4"
      plannedFeatures={[
        {
          title: 'Autonomous Morning Briefings',
          description: 'Daily synthesis of urgent tasks, key meetings, and focus recommendations.',
        },
        {
          title: 'Tool-Calling & Workflows',
          description: 'Executes actions across calendars, task queues, and external APIs.',
        },
        {
          title: 'Knowledge Vault Synthesis',
          description: 'Instant answers synthesized from your personal notes and history.',
        },
        {
          title: 'Proactive Bottleneck Alerts',
          description: 'Flags overlapping deadlines and overloaded schedules ahead of time.',
        },
      ]}
    />
  );
}

export function InsightsPage() {
  return (
    <ModulePlaceholder
      moduleName="Productivity Insights"
      tagline="Cross-module analytics, focus time metrics, and burnout prevention."
      iconName="BarChart2"
      stage="Planned for Stage 4"
      plannedFeatures={[
        {
          title: 'Focus vs. Meeting Ratio',
          description: 'Quantify weekly deep work hours versus collaborative overhead.',
        },
        {
          title: 'Task Velocity Metrics',
          description: 'Cycle time from creation to completion across priority buckets.',
        },
        {
          title: 'Energy & Cognitive Trends',
          description: 'Identify your peak performance hours throughout the day.',
        },
        {
          title: 'Weekly Executive Report',
          description: 'Generated PDF and email digest summarizing weekly achievements.',
        },
      ]}
    />
  );
}
