import { getTodayDateString } from "@/services/expense-types";

export interface IncomeEntry {
  id: string;
  title: string;
  amount: number;
  date: string;
  source: string;
}

export interface IncomeEntryInput {
  title: string;
  amount: number;
  date: string;
  source: string;
}

export const incomeSources = [
  "Salario",
  "Reembolso",
  "Venda",
  "Outros",
];

export const demoMonthlyIncomeFallback = 8200;

export function createInitialIncomeEntryInput(): IncomeEntryInput {
  return {
    amount: 0,
    date: getTodayDateString(),
    source: incomeSources[0],
    title: "",
  };
}
