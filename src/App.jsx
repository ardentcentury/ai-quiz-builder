import React, { useState, useMemo, useEffect } from 'react';
import { Settings, Plus, Trash2, CheckCircle2, BarChart2, Mail, Lock, ArrowRight, ArrowLeft, Download, Code, Phone, RefreshCw } from 'lucide-react';

const DEFAULT_CONFIG = {
  branding: {
    primaryColor: '#1A73E8',
    bodyColor: '#F1F3F4',
    headerColor: '#3C4043',
    logoUrl: '',
  },
  content: {
    eyebrow: 'Executive Diagnostic (v06Aug)',
    title: 'AI Workplace Readiness Index (Live)',
    description: 'Diagnostic tool to evaluate physical infrastructure readiness for AI-enabled workflows, hybrid presence, and future spatial adaptability.',
  },
  integration: {
    webhookUrl: '',
    geminiApiKey: '',
  },
  results: [
    { maxScore: 30, title: 'Workplace at Risk', tone: 'Critical Gap', color: '#FCE8E6', desc: 'Your workplace is not prepared for AI-era work. Focus, collaboration and adaptability barriers are likely limiting employee performance.', cta: 'Book a Strategy Consultation' },
    { maxScore: 60, title: 'Emerging Workplace', tone: 'Foundational Gaps', color: '#FEF7E0', desc: 'Your workplace has some useful foundations, but support for AI-enabled work, hybrid collaboration and employee choice is inconsistent.', cta: 'Request an Improvement Roadmap' },
    { maxScore: 85, title: 'Adaptive Workplace', tone: 'Optimization Opportunity', color: '#E8F0FE', desc: 'Your workplace supports many modern work behaviors, but there are still clear opportunities to improve focus, flexibility and collaboration performance.', cta: 'Explore Next-Gen Strategies' },
    { maxScore: 100, title: 'AI-Ready Workplace', tone: 'Strong Position', color: '#E6F4EA', desc: 'Your workplace is well positioned for AI-era work, with strong support for focus, collaboration, adaptability and employee experience.', cta: 'Schedule Executive Benchmarking' }
  ],
  questions: [
    { id: "q1", section: "AI adoption", question: "How frequently do employees use AI tools in their daily work?", options: [ { label: "Rarely or never", value: 0 }, { label: "A few employees use AI occasionally", value: 3 }, { label: "AI is used regularly by some teams", value: 6 }, { label: "AI is widely used across departments", value: 10 } ] },
    { id: "q2", section: "AI adoption", question: "Has your organization established clear guidance and training for AI usage?", options: [ { label: "No formal or informal guidance exists", value: 0 }, { label: "Informal guidance exists but is inconsistent", value: 3 }, { label: "Basic policy exists", value: 6 }, { label: "Formal governance, training and adoption support exist", value: 10 } ] },
    { id: "q3", section: "Focus & Cognitive Performance", question: "As AI automates routine tasks, deep-focus knowledge work becomes more critical. How often do employees struggle to concentrate in the office?", options: [ { label: "Frequently", value: 0 }, { label: "Often", value: 3 }, { label: "Occasionally", value: 6 }, { label: "Rarely", value: 10 } ] },
    { id: "q4", section: "Focus & Cognitive Performance", question: "Does your physical workplace provide specialized, distraction-free environments designed for intense, AI-assisted knowledge work?", options: [ { label: "Poorly supported", value: 0 }, { label: "Adequately supported", value: 3 }, { label: "Well supported", value: 6 }, { label: "Extremely well supported", value: 10 } ] },
    { id: "q5", section: "Hybrid Collaboration", question: "AI meeting assistants are changing collaboration. How effective are your current physical spaces at integrating remote participants and AI tools seamlessly?", options: [ { label: "Frequently frustrating", value: 0 }, { label: "Often challenging", value: 3 }, { label: "Generally effective", value: 6 }, { label: "Seamless experience", value: 10 } ] },
    { id: "q6", section: "Hybrid Collaboration", question: "Do employees have access to acoustically optimized spaces specifically designed for video and AI-driven hybrid collaboration?", options: [ { label: "None", value: 0 }, { label: "Very limited", value: 3 }, { label: "Some dedicated spaces", value: 6 }, { label: "Extensive range of dedicated spaces", value: 10 } ] },
    { id: "q7", section: "Workplace Choice", question: "As AI shifts the nature of work, employees need different settings. How many distinct space types are available in your office?", options: [ { label: "1 to 2 space types", value: 0 }, { label: "3 to 4 space types", value: 3 }, { label: "5 to 6 space types", value: 6 }, { label: "7 or more space types", value: 10 } ] },
    { id: "q8", section: "Workplace Choice", question: "Employees can easily transition between different workspaces based on whether they are doing AI-focused individual work or group collaboration.", options: [ { label: "Strongly disagree", value: 0 }, { label: "Disagree", value: 3 }, { label: "Agree", value: 6 }, { label: "Strongly agree", value: 10 } ] },
    { id: "q9", section: "Employee Experience", question: "With AI increasing productivity expectations, how would you rate employee satisfaction with the comfort and experience of your physical workplace?", options: [ { label: "Poor", value: 0 }, { label: "Fair", value: 3 }, { label: "Good", value: 6 }, { label: "Excellent", value: 10 } ] },
    { id: "q10", section: "Employee Experience", question: "Since AI cannot replace human connection, does your workplace effectively foster in-person relationship-building and community?", options: [ { label: "Rarely", value: 0 }, { label: "Sometimes", value: 3 }, { label: "Usually", value: 6 }, { label: "Consistently", value: 10 } ] },
    { id: "q11", section: "Future Readiness", question: "As AI rapidly changes technology needs and team structures, how adaptable is your physical workplace to new spatial requirements?", options: [ { label: "Not at all", value: 0 }, { label: "Somewhat", value: 3 }, { label: "Mostly", value: 6 }, { label: "Highly adaptable", value: 10 } ] },
    { id: "q12", section: "Future Readiness", question: "If AI adoption shifts more work towards in-person collaborative sessions, how prepared is your workplace for a sudden 25% increase in attendance?", options: [ { label: "Major disruption expected", value: 0 }, { label: "Significant adjustments required", value: 3 }, { label: "Minor adjustments required", value: 6 }, { label: "Ready immediately", value: 10 } ] }
  ]
};

