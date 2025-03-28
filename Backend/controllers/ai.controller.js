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

export const getReview = async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).send("Prompt is required");
  }
  const response = await ai.codeReview(code);

  res.send(response);
};


export const getDesign = async (req, res) => {
  try {
    const { prompt } = req.query;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const suggestions = await ai.getDesign(prompt);
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}