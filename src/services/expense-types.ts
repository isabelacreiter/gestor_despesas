export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  date: string;
  category: string;
}

export const expenseCategories = [
  "Alimentacao",
  "Transporte",
  "Moradia",
  "Saude",
  "Educacao",
  "Outros",
];

export const demoMonthlyIncome = 8200;

export function getTodayDateString() {
  const currentDate = new Date();
  const timezoneOffset = currentDate.getTimezoneOffset() * 60_000;

  return new Date(currentDate.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}
