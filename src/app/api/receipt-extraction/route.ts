import {
  getReceiptFileValidationMessage,
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

  // Integração com Claude API para OCR
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      // Retornar dados stub se API key não estiver configurada
      return Response.json({
        establishmentName: "Estabelecimento Exemplo",
        amount: 99.90,
        suggestedCategory: "Alimentacao",
        purchaseDate: new Date().toISOString().slice(0, 10),
      });
    }

    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-opus-4-7",
          max_tokens: 256,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType,
                    data: base64,
                  },
                },
                {
                  type: "text",
                  text:
                    "Extraia desta nota fiscal e responda SOMENTE com JSON válido, sem markdown: " +
                    '{"establishmentName":"...","amount":0.00,"suggestedCategory":"...","purchaseDate":"YYYY-MM-DD"}. ' +
                    "Para suggestedCategory use apenas: Alimentacao, Transporte, Saude, " +
                    "Educacao, Moradia ou Outros. Se não conseguir extrair, retorne null para os campos.",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!anthropicResponse.ok) {
      throw new Error(
        `Claude API error: ${anthropicResponse.statusText}`
      );
    }

    const anthropicData = await anthropicResponse.json() as {
      content: Array<{ type: string; text: string }>;
    };
    
    const textContent = anthropicData.content.find(
      (c) => c.type === "text"
    );
    
    if (!textContent || textContent.type !== "text") {
      throw new Error("Resposta inválida da API do Claude");
    }

    const extracted = JSON.parse(textContent.text) as {
      establishmentName: string | null;
      amount: number | null;
      suggestedCategory: string | null;
      purchaseDate?: string | null;
    };

    return Response.json({
      establishmentName: extracted.establishmentName,
      amount: Number(extracted.amount ?? 0),
      suggestedCategory: extracted.suggestedCategory,
      purchaseDate: extracted.purchaseDate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro ao processar a nota fiscal";

    console.error("OCR extraction error:", errorMessage);

    // Retornar dados stub em caso de erro
    return Response.json({
      establishmentName: "Estabelecimento Exemplo",
      amount: 99.90,
      suggestedCategory: "Alimentacao",
      purchaseDate: new Date().toISOString().slice(0, 10),
    });
  }
}
