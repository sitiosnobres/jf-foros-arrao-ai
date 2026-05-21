require("dotenv").config();
const fs = require("fs");

const config = JSON.parse(
  fs.readFileSync("./config.json", "utf8")
);

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// =========================
// PESQUISAR SITE
// =========================

async function pesquisarSite(pergunta) {
    return "";
}

// =========================
// CHAT
// =========================

app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        console.log("Mensagem recebida:", message);

        // =========================
        // PALAVRAS-CHAVE INTELIGENTES
        // =========================

        const pergunta = message
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // ATAS
        if (
            pergunta.includes("ata") ||
            pergunta.includes("atas")
        ) {

            return res.json({
                reply: `
Podes consultar as atas da Junta de Freguesia aqui:

${config.links.atas}
`
            });

        }

        // EDITAIS
        if (
            pergunta.includes("edital") ||
            pergunta.includes("editais")
        ) {

            return res.json({
                reply: `
Podes consultar os editais e avisos aqui:

${config.links.editais}
`
            });

        }

        // EVENTOS
        if (
            pergunta.includes("evento") ||
            pergunta.includes("eventos")
        ) {

            return res.json({
                reply: `
Podes consultar a agenda oficial de eventos aqui:

${config.links.eventos}
`
            });

        }

        // TURISMO
        if (
            pergunta.includes("turismo") ||
            pergunta.includes("portal de turismo")
        ) {

            return res.json({
                reply: `
Podes consultar o portal oficial de turismo aqui:

${config.links.turismo}
`
            });

        }

        // EXECUTIVO / JUNTA / COMPOSIÇÃO
        if (
            pergunta.includes("executivo") ||
            pergunta.includes("junta de freguesia") ||
            pergunta.includes("composicao") ||
            pergunta.includes("composição")
        ) {

            return res.json({
                reply: `
Podes consultar a composição do executivo da Junta de Freguesia aqui:

${config.links.executivo}
`
            });

        }

        // DOCUMENTOS
        if (
            pergunta.includes("documento") ||
            pergunta.includes("documentos")
        ) {

            return res.json({
                reply: `
Podes consultar os documentos oficiais aqui:

${config.links.documentos}
`
            });

        }

        // OCORRÊNCIAS
        if (
            pergunta.includes("ocorrencia") ||
            pergunta.includes("ocorrências") ||
            pergunta.includes("ocorrencias")
        ) {

            return res.json({
                reply: `
Podes contactar a Junta de Freguesia para comunicar ocorrências ou pedidos de apoio através do site oficial:

${config.site}
`
            });

        }

        // PESQUISA LIVRE
        const resultadosSite = await pesquisarSite(message);

        // OPENAI
        const response = await client.chat.completions.create({

            model: "gpt-3.5-turbo",

            messages: [

                {
                    role: "system",
                    content: `
És o assistente virtual oficial da Junta de Freguesia.

Responde sempre em português de Portugal.

Responde de forma curta, clara e simpática.

Se a pergunta estiver relacionada com serviços da junta, tenta ajudar com base nos links disponíveis.

Se não existir informação específica, sugere consultar o site oficial.

Site oficial:
${config.site}
`
                },

                {
                    role: "user",
                    content: message
                }

            ]

        });

        const reply = response.choices[0].message.content;

        res.json({
            reply: reply
        });

    } catch (error) {

        console.log("ERRO NO SERVIDOR:");
        console.log(error);

        res.status(500).json({
            reply: "Erro no servidor."
        });

    }

});

// =========================
// SERVIDOR
// =========================

app.listen(3000, () => {

    console.log("Servidor IA ativo na porta 3000");

});
