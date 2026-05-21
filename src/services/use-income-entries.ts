"use client";

import { useEffect, useState } from "react";
import {
  createIncomeEntry,
  subscribeToIncomeEntries,
} from "@/services/income-entry-service";
import { isFirebaseConfigured } from "@/services/firebase";
import {
  demoMonthlyIncomeFallback,
  type IncomeEntry,
  type IncomeEntryInput,
} from "@/services/income-entry-types";

export function useIncomeEntries() {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToIncomeEntries((nextEntries) => {
      setIncomeEntries(nextEntries);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [firebaseReady]);

  async function addIncomeEntry(incomeEntry: IncomeEntryInput) {
    setIsSubmitting(true);
    setError(null);

    try {
      await createIncomeEntry(incomeEntry);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível salvar a entrada.";

      setError(message);
      throw submissionError;
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalIncome =
    incomeEntries.reduce(
      (currentTotal, incomeEntry) => currentTotal + incomeEntry.amount,
      0,
    ) || demoMonthlyIncomeFallback;

  return {
    addIncomeEntry,
    error,
    incomeEntries,
    isConfigured: firebaseReady,
    isSubmitting,
    loading,
    totalIncome,
  };
}
