import { describe, it, expect } from 'vitest';
import {
  getTotalActual,
  getTotalEstimated,
  getTotalPaid,
  getBudgetUtilization,
  getRemainingBudget,
  getVariance,
  getCategoryBreakdown,
  getPerGuestCost,
} from './budget';
import type { BudgetItem, CelebrationEvent } from '../types';

describe('Budget Calculation Engine', () => {
  const mockItems: BudgetItem[] = [
    { id: '1', category: 'venue', name: 'Palace Hall', estimated: 200000, actual: 210000, paid: 100000, notes: '' },
    { id: '2', category: 'catering', name: 'Gourmet Feast', estimated: 150000, actual: 140000, paid: 70000, notes: '' },
    { id: '3', category: 'decor', name: 'Floral Canopy', estimated: 50000, actual: 50000, paid: 50000, notes: '' },
  ];

  const mockEvent: CelebrationEvent = {
    id: 'ev-1',
    name: 'Grand Wedding',
    type: 'wedding',
    date: '2026-12-31',
    guestCount: 200,
    totalBudget: 500000,
    description: 'A royal wedding',
    location: 'Jaipur',
    createdAt: new Date().toISOString(),
    budgetItems: mockItems,
    timeline: [],
    vendors: [],
    checklist: [],
    themes: [],
    invitations: [],
    activities: [],
  };

  it('calculates total actual spend correctly', () => {
    expect(getTotalActual(mockItems)).toBe(400000);
  });

  it('calculates total estimated budget correctly', () => {
    expect(getTotalEstimated(mockItems)).toBe(400000);
  });

  it('calculates total paid deposits correctly', () => {
    expect(getTotalPaid(mockItems)).toBe(220000);
  });

  it('calculates budget utilization percentage correctly', () => {
    // 400000 / 500000 * 100 = 80%
    expect(getBudgetUtilization(mockEvent)).toBe(80);
  });

  it('calculates remaining budget correctly', () => {
    // 500000 - 400000 = 100000
    expect(getRemainingBudget(mockEvent)).toBe(100000);
  });

  it('calculates cost per guest correctly', () => {
    // 400000 / 200 = 2000 per guest
    expect(getPerGuestCost(mockEvent)).toBe(2000);
  });

  it('computes variance correctly', () => {
    expect(getVariance(mockItems[0]!)).toBe(10000); // 210000 - 200000
    expect(getVariance(mockItems[1]!)).toBe(-10000); // 140000 - 150000
  });

  it('aggregates category breakdown accurately', () => {
    const breakdown = getCategoryBreakdown(mockItems);
    expect(breakdown.venue.actual).toBe(210000);
    expect(breakdown.catering.actual).toBe(140000);
    expect(breakdown.decor.actual).toBe(50000);
    expect(breakdown.entertainment.actual).toBe(0);
  });
});