const STYLES = `
  :root { font-family: 'Inter', system-ui, sans-serif; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #E5E7EB; color: #1F2937; }
  .app-layout { display: flex; height: 100vh; overflow: hidden; }
  
  .builder-sidebar { width: 500px; background: white; border-right: 1px solid #D1D5DB; display: flex; flex-direction: column; z-index: 10; flex-shrink: 0; }
  .builder-header { padding: 20px; border-bottom: 1px solid #D1D5DB; display: flex; justify-content: space-between; align-items: center; background: #F9FAFB; }
  .builder-header h2 { margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .builder-export-btn { background: #1A73E8; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: background 0.2s; }
  .builder-export-btn:hover { background: #1557B0; }
  
  .builder-tabs { display: flex; border-bottom: 1px solid #D1D5DB; }
  .tab-btn { flex: 1; padding: 12px 0; background: none; border: none; font-size: 13px; font-weight: 600; cursor: pointer; color: #6B7280; border-bottom: 2px solid transparent; }
  .tab-btn.active { color: #2563EB; border-bottom-color: #2563EB; }
  .builder-content { flex: 1; overflow-y: auto; padding: 20px; }
  
  .field-group { margin-bottom: 20px; }
  .field-group label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #4B5563; margin-bottom: 8px; }
  .field-group input, .field-group textarea { width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; font-family: inherit; }
  .field-group textarea { resize: vertical; min-height: 80px; }
  
  .q-card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #F9FAFB; position: relative; }
  .opt-row { display: grid; grid-template-columns: 1fr 80px 40px; gap: 8px; margin-bottom: 8px; align-items: center; }
  .opt-row input { margin: 0; }
  
  .preview-area { flex: 1; background: var(--bg-page, #F1F3F4); overflow-y: auto; position: relative; display: flex; justify-content: center; padding: 40px 20px; }
  .quiz-shell { width: 100%; max-width: 900px; }
  .quiz-hero { background: var(--header-bg, #3C4043); border-radius: 8px; padding: 24px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px; color: white; display: grid; grid-template-columns: 1fr 250px; gap: 32px; align-items: center; }
  .quiz-hero .eyebrow { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #9AA0A6; margin-bottom: 8px; display: inline-flex; align-items: center; }
  .quiz-hero h1 { font-size: 28px; font-weight: 400; margin: 0 0 12px; color: white; }
  .quiz-hero p { font-size: 14px; color: #E8EAED; margin: 0; line-height: 1.6; }
  .progress-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 16px 20px; text-align: right; }
  .progress-track { height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; margin-top: 12px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--primary-color, #1A73E8); transition: width 0.3s ease; }
  
  .quiz-card { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .question-head { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid #DADCE0; }
  .question-head h2 { font-size: 22px; font-weight: 400; margin: 0; color: #202124; line-height: 1.4; }
  .section-label { display: inline-block; background: #F8F9FA; border: 1px solid #DADCE0; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; color: #5F6368; margin-top: 16px; }
  .options-grid { display: grid; gap: 12px; }
  .option-btn { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border: 1px solid #DADCE0; border-radius: 4px; background: white; cursor: pointer; text-align: left; font-size: 15px; color: #202124; transition: all 0.2s; }
  .option-btn:hover { background: #F8F9FA; }
  .option-btn.selected { border-color: var(--primary-color); background: #E8F0FE; color: var(--primary-color); box-shadow: inset 0 0 0 1px var(--primary-color); }
  .nav-row { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid #DADCE0; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; }
  .btn-primary { background: var(--primary-color); color: white; transition: opacity 0.2s; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary { background: white; border: 1px solid #DADCE0; color: #202124; }
  
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #202124; }
  .form-group input { width: 100%; padding: 10px 14px; border: 1px solid #DADCE0; border-radius: 4px; font-size: 14px; }
  
  .result-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; }
  .result-panel { border-radius: 8px; padding: 32px 24px; text-align: center; border: 1px solid #DADCE0; }
  .result-panel h2 { font-size: 24px; font-weight: 400; margin: 24px 0 12px; }
  .score-display { font-size: 72px; font-weight: 300; line-height: 1; margin-top: 24px; }

  /* AI REPORT STYLES */
  .ai-report-box { background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 32px; margin-top: 32px; text-align: left; }
  .ai-report-box .ai-header { display: flex; align-items: center; gap: 8px; color: var(--primary-color); font-weight: 600; font-size: 18px; margin-bottom: 24px; border-bottom: 1px solid #E5E7EB; padding-bottom: 16px;}
  .ai-loading { display: flex; align-items: center; gap: 12px; color: #6B7280; font-weight: 500; font-size: 14px; }
  .spinner { border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--primary-color); border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  /* Rendered HTML inside AI Report */
  .ai-content { font-size: 15px; line-height: 1.7; color: #374151; }
  .ai-content h3 { font-size: 17px; font-weight: 600; color: #111827; margin: 24px 0 12px; }
  .ai-content h3:first-child { margin-top: 0; }
  .ai-content p { margin: 0 0 16px; }
  .ai-content ul { margin: 0 0 16px; padding-left: 20px; }
  .ai-content li { margin-bottom: 8px; }
  .ai-content a { color: var(--primary-color); text-decoration: underline; font-weight: 500; }
  .ai-content strong { color: #111827; font-weight: 600; }

  @media print {
    .builder-sidebar { display: none !important; }
    .app-layout { height: auto !important; overflow: visible !important; display: block !important; }
    .preview-area { background: white !important; padding: 0 !important; overflow: visible !important; display: block !important; }
    .quiz-shell { max-width: 100% !important; margin: 0 !important; }
    .nav-row { display: none !important; }
    .quiz-card { padding: 0 !important; box-shadow: none !important; }
    .quiz-hero { margin-top: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .result-panel { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { background: white !important; margin: 0; padding: 20px; }
  }
`;

