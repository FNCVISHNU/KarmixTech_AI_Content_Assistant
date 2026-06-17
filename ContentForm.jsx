import React, { useState } from 'react';
import API from '../api';

const CONTENT_TYPES = [
  "Blog Post",
  "Social Media Caption",
  "B2B/Cold Email",
  "LinkedIn Post",
  "Product Description",
  "Google/Facebook Ad Copy",
  "Press Release"
];

const TONE_PRESETS = [
  { id: "Professional", label: "💼 Professional" },
  { id: "Luxury", label: "💎 Luxury" },
  { id: "Gen-Z", label: "⚡ Gen-Z" },
  { id: "Emotional", label: "❤️ Emotional" },
  { id: "Corporate", label: "🏢 Corporate" }
];

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Japanese", "Portuguese", "Hindi"
];

const ContentForm = ({ setOutput, setIsLoading, addToHistory, isGenerating }) => {
  const [formData, setFormData] = useState({
    content_type: 'Blog Post',
    topic: '',
    audience: '',
    tone: 'Professional',
    custom_tone: '',
    platform: '',
    goal: '',
    keywords: '',
    word_count: 300,
    language: 'English',
    humanize: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleToneSelect = (toneId) => {
    setFormData((prev) => ({
      ...prev,
      tone: toneId,
      custom_tone: ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    const required = ["topic", "audience", "platform", "goal"];
    required.forEach(field => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setOutput(null);

    const submissionData = {
      ...formData,
      tone: formData.custom_tone.trim() ? formData.custom_tone : formData.tone
    };

    try {
      const response = await API.post('/generate', submissionData);
      const { generated_content, error_detail, note } = response.data;
      setOutput(generated_content, error_detail, note);
      
      // Save to localStorage history
      addToHistory({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        inputs: { ...submissionData },
        output: generated_content,
        outputState: { generated_content, errorDetail: error_detail, note }
      });

    } catch (error) {
      console.error(error);
      const simulatedTitle = `[Demo Mode / Connection Failure] High-Quality Copy on ${formData.topic}`;
      const simulatedMain = `This is a high-fidelity demonstration backup copy. Your network request to http://127.0.0.1:8000 failed, which means the backend server might not be running.\n\nTo run the live generation with OpenAI, ensure your backend server is active by starting it. Once it starts, it will process your inputs seamlessly.`;
      const simulatedCTA = `Run 'npm start' in the backend directory to activate live generations!`;
      
      const backupOutput = {
        Title: simulatedTitle,
        MainContent: simulatedMain,
        CTA: simulatedCTA
      };
      
      setOutput(backupOutput, "Failed to connect to the backend server. Is it running on http://127.0.0.1:8000?", "Connection failure");
      addToHistory({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        inputs: { ...submissionData },
        output: backupOutput,
        outputState: { generated_content: backupOutput, errorDetail: "Failed to connect to backend server.", note: "Connection failure" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Content Type & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Content Type</label>
          <select
            name="content_type"
            value={formData.content_type}
            onChange={handleChange}
            className="w-full glass-input px-4 py-3 rounded-xl text-slate-100 cursor-pointer"
          >
            {CONTENT_TYPES.map(type => (
              <option key={type} value={type} className="bg-slate-900">{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full glass-input px-4 py-3 rounded-xl text-slate-100 cursor-pointer"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">What is the topic / product?</label>
        <input
          type="text"
          name="topic"
          placeholder="e.g. A plant-based biodegradable coffee cup"
          value={formData.topic}
          onChange={handleChange}
          className={`w-full glass-input px-4 py-3 rounded-xl ${errors.topic ? 'border-red-500/50 focus:border-red-500' : ''}`}
        />
        {errors.topic && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.topic}</p>}
      </div>

      {/* Audience & Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Target Audience</label>
          <input
            type="text"
            name="audience"
            placeholder="e.g. Eco-conscious Gen-Z professionals"
            value={formData.audience}
            onChange={handleChange}
            className={`w-full glass-input px-4 py-3 rounded-xl ${errors.audience ? 'border-red-500/50 focus:border-red-500' : ''}`}
          />
          {errors.audience && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.audience}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Goal of Content</label>
          <input
            type="text"
            name="goal"
            placeholder="e.g. Pre-order signups, brand awareness"
            value={formData.goal}
            onChange={handleChange}
            className={`w-full glass-input px-4 py-3 rounded-xl ${errors.goal ? 'border-red-500/50 focus:border-red-500' : ''}`}
          />
          {errors.goal && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.goal}</p>}
        </div>
      </div>

      {/* Platform & Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Platform / Placement</label>
          <input
            type="text"
            name="platform"
            placeholder="e.g. Instagram Post, Newsletter, Website Header"
            value={formData.platform}
            onChange={handleChange}
            className={`w-full glass-input px-4 py-3 rounded-xl ${errors.platform ? 'border-red-500/50 focus:border-red-500' : ''}`}
          />
          {errors.platform && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.platform}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">SEO Keywords (Comma separated)</label>
          <input
            type="text"
            name="keywords"
            placeholder="e.g. sustainable coffee, zero waste, reusable cup"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full glass-input px-4 py-3 rounded-xl"
          />
        </div>
      </div>

      {/* Tone Presets */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2.5">Select a Tone Preset</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {TONE_PRESETS.map(t => (
            <button
              type="button"
              key={t.id}
              onClick={() => handleToneSelect(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                formData.tone === t.id && !formData.custom_tone
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          name="custom_tone"
          placeholder="Or write custom tone (e.g. witty, highly academic, nostalgic)"
          value={formData.custom_tone}
          onChange={handleChange}
          className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
        />
      </div>

      {/* Word Count Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-slate-300">Target Word Count</label>
          <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2.5 py-1 rounded-lg">
            {formData.word_count} words
          </span>
        </div>
        <input
          type="range"
          name="word_count"
          min="50"
          max="1500"
          step="50"
          value={formData.word_count}
          onChange={handleChange}
          className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1.5 px-1">
          <span>50w</span>
          <span>500w</span>
          <span>1000w</span>
          <span>1500w</span>
        </div>
      </div>

      {/* AI Humanizer Option */}
      <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
        <div>
          <span className="block text-sm font-bold text-slate-200">🚀 AI Humanizer</span>
          <span className="block text-xs text-slate-400 mt-0.5">Bypasses typical AI cliches and increases natural flow</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            name="humanize"
            checked={formData.humanize}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white peer-checked:after:border-indigo-600"></div>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/20 glow-btn border border-indigo-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating Prime Copy...
          </>
        ) : (
          "🔮 Generate Content"
        )}
      </button>
    </form>
  );
};

export default ContentForm;
