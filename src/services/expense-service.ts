import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getFirestoreDatabase, getMissingFirebaseEnvironmentVariables } from "@/services/firebase";
import type { Expense, ExpenseInput } from "@/services/expense-types";

const expensesCollectionName = "expenses";

export class FirestoreConfigurationError extends Error {
  constructor() {
    const missingEnvironmentVariables =
      getMissingFirebaseEnvironmentVariables().join(", ");

    super(
      `Firestore indisponível. Configure as variáveis ${missingEnvironmentVariables} para habilitar a persistência.`,
    );
    this.name = "FirestoreConfigurationError";
  }
}

function getExpensesCollection() {
  const database = getFirestoreDatabase();

  if (!database) {
    throw new FirestoreConfigurationError();
  }

  return collection(database, expensesCollectionName);
}

export async function createExpense(expenseInput: ExpenseInput) {
  // Validar regras de negócio para saídas manuais e saídas por OCR.
  if (expenseInput.amount <= 0) {
    throw new Error(
      "O valor da despesa deve ser maior que zero.",
    );
  }

  if (!expenseInput.title.trim()) {
    throw new Error(
      "Informe o título da despesa.",
    );
  }

  if (!expenseInput.date) {
    throw new Error(
      "Informe a data da despesa.",
    );
  }

  if (!expenseInput.category.trim()) {
    throw new Error(
      "Selecione a categoria da despesa.",
    );
  }

  const expensesCollection = getExpensesCollection();

  // Persistir a despesa no Firestore mantendo createdAt para ordenação.
  const documentReference = await addDoc(
    expensesCollection,
    {
      title: expenseInput.title,
      amount: expenseInput.amount,
      date: expenseInput.date,
      category: expenseInput.category,
      createdAt: new Date().toISOString(),
    },
  );

  // Retornar o documento criado para refletir no dashboard.
  return {
    id: documentReference.id,
    ...expenseInput,
  };
}

export async function deleteExpense(id: string) {
  const expensesCollection = getExpensesCollection();
  await deleteDoc(doc(expensesCollection, id));
}

export function subscribeToExpenses(
  onExpensesChange: (expenses: Expense[]) => void,
  onError: (error: Error) => void,
) {
  try {
    const expensesCollection = getExpensesCollection();
    const expensesQuery = query(expensesCollection, orderBy("createdAt", "desc"));

    return onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expenses = snapshot.docs.map((snapshotDocument) => {
          const documentData = snapshotDocument.data();

          return {
            amount: Number(documentData.amount ?? 0),
            category: String(documentData.category ?? "Outros"),
            date: String(documentData.date ?? ""),
            id: snapshotDocument.id,
            title: String(documentData.title ?? ""),
          };
        });

        onExpensesChange(expenses);
      },
      (error) => {
        onError(error as Error);
      },
    );
  } catch (error) {
    onError(error as Error);
    return () => undefined;
  }
}
