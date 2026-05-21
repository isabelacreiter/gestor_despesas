"use client";

import { useId, useState, type ChangeEvent } from "react";
import type { ExpenseInput } from "@/services/expense-types";
import {
  extractExpenseFromReceipt,
  getReceiptFileValidationMessage,
  getSupportedReceiptTypesLabel,
} from "@/services/receipt-upload";

interface ReceiptUploadPanelProps {
  onSubmitExpense: (expense: ExpenseInput) => Promise<void>;
  isSubmitting?: boolean;
}

interface PanelFeedback {
  message: string;
  tone: "error" | "neutral" | "success";
}

export function ReceiptUploadPanel({
  isSubmitting = false,
  onSubmitExpense,
}: ReceiptUploadPanelProps) {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<PanelFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);

    const validationMessage = getReceiptFileValidationMessage(nextFile);

    if (validationMessage) {
      setFeedback({
        message: validationMessage,
        tone: "error",
      });
      return;
    }

    if (nextFile) {
      setFeedback({
        message: `Arquivo selecionado: ${nextFile.name}`,
        tone: "neutral",
      });
      return;
    }

    setFeedback(null);
  }

  async function handleAnalyzeReceipt() {
    const validationMessage = getReceiptFileValidationMessage(selectedFile);

    if (validationMessage) {
      setFeedback({
        message: validationMessage,
        tone: "error",
      });
      return;
    }

    if (!selectedFile) {
      return;
    }

    setIsAnalyzing(true);
    setFeedback({
      message: "Arquivo enviado para a trilha de extração da nota fiscal.",
      tone: "neutral",
    });

    try {
      const extractedExpense = await extractExpenseFromReceipt(selectedFile);
      await onSubmitExpense(extractedExpense);

      setFeedback({
        message: "Despesa criada automaticamente a partir da nota fiscal.",
        tone: "success",
      });
      setSelectedFile(null);
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel concluir a importacao da nota fiscal.",
        tone: "error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <section className="data-panel animate-enter">
      {/* Panel header */}
      <div className="data-panel-header flex items-center gap-3">
        <div className="h-5 w-[3px] rounded-full bg-[var(--accent-clay)]" />
        <div>
          <p className="section-eyebrow" style={{ color: "var(--accent-clay)" }}>
            Feature 03
          </p>
          <h2 className="mt-0.5 text-[1rem] font-semibold text-[var(--foreground)]">
            Nota fiscal — PDF ou imagem
          </h2>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4 space-y-3.5">
        <p className="text-[11.5px] leading-[1.65] text-[var(--muted)]">
          O fluxo de upload, a rota de extração e o serviço cliente já existem,
          mas a leitura real da nota e o salvamento ainda estão marcados com{" "}
          <code className="rounded bg-[rgba(31,42,34,0.07)] px-1 text-[10.5px] text-[var(--foreground)]">
            TODO implement
          </code>
          .
        </p>

        {/* Flow steps */}
        <div className="rounded-xl border border-[rgba(31,138,112,0.14)] bg-[rgba(240,252,248,0.65)] px-4 py-3">
          <p className="mb-1.5 font-mono text-[9.5px] font-semibold tracking-[0.18em] text-[var(--accent-forest)] uppercase">
            Fluxo esperado
          </p>
          <ol className="space-y-0.5">
            {[
              "Selecionar nota fiscal em imagem ou PDF.",
              "Enviar arquivo para /api/receipt-extraction.",
              "Extrair nome do local e valor da compra.",
              "Salvar resultado como despesa no Firestore.",
            ].map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[11px] leading-[1.6] text-[var(--muted)]"
              >
                <span className="mt-px font-mono text-[9px] text-[var(--accent-forest)]">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* File input */}
        <div>
          <label className="field-label" htmlFor={inputId}>
            Arquivo da nota fiscal
          </label>
          <input
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="field-input cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-[rgba(31,42,34,0.07)] file:px-2.5 file:py-1 file:text-[10.5px] file:font-medium file:text-[var(--foreground)] file:tracking-wide hover:file:bg-[rgba(31,42,34,0.12)]"
            id={inputId}
            onChange={handleFileChange}
            type="file"
          />
          <p className="mt-1 text-[10.5px] leading-[1.55] text-[var(--muted)]/70">
            Tipos aceitos: {getSupportedReceiptTypesLabel()}.
          </p>
          {selectedFile ? (
            <p className="mt-1 text-[11.5px] font-medium text-[var(--foreground)]">
              {selectedFile.name}
            </p>
          ) : null}
        </div>

        {/* Feedback */}
        {feedback ? (
          <p
            className={`rounded-xl border px-3.5 py-2.5 text-[11.5px] leading-[1.6] ${
              feedback.tone === "success"
                ? "border-[rgba(31,138,112,0.18)] bg-[rgba(240,252,248,0.9)] text-[var(--accent-forest)]"
                : feedback.tone === "error"
                  ? "border-[rgba(201,92,84,0.18)] bg-[rgba(255,244,243,0.9)] text-[var(--accent-clay)]"
                  : "border-[rgba(31,42,34,0.1)] bg-white/70 text-[var(--foreground)]"
            }`}
            role={feedback.tone === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        ) : null}

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            className="flex-1 rounded-xl bg-[var(--accent-clay)] px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.1em] text-white uppercase transition hover:bg-[rgba(201,92,84,0.88)] hover:shadow-[0_4px_16px_rgba(201,92,84,0.28)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isAnalyzing || isSubmitting}
            onClick={() => void handleAnalyzeReceipt()}
            type="button"
          >
            {isAnalyzing ? "Analisando…" : "Analisar nota"}
          </button>
          <button
            className="rounded-xl border border-[rgba(31,42,34,0.12)] bg-white/70 px-3.5 py-2.5 text-[11.5px] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase transition hover:bg-white hover:text-[var(--foreground)]"
            onClick={() => {
              setSelectedFile(null);
              setFeedback(null);
            }}
            type="button"
          >
            Limpar
          </button>
        </div>

        {/* TODO implement: exibir os dados extraídos em campos editáveis antes do salvamento final. */}
        {/* TODO implement: adicionar preview da nota fiscal para apoiar a revisão manual. */}
      </div>
    </section>
  );
}
