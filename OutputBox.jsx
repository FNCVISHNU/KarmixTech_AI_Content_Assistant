import React, { useState } from 'react';

const OutputBox = ({ output, isLoading, onRegenerate }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [copyStatus, setCopyStatus] = useState('Copy All');

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] border border-white/5 animate-pulse-slow">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full blur-lg bg-indigo-500/10 animate-pulse"></div>
        </div>
        <p className="text-slate-300 font-bold text-base glow-text">AI Content Strategist is writing...</p>
        <p className="text-slate-500 text-xs mt-2 text-center max-w-[250px]">Structuring prompt, refining SEO keywords, and applying tone guidelines.</p>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px] text-center border border-white/5 bg-slate-900/10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-2xl animate-bounce">
          🔮
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">Ready for Generation</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Fill out the content requirements in the control panel and click Generate. Your optimized copy will appear here.
        </p>
      </div>
    );
  }

  const generated_content = output?.generated_content || output;
  const error_detail = output?.errorDetail;
  const note = output?.note;

  const { Title, MainContent, CTA } = generated_content || {};
  const fullText = `Title: ${Title || ''}\n\nMain Content:\n${MainContent || ''}\n\nCTA:\n${CTA || ''}`;

  const handleCopy = async (text, type = 'All') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`Copied ${type}!`);
      setTimeout(() => setCopyStatus('Copy All'), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([fullText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${Title ? Title.substring(0, 20).replace(/[^a-z0-9]/gi, '_') : 'generated_content'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPDF = () => {
    // Generate a high-fidelity printable HTML template in a new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${Title || 'AI Content Export'}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #6366f1;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 14px;
              font-weight: bold;
              color: #6366f1;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .date {
              font-size: 12px;
              color: #64748b;
              float: right;
            }
            h1 {
              font-size: 28px;
              color: #0f172a;
              margin-top: 0;
            }
            .content-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 24px;
              margin-bottom: 24px;
              white-space: pre-wrap;
            }
            .cta-box {
              background: #e0e7ff;
              border: 1px solid #c7d2fe;
              border-left: 4px solid #6366f1;
              border-radius: 8px;
              padding: 20px;
              font-weight: 500;
              color: #3730a3;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="logo">✦ AI Content Generation Assistant</span>
            <span class="date">${new Date().toLocaleDateString()}</span>
          </div>
          <h1>${Title || 'Untitled Generation'}</h1>
          <div class="content-box">${MainContent || 'No main content generated.'}</div>
          ${CTA ? `<div class="cta-box"><strong>Call to Action:</strong><br/>${CTA}</div>` : ''}
          <div class="footer">
            Generated using AI Content Generation Assistant. All rights reserved.
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          ✨ Generated Copy
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleCopy(fullText)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
          >
            📋 {copyStatus}
          </button>
          
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-slate-900/60 border border-white/10 text-slate-300 hover:text-slate-100 hover:border-white/20 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1.5"
          >
            📄 PDF Export
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3.5 py-2 bg-slate-900/60 border border-white/10 text-slate-300 hover:text-slate-100 hover:border-white/20 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1.5"
          >
            📥 Text File
          </button>

          <button
            onClick={onRegenerate}
            className="px-3.5 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 rounded-xl font-semibold transition-all duration-300 flex items-center gap-1.5"
          >
            🔄 Regenerate
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {error_detail && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-300 flex flex-col gap-1.5 leading-relaxed">
          <span className="font-bold flex items-center gap-1.5 text-red-400 text-sm">
            ⚠️ OpenAI API Call Failed
          </span>
          <p className="font-medium text-red-300/90">{error_detail}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            Your backend automatically fell back to high-quality simulated copy for testing. Please verify your OpenAI billing details or API key quota in `backend/.env`.
          </p>
        </div>
      )}

      {note && !error_detail && (
        <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-300 flex flex-col gap-1.5 leading-relaxed">
          <span className="font-bold flex items-center gap-1.5 text-indigo-400 text-sm">
            ℹ️ Running in Demo Mode
          </span>
          <p className="font-medium text-indigo-300/90">{note}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
        {['all', 'title', 'content', 'cta'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-300 ${
              activeTab === tab
                ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'all' ? '📄 Full Preview' : tab}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {/* Title View */}
        {(activeTab === 'all' || activeTab === 'title') && Title && (
          <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl relative group">
            <span className="absolute top-3 right-3 text-[10px] text-slate-600 font-bold uppercase tracking-wider group-hover:text-slate-400 transition-colors">
              Title / Hook
            </span>
            <h4 className="text-xl font-extrabold text-white leading-relaxed pr-12">
              {Title}
            </h4>
            <button
              onClick={() => handleCopy(Title, 'Title')}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 text-slate-400 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold"
            >
              Copy
            </button>
          </div>
        )}

        {/* Main Content View */}
        {(activeTab === 'all' || activeTab === 'content') && MainContent && (
          <div className="p-6 bg-slate-950/30 border border-white/5 rounded-2xl relative group">
            <span className="absolute top-3 right-3 text-[10px] text-slate-600 font-bold uppercase tracking-wider group-hover:text-slate-400 transition-colors">
              Main Body
            </span>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pr-4 mt-2">
              {MainContent}
            </div>
            <button
              onClick={() => handleCopy(MainContent, 'Content')}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 text-slate-400 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold"
            >
              Copy
            </button>
          </div>
        )}

        {/* CTA View */}
        {(activeTab === 'all' || activeTab === 'cta') && CTA && (
          <div className="p-5 bg-indigo-950/10 border border-indigo-500/20 rounded-2xl relative group border-l-4 border-l-indigo-500">
            <span className="absolute top-3 right-3 text-[10px] text-indigo-500/40 font-bold uppercase tracking-wider group-hover:text-indigo-400/60 transition-colors">
              Call to Action
            </span>
            <p className="text-indigo-300 text-sm font-semibold pr-12 leading-relaxed">
              {CTA}
            </p>
            <button
              onClick={() => handleCopy(CTA, 'CTA')}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-indigo-500/25 text-indigo-400 hover:text-indigo-200 px-2 py-1 rounded-lg text-[10px] font-bold"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputBox;
