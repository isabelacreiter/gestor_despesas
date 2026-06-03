import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  getFirestoreDatabase,
} from "@/services/firebase";
import type { IncomeEntry, IncomeEntryInput } from "@/services/income-entry-types";

const incomeEntriesCollectionName = "income_entries";

function getIncomeEntriesCollection() {
  const database = getFirestoreDatabase();

  if (!database) {
    throw new Error("Firestore não está configurado.");
  }

  return collection(database, incomeEntriesCollectionName);
}

export async function createIncomeEntry(
  incomeEntry: IncomeEntryInput,
) {
  if (incomeEntry.amount <= 0) {
    throw new Error(
      "O valor da entrada deve ser maior que zero.",
    );
  }

  const incomeEntriesCollection =
    getIncomeEntriesCollection();

  const documentReference = await addDoc(
    incomeEntriesCollection,
    {
      title: incomeEntry.title,
      amount: incomeEntry.amount,
      source: incomeEntry.source,
      date: incomeEntry.date,
      createdAt: new Date().toISOString(),
    },
  );

  return {
    id: documentReference.id,
    ...incomeEntry,
  };
}

export function subscribeToIncomeEntries(
  onIncomeEntriesChange: (
    entries: IncomeEntry[],
  ) => void,
) {
  const incomeEntriesCollection =
    getIncomeEntriesCollection();

  const incomeEntriesQuery = query(
    incomeEntriesCollection,
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    incomeEntriesQuery,
    (snapshot) => {
      const entries = snapshot.docs.map(
        (snapshotDocument) => {
          const documentData =
            snapshotDocument.data();

          return {
            id: snapshotDocument.id,
            title: String(
              documentData.title ?? "",
            ),
            amount: Number(
              documentData.amount ?? 0,
            ),
            source: String(
              documentData.source ?? "Outros",
            ),
            date: String(documentData.date ?? ""),
          };
        },
      );

      onIncomeEntriesChange(entries);
    },
  );
}