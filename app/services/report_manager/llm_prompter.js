const { CustomResponse } = require("../../common_infrastructure/response");
const { Errors } = require("../../common_infrastructure/errors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.BARD_API_KEY);

/**
 * ask a question to the LLM model
 * @param {string} prompt 
 * @returns {CustomResponse<string>}
 */
async function promptLlm(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([prompt]);
        const text = result.response.text();
        return new CustomResponse(Errors.OK, "", text);
    } catch (e) {
        console.log("error in promptLlm: ", e);
        return new CustomResponse(Errors.INTERNAL_SERVER_ERROR, "error due to LLM model connection: " + e, null);
    }
}

exports.promptLlm = promptLlm;