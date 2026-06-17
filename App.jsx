import React, { useState, useEffect } from 'react';
import ContentForm from './components/ContentForm';
import OutputBox from './components/OutputBox';
import HistorySidebar from './components/HistorySidebar';

function App() {
  const [output, setOutputState] = useState(null); // stores { generated_content, errorDetail, note }
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  const [lastInputs, setLastInputs] = useState(null);

  const setOutput = (generated_content, errorDetail = null, note = null) => {
    if (!generated_content) {
      setOutputState(null);
    } else {
      setOutputState({ generated_content, errorDetail, note });
    }
  };


  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('copy_assistant_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }, []);

  const addToHistory = (item) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 50); // Cap history at 50 items
      localStorage.setItem('copy_assistant_history', JSON.stringify(updated));
      return updated;
    });
    setActiveHistoryId(item.id);
    setLastInputs(item.inputs);
  };

  const onSelectHistory = (item) => {
    setOutputState(item.outputState || { generated_content: item.output });
    setActiveHistoryId(item.id);
    setLastInputs(item.inputs);
  };

  const onDeleteHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('copy_assistant_history', JSON.stringify(updated));
      return updated;
    });
    if (activeHistoryId === id) {
      setOutput(null);
      setActiveHistoryId(null);
      setLastInputs(null);
    }
  };

  const onClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('copy_assistant_history');
      setOutput(null);
      setActiveHistoryId(null);
      setLastInputs(null);
    }
  };

  const handleRegenerate = async () => {
    if (!lastInputs) return;
    setIsLoading(true);
    setOutput(null);

    try {
      // Direct call to API using cached inputs
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lastInputs),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data.generated_content, data.error_detail, data.note);
        addToHistory({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          inputs: lastInputs,
          output: data.generated_content,
          outputState: { generated_content: data.generated_content, errorDetail: data.error_detail, note: data.note }
        });
      } else {
        throw new Error(data.error || "Failed generation");
      }
    } catch (error) {
      console.error(error);
      alert("Error regenerating content. Ensure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-10 flex flex-col justify-between">
      {/* Upper Section */}
      <div className="max-w-7xl mx-auto w-full flex-1">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight flex items-center justify-center md:justify-start gap-2">
              ✦ AI Content Generation Assistant
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium tracking-wide">
              Production-Style Structured Prompting Engine for Copywriters & Freelancers
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              API Connection Ready
            </span>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Config Form */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 md:p-8 border border-white/5">
            <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              ⚙️ Content Parameters
            </h2>
            <ContentForm
              setOutput={setOutput}
              setIsLoading={setIsLoading}
              addToHistory={addToHistory}
              isGenerating={isLoading}
            />
          </div>

          {/* Column 2: Output Display */}
          <div className="lg:col-span-4">
            <OutputBox
              output={output}
              isLoading={isLoading}
              onRegenerate={handleRegenerate}
            />
          </div>

          {/* Column 3: History Sidebar */}
          <div className="lg:col-span-3">
            <HistorySidebar
              history={history}
              onSelectHistory={onSelectHistory}
              onDeleteHistory={onDeleteHistory}
              onClearHistory={onClearHistory}
              activeHistoryId={activeHistoryId}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full border-t border-white/5 mt-12 pt-6 text-center text-[10px] text-slate-500 font-medium">
        Designed and engineered for maximum conversion. Powered by OpenAI GPT-4o-mini & Node.js Express.
      </footer>
    </div>
  );
}

export default App;
