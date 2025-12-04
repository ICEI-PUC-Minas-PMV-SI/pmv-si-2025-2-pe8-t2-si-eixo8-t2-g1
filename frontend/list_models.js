import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyD9LgI7DFLuqwIbUlJIhtXDlutlgfHt0BI";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${model.name} (${model.displayName})`);
            }
        });
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
