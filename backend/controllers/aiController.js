const Prediction = require('../models/Prediction');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// @desc    Get AI Prediction/Response
// @route   POST /api/ai/predict
// @access  Private
const getPrediction = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  try {
    let aiResponseText = '';

    // If no real API key is provided, we use a mock response to prevent crashing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      aiResponseText = `This is a mock AI response to your question: "${question}". It looks like you're doing great! Keep up the good work and maintain a healthy study-sleep balance.`;
    } else {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
      });
      aiResponseText = completion.choices[0].message.content;
    }

    const prediction = await Prediction.create({
      userId: req.user._id,
      question,
      answer: aiResponseText,
    });

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Server error from AI', error: error.message });
  }
};

// @desc    Get prediction history
// @route   GET /api/ai/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await Prediction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getPrediction, getHistory };
