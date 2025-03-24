import * as ai from "../services/ai.service.js";

export const getContent = async (req, res) => {
    console.log(req.body.prompt);
    try {
        const {prompt} = req.query;
        const result = await ai.generateResult(prompt);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while generating content."});
    }
    
}