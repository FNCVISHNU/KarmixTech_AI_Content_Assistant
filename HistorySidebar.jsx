import React from 'react';

const HistorySidebar = ({ history, onSelectHistory, onDeleteHistory, onClearHistory, activeHistoryId }) => {
  return (
    <div className="glass-card rounded-3xl p-5 border border-white/5 h-full flex flex-col max-h-[800px]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          🕒 Content History
          <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <span className="text-2xl mb-2">📁</span>
          <p className="text-xs text-slate-500 font-semibold">No generations saved yet.</p>
          <p className="text-[10px] text-slate-600 max-w-[150px] mt-1">Generated copies will show up here automatically.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative group glass-card-hover ${
                activeHistoryId === item.id
                  ? 'bg-indigo-500/10 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                  : 'bg-slate-950/20 border-white/5 hover:bg-slate-900/30'
              }`}
            >
              <div className="flex justify-between items-start pr-6">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-md">
                  {item.inputs.content_type}
                </span>
                <span className="text-[9px] text-slate-500 font-bold">
                  {item.inputs.language || 'English'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-200 mt-2 truncate max-w-[190px]">
                {item.inputs.topic}
              </h4>
              
              <div className="flex gap-2 mt-2 text-[10px] text-slate-400 font-medium">
                <span>🎭 {item.inputs.tone}</span>
                <span>•</span>
                <span>{item.inputs.word_count}w</span>
              </div>

              <div className="text-[8px] text-slate-600 font-bold mt-2.5">
                {item.timestamp}
              </div>

              {/* Individual delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteHistory(item.id);
                }}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs"
                title="Delete item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;
