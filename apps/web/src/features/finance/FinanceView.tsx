import { useState } from 'react';
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  PieChart,
  Wallet,
  Building,
  ShieldCheck,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { FinancialAccount, FinancialTransaction, FinancialBudget } from '@nexus/types';

const INITIAL_ACCOUNTS: FinancialAccount[] = [
  {
    id: 'acc1',
    user_id: 'u1',
    name: 'Primary Operating Checking',
    type: 'checking',
    balance: 14250.8,
    currency: 'USD',
    institution: 'Chase Bank',
    updated_at: '2026-05-07',
  },
  {
    id: 'acc2',
    user_id: 'u1',
    name: 'High-Yield Emergency Vault (4.8%)',
    type: 'savings',
    balance: 55400.0,
    currency: 'USD',
    institution: 'Marcus Goldman Sachs',
    updated_at: '2026-05-07',
  },
  {
    id: 'acc3',
    user_id: 'u1',
    name: 'Global Index Portfolio (Vanguard)',
    type: 'investment',
    balance: 168920.5,
    currency: 'USD',
    institution: 'Vanguard',
    updated_at: '2026-05-07',
  },
  {
    id: 'acc4',
    user_id: 'u1',
    name: 'Cold Storage Vault (BTC / ETH)',
    type: 'crypto',
    balance: 24500.0,
    currency: 'USD',
    institution: 'Ledger HW',
    updated_at: '2026-05-07',
  },
  {
    id: 'acc5',
    user_id: 'u1',
    name: 'Corporate Rewards Platinum',
    type: 'credit',
    balance: -2840.3,
    currency: 'USD',
    institution: 'Amex',
    updated_at: '2026-05-07',
  },
];

const INITIAL_BUDGETS: FinancialBudget[] = [
  {
    id: 'b1',
    user_id: 'u1',
    category: 'Housing & Utilities',
    allocated_amount: 2800,
    spent_amount: 2650,
    period: 'Monthly',
    updated_at: '2026-05-07',
  },
  {
    id: 'b2',
    user_id: 'u1',
    category: 'Cloud, AI & Software',
    allocated_amount: 450,
    spent_amount: 320,
    period: 'Monthly',
    updated_at: '2026-05-07',
  },
  {
    id: 'b3',
    user_id: 'u1',
    category: 'Food & Nutrition',
    allocated_amount: 900,
    spent_amount: 710,
    period: 'Monthly',
    updated_at: '2026-05-07',
  },
  {
    id: 'b4',
    user_id: 'u1',
    category: 'Health & Athletic Performance',
    allocated_amount: 350,
    spent_amount: 195,
    period: 'Monthly',
    updated_at: '2026-05-07',
  },
];

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 't1',
    user_id: 'u1',
    title: 'Consulting Retainer — FinTech AI Strategy',
    amount: 8500.0,
    type: 'income',
    category: 'Consulting',
    date: '2026-05-05',
    created_at: '2026-05-05',
  },
  {
    id: 't2',
    user_id: 'u1',
    title: 'Anthropic Claude API & Supabase Infrastructure',
    amount: 142.5,
    type: 'expense',
    category: 'Cloud, AI & Software',
    date: '2026-05-04',
    created_at: '2026-05-04',
  },
  {
    id: 't3',
    user_id: 'u1',
    title: 'Whole Foods Organic Groceries',
    amount: 168.2,
    type: 'expense',
    category: 'Food & Nutrition',
    date: '2026-05-03',
    created_at: '2026-05-03',
  },
  {
    id: 't4',
    user_id: 'u1',
    title: 'Vanguard Automatic Index ETF Allocation',
    amount: 2500.0,
    type: 'transfer',
    category: 'Investments',
    date: '2026-05-01',
    created_at: '2026-05-01',
  },
];

