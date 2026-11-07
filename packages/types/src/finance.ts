export type FinancialAccountType = 'checking' | 'savings' | 'investment' | 'credit' | 'crypto';

export interface FinancialAccount {
  id: string;
  user_id: string;
  name: string;
  type: FinancialAccountType;
  balance: number;
  currency: string;
  institution?: string | null;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  account_id?: string | null;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  date: string;
  created_at: string;
}

export interface FinancialBudget {
  id: string;
  user_id: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  period: string;
  updated_at: string;
}

export interface FinancialOverviewSummary {
  net_worth: number;
  total_assets: number;
  total_liabilities: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate_percent: number;
  accounts: FinancialAccount[];
  recent_transactions: FinancialTransaction[];
  budgets: FinancialBudget[];
}

