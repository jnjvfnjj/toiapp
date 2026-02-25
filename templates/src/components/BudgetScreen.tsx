import { useState } from 'react';
import { ArrowLeft, Plus, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BudgetItem } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { BudgetPieChart } from './BudgetPieChart';
import { useTranslations } from '../i18n/translations';

interface BudgetScreenProps {
  budgetItems: BudgetItem[];
  totalBudget: number;
  onAddItem: (item: BudgetItem) => void;
  onBack: () => void;
  eventName?: string;
}

export function BudgetScreen({ budgetItems, totalBudget, onAddItem, onBack, eventName }: BudgetScreenProps) {
  const t = useTranslations();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: 0,
    description: ''
  });

  const categories = [
    { id: 'venue', name: t.budgetScreen.venue, icon: '🏛️', color: 'from-cyan-400 to-blue-500' },
    { id: 'food', name: t.budgetScreen.food, icon: '🍽️', color: 'from-orange-400 to-red-500' },
    { id: 'decor', name: t.budgetScreen.decor, icon: '🎨', color: 'from-purple-400 to-pink-500' },
    { id: 'music', name: t.budgetScreen.music, icon: '🎵', color: 'from-green-400 to-emerald-500' },
    { id: 'photo', name: t.budgetScreen.photo, icon: '📸', color: 'from-blue-400 to-indigo-500' },
    { id: 'other', name: t.budgetScreen.other, icon: '💼', color: 'from-gray-400 to-gray-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.category && newItem.amount > 0) {
      onAddItem({
        id: Date.now().toString(),
        ...newItem
      });
      setNewItem({ category: '', amount: 0, description: '' });
      setIsAddingItem(false);
    }
  };

  const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = (totalSpent / totalBudget) * 100;

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-6">
        <button onClick={onBack} className="mb-4 p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="mb-2">{eventName || t.budgetScreen.title}</h1>
        <p className="text-cyan-100">{eventName ? `${t.budgetScreen.title}: ${eventName}` : t.budgetScreen.subtitle}</p>
      </div>

      {/* Budget overview */}
      <div className="px-6 -mt-4">
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground mb-1">{t.budgetScreen.total}</p>
              <h2 className="text-card-foreground">{totalBudget.toLocaleString()} сом</h2>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 ${
                percentageUsed > 100
                  ? 'bg-gradient-to-r from-red-500 to-rose-600'
                  : 'bg-gradient-to-r from-green-400 to-emerald-500'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-popover rounded-xl p-3">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span>{t.budgetScreen.spent}</span>
              </div>
              <p className="text-card-foreground">{totalSpent.toLocaleString()} сом</p>
            </div>
            <div className={`rounded-xl p-3 ${remaining >= 0 ? 'bg-popover' : 'bg-popover'}`}>
              <div className={`flex items-center gap-2 mb-1 ${remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                <span>{t.budgetScreen.remaining}</span>
              </div>
              <p className={remaining >= 0 ? 'text-card-foreground' : 'text-card-foreground'}>
                {remaining.toLocaleString()} сом
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add expense button */}
      <div className="px-6 py-4">
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl py-6 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              {t.budgetScreen.addExpense}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{t.budgetScreen.newExpenseTitle}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">{t.budgetScreen.categoryLabel} *</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewItem({ ...newItem, category: cat.id })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        newItem.category === cat.id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-gray-700">{cat.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-700">{t.budgetScreen.amountLabel} *</label>
                <Input
                  type="number"
                  value={newItem.amount || ''}
                  onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                  placeholder="0"
                  required
                  className="rounded-xl border-2 border-gray-200 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">{t.budgetScreen.descriptionLabel}</label>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Опционально"
                  className="rounded-xl border-2 border-gray-200 focus:border-cyan-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl py-3"
              >
                {t.budgetScreen.addExpense}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expense list */}
      <div className="px-6 pb-24">
        {budgetItems.length > 0 && (
          <div className="mb-6">
              <h3 className="mb-4 text-card-foreground">{t.budgetScreen.title}</h3>
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <BudgetPieChart budgetItems={budgetItems} />
              </div>
            </div>
        )}

        <h3 className="mb-4 text-cyan-900">{t.budgetScreen.expensesTitle}</h3>
        
        {budgetItems.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-popover flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t.budgetScreen.emptyExpensesNote}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {budgetItems.map((item) => {
              const categoryInfo = getCategoryInfo(item.category);
              return (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center text-2xl`}>
                      {categoryInfo.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-card-foreground">{categoryInfo.name}</h4>
                      {item.description && (
                        <p className="text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-card-foreground">{item.amount.toLocaleString()}</p>
                      <p className="text-muted-foreground">сом</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}