export function FinanceView() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(INITIAL_ACCOUNTS);
  const [budgets, setBudgets] = useState<FinancialBudget[]>(INITIAL_BUDGETS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const { addToast } = useToastStore();

  // New Transaction Form State
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<FinancialTransaction['type']>('expense');
  const [txCategory, setTxCategory] = useState('General');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Net Worth calculations
  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((acc, a) => acc + a.balance, 0);

  const totalLiabilities = Math.abs(
    accounts
      .filter((a) => a.balance < 0)
      .reduce((acc, a) => acc + a.balance, 0)
  );

  const netWorth = totalAssets - totalLiabilities;

  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter(
    (t) => txFilter === 'all' || t.type === txFilter
  );

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount) return;

    const amountNum = parseFloat(txAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newTx: FinancialTransaction = {
      id: `tx_${Date.now()}`,
      user_id: 'u1',
      title: txTitle.trim(),
      amount: amountNum,
      type: txType,
      category: txCategory,
      date: txDate,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Also update budget if expense
    if (txType === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === txCategory ? { ...b, spent_amount: b.spent_amount + amountNum } : b
        )
      );
    }

    setIsAddTxOpen(false);
    setTxTitle('');
    setTxAmount('');
    addToast('Transaction recorded successfully', 'success');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast('Transaction deleted', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
              <CreditCard className="w-6 h-6" />
            </span>
            Personal Finance & Wealth OS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time balance telemetry, liquid net worth tracking, and cash-flow envelope budgeting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddTxOpen(true)}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Net Worth Hero Dashboard */}
      <Card className="p-6 md:p-8 backdrop-blur-xl bg-white/85 border-slate-200/80 shadow-sm rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Net Worth
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                +4.2% MoM
              </span>
            </div>
            <div className="text-4xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight">
              ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Synchronized across 5 integrated financial repositories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Total Liquid Assets</span>
            <span className="text-xl font-bold text-emerald-600 mt-2">
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Cash, High Yield & Equities</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Liabilities & Credit</span>
            <span className="text-xl font-bold text-rose-500 mt-2">
              -${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Revolving 0-APR Balance</span>
          </div>
        </div>
      </Card>

      {/* Accounts & Budget Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Accounts List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-slate-500" />
              Connected Accounts
            </h2>
            <span className="text-xs text-slate-400">{accounts.length} active ledgers</span>
          </div>

          <div className="space-y-3">
            {accounts.map((acc) => (
              <Card
                key={acc.id}
                className="p-4 backdrop-blur-xl bg-white/80 border-slate-200/80 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      'p-2.5 rounded-xl border',
                      acc.type === 'checking' && 'bg-blue-50 text-blue-600 border-blue-100',
                      acc.type === 'savings' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                      acc.type === 'investment' && 'bg-purple-50 text-purple-600 border-purple-100',
                      acc.type === 'crypto' && 'bg-amber-50 text-amber-600 border-amber-100',
                      acc.type === 'credit' && 'bg-rose-50 text-rose-600 border-rose-100'
                    )}
                  >
                    {acc.type === 'investment' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : acc.type === 'credit' ? (
                      <CreditCard className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{acc.name}</h4>
                    <span className="text-xs text-slate-400">{acc.institution} • {acc.type}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={cn(
                      'text-sm font-bold',
                      acc.balance < 0 ? 'text-rose-600' : 'text-slate-900'
                    )}
                  >
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-400">USD</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Budget Envelopes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-500" />
              Monthly Envelopes
            </h2>
            <span className="text-xs text-emerald-600 font-medium">May 2026</span>
          </div>

          <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 rounded-2xl space-y-4">
            {budgets.map((b) => {
              const pct = Math.min(100, Math.round((b.spent_amount / b.allocated_amount) * 100));
              const isOver = b.spent_amount > b.allocated_amount;

              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{b.category}</span>
                    <span className={cn('font-semibold', isOver ? 'text-rose-600' : 'text-slate-600')}>
                      ${b.spent_amount} / ${b.allocated_amount}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isOver
                          ? 'bg-rose-500'
                          : pct > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{pct}% utilized</span>
                    <span>${b.allocated_amount - b.spent_amount} remaining</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Transaction History & Cash Flow Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            Recent Cash Flow Ledger
          </h2>

          <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/70 text-xs">
            <button
              onClick={() => setTxFilter('all')}
              className={cn(
                'px-3 py-1 rounded-full font-medium transition-all',
                txFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              All
            </button>
            <button
              onClick={() => setTxFilter('income')}
              className={cn(
                'px-3 py-1 rounded-full font-medium transition-all',
                txFilter === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Income
            </button>
            <button
              onClick={() => setTxFilter('expense')}
              className={cn(
                'px-3 py-1 rounded-full font-medium transition-all',
                txFilter === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Expenses
            </button>
          </div>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      'p-2 rounded-xl border',
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : tx.type === 'expense'
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    )}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : tx.type === 'expense' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{tx.title}</h4>
                    <span className="text-xs text-slate-400">
                      {tx.category} • {tx.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'text-sm font-bold',
                      tx.type === 'income'
                        ? 'text-emerald-600'
                        : tx.type === 'expense'
                        ? 'text-slate-900'
                        : 'text-blue-600'
                    )}
                  >
                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}$
                    {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>

                  <button
                    onClick={() => handleDeleteTransaction(tx.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} title="Record New Transaction">
        <form onSubmit={handleAddTransaction} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Transaction Description</label>
            <Input
              value={txTitle}
              onChange={(e) => setTxTitle(e.target.value)}
              placeholder="e.g. AWS Cloud Hosting Invoice"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Amount ($)</label>
              <Input
                type="number"
                step="0.01"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="150.00"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
              <select
                value={txType}
                onChange={(e) => setTxType(e.target.value as FinancialTransaction['type'])}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <Input
                value={txCategory}
                onChange={(e) => setTxCategory(e.target.value)}
                placeholder="Cloud, AI & Software"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <Input
                type="date"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsAddTxOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white rounded-xl">
              Record Transaction
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

