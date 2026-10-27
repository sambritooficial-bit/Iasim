
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

const PORT = process.env.PORT || 3000;

const ai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

// Verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    nome: "IA Sim",
    status: "Servidor online",
    mensagem: "Servidor pronto para receber mensagens."
  });
});

// Conversar com a inteligência artificial
app.post("/api/chat", async (req, res) => {
  try {
    const mensagem = req.body.mensagem;

    if (typeof mensagem !== "string" ||
        !mensagem.trim()) {
      return res.status(400).json({
        erro: "Digite uma mensagem."
      });
    }

    if (mensagem.length > 4000) {
      return res.status(400).json({
        erro: "A mensagem é muito longa."
      });
    }

    if (!ai) {
      return res.status(503).json({
        erro: "A IA ainda não foi configurada no servidor."
      });
    }

    const resposta = await ai.responses.create({
      model: "gpt-5-mini",
      instructions:
        "Você é a IA Sim. Responda em português, " +
        "com clareza, educação e precisão.",
      input: mensagem.trim()
    });

    res.json({
      resposta: resposta.output_text
    });

  } catch (erro) {
    console.error("Erro na IA:", erro.message);

    res.status(500).json({
      erro: "Não foi possível gerar uma resposta."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`IA Sim rodando na porta ${PORT}`);
});
