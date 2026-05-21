import {
  getReceiptFileValidationMessage,
  getSupportedReceiptTypesLabel,
} from "@/services/receipt-upload";

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Envie um arquivo no campo `receipt` para iniciar a extração." },
      { status: 400 },
    );
  }

  const receipt = formData.get("receipt");

  if (!(receipt instanceof File)) {
    return Response.json(
      { error: "Envie um arquivo no campo `receipt` para iniciar a extração." },
      { status: 400 },
    );
  }

  const validationMessage = getReceiptFileValidationMessage(receipt);
  if (validationMessage) {
    return Response.json({ error: validationMessage }, { status: 415 });
  }

  // Lê o binário e converte para base64 — pronto para enviar a qualquer API de visão.
  const bytes = await receipt.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mediaType = receipt.type as
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "application/pdf";

  // TODO implement: chame o provedor de OCR/IA de sua escolha e substitua
  // o bloco abaixo pela lógica real de extração.
  //
  // ── Opção A: Claude API (recomendado) ───────────────────────────────────
  //
  // Adicione ANTHROPIC_API_KEY nas variáveis de ambiente (server-side, sem NEXT_PUBLIC_).
  //
  // const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
  //   method: "POST",
  //   headers: {
  //     "x-api-key": process.env.ANTHROPIC_API_KEY!,
  //     "anthropic-version": "2023-06-01",
  //     "content-type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     model: "claude-opus-4-7",
  //     max_tokens: 256,
  //     messages: [{
  //       role: "user",
  //       content: [
  //         {
  //           type: "image",
  //           source: { type: "base64", media_type: mediaType, data: base64 },
  //         },
  //         {
  //           type: "text",
  //           text: 'Extraia desta nota fiscal e responda SOMENTE com JSON válido, sem markdown: ' +
  //                 '{"establishmentName":"...","amount":0.00,"suggestedCategory":"..."}. ' +
  //                 'Para suggestedCategory use apenas: Alimentação, Transporte, Saúde, ' +
  //                 'Educação, Lazer, Moradia ou Outros.',
  //         },
  //       ],
  //     }],
  //   }),
  // });
  // const anthropicData = await anthropicResponse.json();
  // const extracted = JSON.parse(anthropicData.content[0].text);
  //
  // return Response.json({
  //   establishmentName: extracted.establishmentName,
  //   amount: Number(extracted.amount),
  //   suggestedCategory: extracted.suggestedCategory,
  // });
  //
  // ── Opção B: Google Cloud Vision ────────────────────────────────────────
  // Use TEXT_DETECTION e processe o rawText retornado com regex para extrair
  // o valor (procure por padrões como "R$ 000,00" ou "TOTAL 000,00").
  // Variável de ambiente: GOOGLE_CLOUD_KEY_JSON
  //
  // ── Opção C: Tesseract.js (sem API key, open source) ────────────────────
  // npm install tesseract.js
  // import Tesseract from "tesseract.js";
  // const { data: { text } } = await Tesseract.recognize(Buffer.from(bytes));
  // — processe `text` com regex para extrair estabelecimento e valor.
  //
  // ────────────────────────────────────────────────────────────────────────

  void base64;
  void mediaType;

  return Response.json(
    {
      acceptedTypes: getSupportedReceiptTypesLabel(),
      error:
        "TODO implement: integre um provedor de OCR/IA e retorne os dados extraídos.",
      expectedFields: [
        "establishmentName",
        "amount",
        "purchaseDate",
        "suggestedCategory",
      ],
    },
    { status: 501 },
  );
}
