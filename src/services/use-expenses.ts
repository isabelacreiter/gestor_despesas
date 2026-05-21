"use client";

import { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  subscribeToExpenses,
} from "@/services/expense-service";
import { isFirebaseConfigured } from "@/services/firebase";
import type { Expense, ExpenseInput } from "@/services/expense-types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(
    null,
  );
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToExpenses(
      (nextExpenses) => {
        setExpenses(nextExpenses);
        setLoading(false);
        setError(null);
      },
      (subscriptionError) => {
        setLoading(false);
        setError(subscriptionError.message);
      },
    );

    return unsubscribe;
  }, [firebaseReady]);

  async function addExpense(expense: ExpenseInput) {
    setIsSubmitting(true);
    setError(null);

    try {
      await createExpense(expense);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível salvar a despesa.";

      setError(message);
      throw submissionError;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeExpense(id: string) {
    setDeletingExpenseId(id);
    setError(null);

    try {
      await deleteExpense(id);
    } catch (deletionError) {
      const message =
        deletionError instanceof Error
          ? deletionError.message
          : "Não foi possível excluir a despesa.";

      setError(message);
      throw deletionError;
    } finally {
      setDeletingExpenseId(null);
    }
  }

  return {
    addExpense,
    deleteExpense: removeExpense,
    deletingExpenseId,
    error,
    expenses,
    isConfigured: firebaseReady,
    isSubmitting,
    loading,
  };
}
