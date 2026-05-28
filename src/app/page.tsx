import { ExpenseDashboardApp } from "@/components/expense-dashboard-app";

export default function Page() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Fluxo Financeiro</h1>

      <section
        style={{
          padding: "20px",
          marginTop: "20px",
          border: "1px solid #ccc",
          borderRadius: "12px",
        }}
      >
        <h2>Saída por leitura de PDF ou imagem</h2>

        <p>PDF, JPG, PNG ou WEBP</p>

        <input type="file" />

        <br />
        <br />

        <button
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#ef8019",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Analisar nota fiscal
        </button>

        <p>nota-fiscal.pdf</p>

        <p>Nenhum arquivo selecionado</p>
      </section>
    </main>
  );
}
