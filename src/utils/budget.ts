import type { BudgetItem, BudgetCategory, CelebrationEvent } from '../types';

/**
 * Calculate total spent (actual) across all budget items
 */
export function getTotalActual(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + item.actual, 0);
}

/**
 * Calculate total estimated across all budget items
 */
export function getTotalEstimated(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + item.estimated, 0);
}

/**
 * Calculate total paid across all budget items
 */
export function getTotalPaid(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + item.paid, 0);
}

/**
 * Get budget utilization percentage (actual / total budget * 100)
 */
export function getBudgetUtilization(event: CelebrationEvent): number {
  if (event.totalBudget === 0) return 0;
  return Math.round((getTotalActual(event.budgetItems) / event.totalBudget) * 100);
}

/**
 * Get remaining budget
 */
export function getRemainingBudget(event: CelebrationEvent): number {
  return event.totalBudget - getTotalActual(event.budgetItems);
}

/**
 * Get budget breakdown by category
 */
export function getCategoryBreakdown(items: BudgetItem[]): Record<BudgetCategory, { estimated: number; actual: number; paid: number }> {
  const categories: BudgetCategory[] = [
    'venue', 'catering', 'decor', 'entertainment', 'photography',
    'attire', 'logistics', 'stationery', 'favors', 'contingency', 'other',
  ];

  const breakdown = {} as Record<BudgetCategory, { estimated: number; actual: number; paid: number }>;

  for (const cat of categories) {
    const catItems = items.filter(i => i.category === cat);
    breakdown[cat] = {
      estimated: catItems.reduce((s, i) => s + i.estimated, 0),
      actual: catItems.reduce((s, i) => s + i.actual, 0),
      paid: catItems.reduce((s, i) => s + i.paid, 0),
    };
  }

  return breakdown;
}

/**
 * Get variance (actual - estimated) for a budget item
 */
export function getVariance(item: BudgetItem): number {
  return item.actual - item.estimated;
}

/**
 * Format currency with Indian/USD formatting
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate per-guest cost
 */
export function getPerGuestCost(event: CelebrationEvent): number {
  if (event.guestCount === 0) return 0;
  return Math.round(getTotalActual(event.budgetItems) / event.guestCount);
}

/**
 * Get the top spending categories (sorted by actual)
 */
export function getTopCategories(items: BudgetItem[], limit = 5): { category: BudgetCategory; total: number }[] {
  const breakdown = getCategoryBreakdown(items);
  return Object.entries(breakdown)
    .map(([category, data]) => ({ category: category as BudgetCategory, total: data.actual }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
