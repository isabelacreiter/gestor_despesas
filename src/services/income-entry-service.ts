import { isFirebaseConfigured } from "@/services/firebase";
import type {
  IncomeEntry,
  IncomeEntryInput,
} from "@/services/income-entry-types";

export async function createIncomeEntry(incomeEntry: IncomeEntryInput) {
  void incomeEntry;

  // TODO implement: persistir entradas no Firestore em uma coleção dedicada.
  // TODO implement: validar regras de negócio antes de salvar.
  // TODO implement: devolver o registro criado para refletir no dashboard.
  throw new Error(
    "TODO implement: conclua a feature de entradas antes de salvar no Firestore.",
  );
}

export function subscribeToIncomeEntries(
  onIncomeEntriesChange: (entries: IncomeEntry[]) => void,
) {
  if (!isFirebaseConfigured()) {
    onIncomeEntriesChange([]);
    return () => undefined;
  }

  // TODO implement: sincronizar a coleção de entradas com o Firestore.
  onIncomeEntriesChange([]);

  return () => undefined;
}
