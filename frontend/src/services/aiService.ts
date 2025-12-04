import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateEvolution(keywords: string, specialty: string = "Profissional de Saúde"): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY não está configurada no arquivo .env");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = "gemini-2.0-flash";
    console.log("Initializing Gemini with model:", modelName);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
    Atue como um ${specialty} experiente.
    Gere um registro de evolução clínica profissional e detalhado com base nas seguintes palavras-chave/observações:
    "${keywords}"
    
    O texto DEVE seguir estritamente a seguinte estrutura de tópicos:

    1. Comportamento inicial:
    Descreva como o paciente chegou à sessão (ex.: humor, nível de alerta, interação inicial, aceitação).

    2. Atividades realizadas:
    Cite os recursos utilizados e os objetivos terapêuticos trabalhados na sessão.

    3. Observações clínicas:
    Detalhe os comportamentos, respostas aos estímulos, desempenho nas atividades, nível de suporte necessário e evolução observada.

    4. Conduta e manejo terapêutico:
    Descreva as estratégias e intervenções específicas utilizadas (ex.: manejo comportamental, adaptação de tarefas, reforço positivo).

    5. Orientações à família/Cuidador:
    Liste as orientações, recomendações para casa ou feedbacks passados aos responsáveis.

    Mantenha o tom profissional, técnico e objetivo, adequado para a área de ${specialty}.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Erro ao gerar conteúdo com Gemini:", error);
        throw error;
    }
}
