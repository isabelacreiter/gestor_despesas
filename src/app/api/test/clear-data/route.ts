import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getFirestoreDatabase } from "@/services/firebase";

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Forbidden in production" }, { status: 403 });
  }

  const db = getFirestoreDatabase();
  if (!db) {
    return Response.json({ cleared: true, skipped: "firebase not configured" });
  }

  for (const col of ["expenses", "income_entries"]) {
    const snap = await getDocs(collection(db, col));
    await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, col, d.id))));
  }

  return Response.json({ cleared: true });
}