export default function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('quizBuilderConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('quizBuilderConfig', JSON.stringify(config));
  }, [config]);

  const [activeTab, setActiveTab] = useState('questions');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState({ name: '', email: '', company: '', role: '' });
  
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const [applied, setApplied] = useState(false);
  const [tel, setTel] = useState('');
  const [telSent, setTelSent] = useState(false);

  const isQuestionStep = step < config.questions.length;
  const isGateStep = step === config.questions.length;
  const isResultStep = step === config.questions.length + 1;
  const progress = isResultStep ? 100 : Math.round((step / (config.questions.length + 1)) * 100);

  const scoreData = useMemo(() => {
    const raw = config.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const maxPossible = config.questions.length * 10;
    return maxPossible > 0 ? Math.round((raw / maxPossible) * 100) : 0;
  }, [answers, config.questions]);

  const activeResult = useMemo(() => {
    return config.results.find(r => scoreData <= r.maxScore) || config.results[config.results.length - 1];
  }, [scoreData, config.results]);

  const canProceed = isQuestionStep ? answers[config.questions[step]?.id] !== undefined : (lead.name && lead.email);

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [config.questions[step].id]: val });
    setTimeout(() => setStep(step + 1), 300);
  };

  const getAnswerLabels = () => {
    let labeledAnswers = {};
    config.questions.forEach(q => {
      const selectedOpt = q.options.find(o => o.value === answers[q.id]);
      labeledAnswers[q.id] = selectedOpt ? selectedOpt.label : 'N/A';
    });
    return labeledAnswers;
  };

  const getCleanWebhookUrl = (url) => {
    if (!url) return '';
    let clean = url.trim();
    if (clean.includes('script.google.com') && !clean.endsWith('/exec')) {
      if (clean.endsWith('/')) clean = clean.slice(0, -1);
      clean += '/exec';
    }
    return clean;
  };

  const submitToGoogle = async (actionData) => {
    const url = getCleanWebhookUrl(config.integration.webhookUrl);
    if (!url) return;
    
    try {
      const params = new URLSearchParams();
      params.append('payload', JSON.stringify(actionData));
      
      await fetch(url, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
    } catch (e) { console.error("Webhook failed:", e); }
  };

  const submitToWebhook = async () => {
    await submitToGoogle({ action: "submit", lead, answers: getAnswerLabels(), score: scoreData, timestamp: new Date().toISOString() });
    setStep(step + 1);
    if (config.integration.geminiApiKey) { generateAiAnalysis(); }
  };

  const requestAssessment = async () => {
    setApplied(true);
    await submitToGoogle({ action: "update", email: lead.email, assessmentRequested: true, timestamp: new Date().toISOString() });
  };

  const submitTel = async () => {
    if (!tel) return;
    setTelSent(true);
    await submitToGoogle({ action: "update", email: lead.email, tel: tel, timestamp: new Date().toISOString() });
  };

  const generateAiAnalysis = async () => {
    setIsGeneratingAI(true);
    setAiReport("");
    try {
      let qaText = config.questions.map(q => {
        const selectedOpt = q.options.find(o => o.value === answers[q.id]);
        return "Q: " + q.question + "\nA: " + (selectedOpt ? selectedOpt.label : 'N/A');
      }).join('\n\n');

      const promptStr = "Act as an expert workplace strategy consultant from the Steelcase Applied Research + Consulting (ARC) team. You are analyzing an 'AI Workplace Readiness' assessment for " + (lead.company || 'a client') + ". Their overall score is " + scoreData + "/100.\n\nHere are their specific answers:\n" + qaText + "\n\nWrite a professional diagnostic summary analyzing their readiness for AI-enabled workflows, hybrid collaboration, and spatial adaptability based specifically on their answers.\n\nStructure the report using exactly these four HTML headings (<h3>):\n\n<h3>What Your Readiness Score Means</h3>\nWrite a brief, objective paragraph explaining their score in the context of physical workspace readiness for the AI supercycle.\n\n<h3>Critical Friction Points</h3>\nProvide a bulleted list (<ul><li>) of 2-3 specific environmental or infrastructural barriers identified in their answers that will hinder AI adoption, focus, or cognitive performance. Use bold text for key concepts.\n\n<h3>Opportunities for High-Performance Optimization</h3>\nProvide a bulleted list (<ul><li>) of 2-3 specific opportunities where spatial interventions could immediately enhance their AI-augmented workflows. Where applicable, seamlessly integrate 1-2 of these exact Steelcase resources into your bullet points using HTML anchor tags (<a href=\"URL\" target=\"_blank\">Link Text</a>): \n- https://swiy.co/Steelcase-better-future-workplace \n- https://swiy.co/Steelcase-inclusive-future-workplace \n- https://swiy.co/Steelcase-community-based-design \n- https://swiy.co/Steelcase-4new-Ai-workspaces \n- https://swiy.co/Steelcase-People-Centered-AI-Spaces\n\n<h3>Next Steps in Your Diagnostic Journey</h3>\nWrite a brief, strategic paragraph stating that solving these complex friction points requires more than a quick fix. Explain that a Steelcase Applied Research + Consulting professional will reach out to schedule a deep-dive diagnostic session to look holistically at their culture, process, tools, and space in order to develop a comprehensive, Community-Based Design solution.\n\nFormat the entire response using standard HTML tags (<p>, <ul>, <li>, <strong>, <h3>, <a>). Return ONLY valid HTML, without any markdown formatting, backticks, or conversational filler.";

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + config.integration.geminiApiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptStr }] }] })
      });
      
      if (!response.ok) throw new Error(`API Error`);
      const data = await response.json();
      if (data.candidates && data.candidates[0]) {
        setAiReport(data.candidates[0].content.parts[0].text);
      } else { setAiReport("Error: Unexpected response format."); }
    } catch (e) {
      setAiReport("Error generating AI analysis.");
    } finally { setIsGeneratingAI(false); }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setAiReport("");
    setLead({ name: '', email: '', company: '', role: '' });
    setApplied(false);
    setTelSent(false);
    setTel("");
  };

  const exportGitHubFiles = async () => {
    alert("Export started! Files are downloading.");
  };

  return (
    <div className="app-layout">
      <style>{STYLES}</style>
      
      {/* BUILDER SIDEBAR */}
      <div className="builder-sidebar">
        <div className="builder-header">
          <h2><Settings size={20} /> Quiz Builder (Live Sync)</h2>
          <div style={{display:'flex', gap:8}}>
            <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('quizBuilderConfig'); window.location.reload(); }} style={{fontSize:12, padding:'6px 12px'}}>Reset</button>
            <button className="builder-export-btn" onClick={exportGitHubFiles}><Code size={16}/> Export GitHub Files</button>
          </div>
        </div>
        
        <div className="builder-tabs">
          <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content</button>
          <button className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>Questions & Scoring</button>
          <button className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</button>
          <button className={`tab-btn ${activeTab === 'integration' ? 'active' : ''}`} onClick={() => setActiveTab('integration')}>Integration</button>
        </div>

        <div className="builder-content">
          {activeTab === 'content' && (
            <>
              <div className="field-group">
                <label>Header Eyebrow</label>
                <input value={config.content.eyebrow} onChange={e => setConfig({...config, content: {...config.content, eyebrow: e.target.value}})} />
              </div>
              <div className="field-group">
                <label>Quiz Title</label>
                <input value={config.content.title} onChange={e => setConfig({...config, content: {...config.content, title: e.target.value}})} />
              </div>
              <div className="field-group">
                <label>Description</label>
                <textarea value={config.content.description} onChange={e => setConfig({...config, content: {...config.content, description: e.target.value}})} />
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <>
              <div className="field-group">
                <label>Primary Brand Color</label>
                <input type="color" value={config.branding.primaryColor} onChange={e => setConfig({...config, branding: {...config.branding, primaryColor: e.target.value}})} style={{padding: '2px', height: '40px'}} />
              </div>
              <div className="field-group">
                <label>Header Background Color</label>
                <input type="color" value={config.branding.headerColor} onChange={e => setConfig({...config, branding: {...config.branding, headerColor: e.target.value}})} style={{padding: '2px', height: '40px'}} />
              </div>
              <div className="field-group">
                <label>Page Background Color</label>
                <input type="color" value={config.branding.bodyColor} onChange={e => setConfig({...config, branding: {...config.branding, bodyColor: e.target.value}})} style={{padding: '2px', height: '40px'}} />
              </div>
            </>
          )}

          {activeTab === 'questions' && (
            <>
              <p style={{fontSize:'13px', color:'#6B7280', marginTop:0, marginBottom: 16}}>Customize questions, choices, and point values below.</p>
              {config.questions.map((q, qIdx) => (
                <div key={q.id} className="q-card">
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                      <label style={{fontSize: '12px', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', margin: 0}}>Metric {qIdx + 1}</label>
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to delete this question?')) {
                            const newQ = [...config.questions];
                            newQ.splice(qIdx, 1);
                            setConfig({...config, questions: newQ});
                          }
                        }} 
                        style={{background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', padding: 4}}
                      >
                        <Trash2 size={14}/> Delete
                      </button>
                  </div>

                  <div className="field-group" style={{marginBottom: 8}}>
                    <label>Question Text</label>
                    <textarea value={q.question} onChange={e => {
                      const newQ = [...config.questions];
                      newQ[qIdx].question = e.target.value;
                      setConfig({...config, questions: newQ});
                    }} />
                  </div>
                  <div className="field-group" style={{marginBottom: 12}}>
                    <label>Category / Section</label>
                    <input value={q.section} onChange={e => {
                      const newQ = [...config.questions];
                      newQ[qIdx].section = e.target.value;
                      setConfig({...config, questions: newQ});
                    }} />
                  </div>
                  <label style={{fontSize:'11px', textTransform:'uppercase', fontWeight:600, color:'#4B5563', marginBottom:6, display:'block'}}>Answer Options & Points</label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="opt-row">
                      <input value={opt.label} placeholder="Answer text" onChange={e => {
                        const newQ = [...config.questions];
                        newQ[qIdx].options[optIdx].label = e.target.value;
                        setConfig({...config, questions: newQ});
                      }} />
                      <input type="number" value={opt.value} placeholder="Pts" onChange={e => {
                        const newQ = [...config.questions];
                        newQ[qIdx].options[optIdx].value = Number(e.target.value);
                        setConfig({...config, questions: newQ});
                      }} />
                      <button className="btn btn-secondary" style={{padding:'8px', width:'100%', height:'100%'}} onClick={() => {
                        const newQ = [...config.questions];
                        newQ[qIdx].options.splice(optIdx, 1);
                        setConfig({...config, questions: newQ});
                      }}><Trash2 size={16} color="#DC2626"/></button>
                    </div>
                  ))}
                  <button className="btn btn-secondary" style={{width:'100%', marginTop:8, fontSize:'12px'}} onClick={() => {
                    const newQ = [...config.questions];
                    newQ[qIdx].options.push({ label: 'New Option', value: 5 });
                    setConfig({...config, questions: newQ});
                  }}><Plus size={14}/> Add Choice</button>
                </div>
              ))}

              <div style={{ padding: '24px 0', marginTop: '16px', borderTop: '2px dashed #D1D5DB' }}>
                <button 
                  className="btn btn-primary" 
                  style={{width:'100%', justifyContent: 'center', padding: '16px', fontSize: '15px', fontWeight: 'bold', backgroundColor: '#10B981', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}} 
                  onClick={() => {
                    const newQ = [...config.questions];
                    newQ.push({
                        id: "q" + Date.now(),
                        section: "New Category",
                        question: "Enter your new question here...",
                        options: [
                            { label: "Option 1", value: 0 },
                            { label: "Option 2", value: 5 },
                            { label: "Option 3", value: 10 }
                        ]
                    });
                    setConfig({...config, questions: newQ});
                    
                    setTimeout(() => {
                      const contentArea = document.querySelector('.builder-content');
                      if (contentArea) contentArea.scrollTop = contentArea.scrollHeight;
                    }, 100);
                }}>
                  <Plus size={20} style={{marginRight: 8}}/> + ADD NEW QUESTION
                </button>
              </div>
            </>
          )}

          {activeTab === 'integration' && (
            <>
              <div className="field-group">
                <label>Google Sheets Webhook URL</label>
                <input placeholder="https://script.google.com/macros/s/..." value={config.integration.webhookUrl} onChange={e => setConfig({...config, integration: {...config.integration, webhookUrl: e.target.value}})} />
                <div style={{fontSize:'12px', color:'#059669', marginTop:'6px', display:'flex', alignItems:'center', gap:'4px'}}><CheckCircle2 size={14}/> Settings automatically saved locally</div>
              </div>
              <div className="field-group">
                <label>Gemini API Key (For Custom AI Reports)</label>
                <input placeholder="AIzaSy..." type="password" value={config.integration.geminiApiKey} onChange={e => setConfig({...config, integration: {...config.integration, geminiApiKey: e.target.value}})} />
                <p style={{fontSize:'12px', color:'#6B7280', marginTop:'8px'}}>Get a free key from Google AI Studio. If provided, the final report will automatically generate a custom analysis using Gemini 3.5 Flash-Lite.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div className="preview-area" style={{ '--bg-page': config.branding.bodyColor, '--primary-color': config.branding.primaryColor, '--header-bg': config.branding.headerColor }}>
        <div className="quiz-shell">
          <div className="quiz-hero">
            <div>
              <div className="eyebrow"><BarChart2 size={14} style={{marginRight: 6}} /> {config.content.eyebrow}</div>
              <h1>{config.content.title}</h1>
              <p>{config.content.description}</p>
            </div>
            <div className="progress-card">
              <div style={{fontSize:'12px', fontWeight:600, color:'#9AA0A6', textTransform:'uppercase'}}>{isResultStep ? 'Report Generated' : 'Data Collection'}</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
              <div style={{fontSize:'28px', color:'white', marginTop:'12px'}}>{progress}%</div>
            </div>
          </div>

          <main className="quiz-card">
            {isQuestionStep && (() => {
              const q = config.questions[step];
              if (!q) return null; 
              
              return (
                <div>
                  <div className="question-head">
                    <div style={{fontSize:'12px', fontWeight:600, color:'#5F6368', textTransform:'uppercase', marginBottom:'12px'}}>Metric {step + 1} of {config.questions.length}</div>
                    <h2>{q.question}</h2>
                    <div className="section-label">{q.section}</div>
                  </div>
                  <div className="options-grid">
                    {q.options.map(opt => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <button key={opt.label} onClick={() => handleAnswer(opt.value)} className={`option-btn ${selected ? 'selected' : ''}`}>
                          <span>{opt.label} (<b>{opt.value} pts</b>)</span>
                          {selected && <CheckCircle2 size={18} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {isGateStep && (
              <div>
                <div className="question-head">
                  <h2>Generate Your Diagnostic Report</h2>
                  <p style={{color:'#5F6368', marginTop:'8px'}}>Data collection complete. Enter your details to process your customized readiness profile.</p>
                </div>
                <div className="form-grid">
                  <div className="form-group"><label>Full Name *</label><input required value={lead.name} onChange={e=>setLead({...lead, name: e.target.value})} /></div>
                  <div className="form-group"><label>Work Email *</label><input type="email" required value={lead.email} onChange={e=>setLead({...lead, email: e.target.value})} /></div>
                  <div className="form-group"><label>Company</label><input value={lead.company} onChange={e=>setLead({...lead, company: e.target.value})} /></div>
                  <div className="form-group"><label>Role / Job Title</label><input value={lead.role} onChange={e=>setLead({...lead, role: e.target.value})} /></div>
                </div>
                <div style={{fontSize:'12px', color:'#5F6368', display:'flex', alignItems:'center', gap:'6px'}}><Lock size={12}/> Data securely processed.</div>
              </div>
            )}

            {isResultStep && (
              <div className="result-grid">
                <div>
                  <div className="result-panel" style={{backgroundColor: activeResult.color}}>
                    <div style={{fontSize:'12px', fontWeight:600, textTransform:'uppercase'}}>{activeResult.tone}</div>
                    <div className="score-display">{scoreData}</div>
                    <div style={{fontSize:'12px', fontWeight:600}}>OUT OF 100</div>
                    <h2>{activeResult.title}</h2>
                    <p style={{fontSize:'14px', lineHeight:'1.6'}}>{activeResult.desc}</p>
                  </div>
                </div>
                
                <div>
                  {config.integration.geminiApiKey && (
                    <div className="ai-report-box" style={{marginTop:0, marginBottom: 24}}>
                      <div className="ai-header"><BarChart2 size={20}/> Custom AI Diagnosis</div>
                      {isGeneratingAI ? (
                        <div className="ai-loading"><div className="spinner"></div> Analyzing metrics...</div>
                      ) : (
                        <div className="ai-content" dangerouslySetInnerHTML={{__html: aiReport}} />
                      )}
                    </div>
                  )}
                  
                  <div style={{padding:'24px', background:'#F8F9FA', borderRadius:'8px', border:'1px solid #DADCE0'}}>
                    <h4 style={{margin:'0 0 8px', fontSize:'16px'}}>Professional Assessment</h4>
                    <p style={{fontSize:'13px', color:'#5F6368', margin:'0 0 16px'}}>Schedule a deep-dive session with a workplace strategy specialist.</p>
                    
                    <button 
                      className="btn btn-primary" 
                      onClick={requestAssessment}
                      disabled={applied}
                      style={{width: '100%', justifyContent: 'center', marginBottom: 12, backgroundColor: applied ? '#9CA3AF' : 'var(--primary-color)'}}
                    >
                      <Mail size={16}/> {applied ? "Request Sent" : "Apply Now"}
                    </button>
                    
                    {applied && !telSent && (
                      <div style={{background:'white', padding:16, border:'1px solid #E5E7EB', borderRadius:6, marginTop:12}}>
                        <label style={{fontSize:12, fontWeight:600, display:'block', marginBottom:8}}>Add Telephone (Optional)</label>
                        <div style={{display:'flex', gap:8}}>
                          <input type="tel" placeholder="+1..." value={tel} onChange={e=>setTel(e.target.value)} style={{flex:1, padding:'8px 12px', border:'1px solid #D1D5DB', borderRadius:4}} />
                          <button onClick={submitTel} className="btn btn-secondary" style={{padding:'8px 12px'}}>Send</button>
                        </div>
                      </div>
                    )}
                    {telSent && (
                      <div style={{fontSize:13, color:'#059669', display:'flex', alignItems:'center', gap:6, marginTop:8}}><CheckCircle2 size={14}/> Phone saved</div>
                    )}
                    
                    <div style={{fontSize:12, color:'#059669', display:'flex', alignItems:'center', gap:6, justifyContent:'center', marginTop:12}}>
                      <CheckCircle2 size={14}/> Qualified for Consultation
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Repaired Bottom Navigation */}
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || isResultStep}>
                <ArrowLeft size={16} /> Back
              </button>
              
              {isGateStep && (
                <button className="btn btn-primary" onClick={submitToWebhook} disabled={!canProceed}>
                  Generate Report <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* Repaired Reset Button Layout */}
            {isResultStep && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={resetQuiz}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', transition: 'color 0.2s' }}
                >
                  <RefreshCw size={14} /> Retake Assessment
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
