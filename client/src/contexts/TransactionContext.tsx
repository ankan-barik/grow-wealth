import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionCategory, TransactionType, CategoryColor, MonthlyData } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getCategoryTotals: (type: TransactionType) => { category: TransactionCategory; amount: number }[];
  getMonthlyData: () => MonthlyData[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const categoryColors: CategoryColor = {
  salary: '#4CAF50',
  freelance: '#8BC34A',
  investments: '#009688',
  other_income: '#CDDC39',
  rent: '#F44336',
  groceries: '#FF5722',
  utilities: '#795548',
  entertainment: '#9C27B0',
  transportation: '#3F51B5',
  dining: '#FF9800',
  shopping: '#E91E63',
  healthcare: '#2196F3',
  education: '#00BCD4',
  travel: '#673AB7',
  personal: '#607D8B',
  other_expense: '#9E9E9E'
};

// Use consistent API URL - match with AuthContext
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch transactions from server
  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      console.log('🔄 Fetching transactions from:', `${API_BASE_URL}/api/transactions`);

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Fetch transactions response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Transactions data:', data);
        setTransactions(data.transactions || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch transactions:', errorData);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load transactions when user changes
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add transactions",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      console.log('🔄 Adding transaction to:', `${API_BASE_URL}/api/transactions`);
      console.log('📦 Transaction data:', transaction);

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      console.log('📡 Add transaction response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Added transaction response:', data);
        setTransactions(prev => [data.transaction, ...prev]);
        toast({
          title: "Transaction Added",
          description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} has been added.`,
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to add transaction:', errorData);
        toast({
          title: "Error",
          description: errorData.message || "Failed to add transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: `Failed to add transaction. Please check if server is running on ${API_BASE_URL}`,
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      console.log('🔄 Deleting transaction:', `${API_BASE_URL}/api/transactions/${id}`);

      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Delete transaction response status:', response.status);

      if (response.ok) {
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
        toast({
          title: "Transaction Deleted",
          description: "The transaction has been removed.",
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to delete transaction:', errorData);
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshTransactions = async () => {
    setIsLoading(true);
    await fetchTransactions();
  };

  const getCategoryTotals = (type: TransactionType) => {
    const filteredTransactions = transactions.filter(t => t.type === type);
    const categoryMap = new Map<TransactionCategory, number>();

    filteredTransactions.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + transaction.amount);
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  const getMonthlyData = (): MonthlyData[] => {
    const monthMap = new Map<string, { income: number; expense: number }>();

    // Get the last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = month.toLocaleString('default', { month: 'short' });
      monthMap.set(monthStr, { income: 0, expense: 0 });
    }

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthStr = date.toLocaleString('default', { month: 'short' });

      if (monthMap.has(monthStr)) {
        const monthData = monthMap.get(monthStr)!;

        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else {
          monthData.expense += transaction.amount;
        }

        monthMap.set(monthStr, monthData);
      }
    });

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }));
  };

  const getTotalIncome = (): number => {
    return transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getBalance = (): number => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        deleteTransaction,
        getCategoryTotals,
        getMonthlyData,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        refreshTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);

  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }

  return context;
};
