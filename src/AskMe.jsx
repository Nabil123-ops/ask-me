import { useState, useRef, useEffect, useCallback } from "react";

// ── MODELS ────────────────────────────────────────────────────────────────────
const MODELS = [
  {
    id: "claude-opus-4-6",
    emoji: "🐙",
    nick: "Octopus 4.2",
    full: "Ask Me · Octopus 4.2",
    blurb: "Deepest reasoning · Complex analysis · Research-grade",
    badge: "APEX",
    badgeColor: "#0369a1",
    badgeBg: "#e0f2fe",
  },
  {
    id: "claude-sonnet-4-6",
    emoji: "🕷️",
    nick: "Spider 5.0",
    full: "Ask Me · Spider 5.0",
    blurb: "Balanced power · Fast & versatile · Best for most tasks",
    badge: "CORE",
    badgeColor: "#0d7a5f",
    badgeBg: "#d1fae5",
  },
  {
    id: "claude-haiku-4-5-20251001",
    emoji: "🦋",
    nick: "Butterfly 3.1",
    full: "Ask Me · Butterfly 3.1",
    blurb: "Ultra-fast · Lightweight · Instant answers",
    badge: "SWIFT",
    badgeColor: "#6d4c9e",
    badgeBg: "#ede9fe",
  },
];

// ── CONNECTORS ────────────────────────────────────────────────────────────────
const INIT_CONNECTORS = [
  { id: "websearch", icon: "🌐", name: "Web Search",     cat: "Internet",    desc: "Real-time search across the web",         color: "#0ea5e9", active: false },
  { id: "github",   icon: "🐙", name: "GitHub",         cat: "Developer",   desc: "Repos, issues, pull requests & code",     color: "#24292f", active: false },
  { id: "files",    icon: "📁", name: "File Analysis",  cat: "Productivity",desc: "Upload & analyze documents, PDFs, CSVs",  color: "#f59e0b", active: false },
  { id: "voice",    icon: "🎙️", name: "Voice Input",    cat: "Input",       desc: "Speak your messages hands-free",          color: "#ef4444", active: false },
  { id: "canva",    icon: "🎨", name: "Canva",          cat: "Design",      desc: "Create & edit designs with AI",           color: "#7c3aed", active: false },
  { id: "weather",  icon: "🌤️", name: "Weather",        cat: "Utilities",   desc: "Live forecasts & weather data",           color: "#0284c7", active: false },
  { id: "chrome",   icon: "🟡", name: "Google Chrome",  cat: "Browser",     desc: "Browse tabs, read pages, navigate web",   color: "#facc15", active: false },
  { id: "gdocs",    icon: "📄", name: "Google Docs",    cat: "Productivity",desc: "Create and edit documents live",          color: "#4285f4", active: false },
  { id: "sheets",   icon: "📊", name: "Google Sheets",  cat: "Productivity",desc: "Analyze and build spreadsheets",          color: "#34a853", active: false },
  { id: "notion",   icon: "📓", name: "Notion",         cat: "Productivity",desc: "Connect your Notion workspace & pages",   color: "#000000", active: false },
  { id: "slack",    icon: "💬", name: "Slack",          cat: "Team",        desc: "Post messages & read channels",           color: "#611f69", active: false },
  { id: "calendar", icon: "📅", name: "Google Calendar",cat: "Utilities",   desc: "View & create calendar events",           color: "#ea4335", active: false },
  { id: "dalle",    icon: "🖼️", name: "Image Gen",      cat: "Creative",    desc: "Generate images with AI",                color: "#ec4899", active: false },
  { id: "code",     icon: "⚡", name: "Code Runner",   cat: "Developer",   desc: "Execute code in a live sandbox",          color: "#10b981", active: false },
  { id: "maps",     icon: "🗺️", name: "Google Maps",    cat: "Utilities",   desc: "Search places, get directions & routes",  color: "#fbbc04", active: false },
  { id: "spotify",  icon: "🎵", name: "Spotify",        cat: "Media",       desc: "Play music, discover playlists & tracks", color: "#1db954", active: false },
];

const RESPONSE_STYLES = [
  { id: "default",  label: "Default",   prompt: "" },
  { id: "concise",  label: "Concise",   prompt: "Keep responses brief and to the point — 2-3 sentences max unless essential." },
  { id: "detailed", label: "Detailed",  prompt: "Give comprehensive, thorough answers with examples, context, and nuance." },
  { id: "formal",   label: "Formal",    prompt: "Use a professional, polished, academic tone throughout." },
  { id: "creative", label: "Creative",  prompt: "Be imaginative, vivid, and expressive. Think outside the box." },
  { id: "bullet",   label: "Bullet",    prompt: "Structure your responses with clear bullet points and headers." },
];

const STARTERS = [
  { icon: "✍️", cat: "Writing",   text: "Write a compelling executive summary for my project" },
  { icon: "🧠", cat: "Learning",  text: "Explain quantum entanglement like I'm 12 years old" },
  { icon: "💼", cat: "Career",    text: "Critique and rewrite my resume for maximum impact" },
  { icon: "🐛", cat: "Dev",       text: "Debug my code and suggest performance improvements" },
  { icon: "📈", cat: "Strategy",  text: "Give me a go-to-market strategy for a SaaS startup" },
  { icon: "🌍", cat: "Travel",    text: "Plan a 10-day luxury itinerary for Japan" },
];

function uid() { return Math.random().toString(36).slice(2, 10); }

// ── LOGO ─────────────────────────────────────────────────────────────────────
function AskMeLogo({ size = 40, textSize = null, noText = false }) {
  const ts = textSize || size * 0.55;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="amlg1" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9"/>
            <stop offset="55%" stopColor="#38bdf8"/>
            <stop offset="100%" stopColor="#bae6fd"/>
          </linearGradient>
          <linearGradient id="amlg2" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0e9da"/>
            <stop offset="100%" stopColor="#e8dece"/>
          </linearGradient>
          <filter id="amglow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2"/>
            <feComposite in2="SourceGraphic"/>
          </filter>
        </defs>
        {/* Background rounded square */}
        <rect width="56" height="56" rx="16" fill="url(#amlg1)"/>
        {/* Beige inner glow circle */}
        <circle cx="28" cy="28" r="17" fill="url(#amlg2)" opacity="0.25"/>
        {/* Question mark body */}
        <path d="M21 21c0-3.866 3.134-7 7-7s7 3.134 7 7c0 3-2 4.5-4 6-1.5 1.1-2 2-2 3.5" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
        {/* Question mark dot */}
        <circle cx="28" cy="41" r="2.4" fill="white"/>
        {/* Orbiting dot accent */}
        <circle cx="44" cy="14" r="3.5" fill="white" opacity="0.6"/>
        <circle cx="12" cy="44" r="2.5" fill="white" opacity="0.4"/>
      </svg>
      {!noText && (
        <span style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          fontSize: ts,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 50%, #38bdf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}>
          Ask Me
        </span>
      )}
    </div>
  );
}

// ── MARKDOWN RENDERER ─────────────────────────────────────────────────────────
function Markdown({ text }) {
  const html = text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="codeblock"><div class="cb-hdr"><span class="cb-lang">${lang||"code"}</span><button class="cb-copy" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(code.trim())}'))">Copy</button></div><pre><code>${code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre></div>`)
    .replace(/`([^`\n]+)`/g, '<code class="ic">$1</code>')
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="mh3">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 class="mh2">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 class="mh1">$1</h1>')
    .replace(/^> (.+)$/gm,   '<blockquote class="mbq">$1</blockquote>')
    .replace(/^[-*] (.+)$/gm,'<li class="mli">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, s => `<ul class="mul">${s}</ul>`)
    .replace(/^\d+\.\s(.+)$/gm,'<li class="mli num">$1</li>')
    .replace(/\n\n/g, '</p><p class="mp">');
  return <div className="md" dangerouslySetInnerHTML={{ __html: `<p class="mp">${html}</p>` }} />;
}

// ── TYPING ────────────────────────────────────────────────────────────────────
function Thinking({ modelEmoji }) {
  return (
    <div className="thinking">
      <span className="th-emoji">{modelEmoji}</span>
      <div className="th-dots"><span/><span/><span/></div>
      <span className="th-label">Ask Me is thinking…</span>
    </div>
  );
}

// ── VOICE INPUT ───────────────────────────────────────────────────────────────
function useVoice(onResult, enabled) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);

  const start = useCallback(() => {
    if (!enabled || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = e => { onResult(e.results[0][0].transcript); setListening(false); };
    r.onend = () => setListening(false);
    r.start();
    recRef.current = r;
    setListening(true);
  }, [enabled, onResult]);

  const stop = useCallback(() => { recRef.current?.stop(); setListening(false); }, []);
  return { listening, start, stop };
}

// ── GITHUB MODAL ──────────────────────────────────────────────────────────────
function GithubModal({ onClose, onConnect }) {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | loading | done

  const connect = () => {
    if (!token.trim()) return;
    setPhase("loading");
    setTimeout(() => { setPhase("done"); setTimeout(() => { onConnect({ token, repo }); onClose(); }, 900); }, 1600);
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28}}>🐙</span>
            <div>
              <div className="modal-title">Connect GitHub</div>
              <div className="modal-sub">Access your repositories, issues & code history</div>
            </div>
          </div>
          <button className="x-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="fg">
            <label className="fl">Personal Access Token</label>
            <input className="fi" type="password" placeholder="ghp_xxxxxxxxxxxxxxxx" value={token} onChange={e=>setToken(e.target.value)}/>
            <div className="fh">Generate at GitHub → Settings → Developer Settings → Personal access tokens → Fine-grained tokens</div>
          </div>
          <div className="fg">
            <label className="fl">Default Repository <span style={{fontWeight:400,color:"var(--t3)"}}>(optional)</span></label>
            <input className="fi" placeholder="username/repository" value={repo} onChange={e=>setRepo(e.target.value)}/>
          </div>
          <div className="perms">
            {["Read repository contents & metadata","View commit history & branches","Access issues & pull requests","Read Actions workflow runs"].map(p=>(
              <div key={p} className="perm"><span className="pcheck">✓</span>{p}</div>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-sec" onClick={onClose}>Cancel</button>
          <button className={`btn-pri ${phase}`} onClick={connect} disabled={phase==="loading"}>
            {phase==="loading" ? "Connecting…" : phase==="done" ? "✓ Connected!" : "Connect GitHub"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CONNECTOR CARD ────────────────────────────────────────────────────────────
function ConnCard({ conn, onToggle, onGitHub }) {
  const handleClick = () => {
    if (conn.id === "github" && !conn.active) { onGitHub(); return; }
    onToggle(conn.id);
  };
  return (
    <div className={`conn-card ${conn.active?"cc-on":""}`} style={conn.active ? {borderColor: conn.color+"66", boxShadow:`0 4px 18px ${conn.color}22`} : {}}>
      <div className="cc-top">
        <div className="cc-icon" style={{background:`${conn.color}18`}}>{conn.icon}</div>
        <div className={`tog ${conn.active?"tog-on":""}`} onClick={handleClick} style={conn.active?{background:conn.color}:{}}>
          <span className="tok"/>
        </div>
      </div>
      <div className="cc-cat" style={conn.active?{color:conn.color}:{}}>{conn.cat}</div>
      <div className="cc-name">{conn.name}</div>
      <div className="cc-desc">{conn.desc}</div>
      {conn.active && <div className="cc-status" style={{color:conn.color}}>● Active</div>}
    </div>
  );
}

// ── CONNECTORS PANEL ──────────────────────────────────────────────────────────
function ConnectorsPanel({ connectors, onToggle, onGitHub, onClose }) {
  const cats = [...new Set(connectors.map(c=>c.cat))];
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="side-panel">
        <div className="sp-head">
          <div>
            <div className="sp-title">Connectors</div>
            <div className="sp-sub">Extend Ask Me with powerful integrations</div>
          </div>
          <button className="x-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sp-active-bar">
          {connectors.filter(c=>c.active).map(c=>(
            <div key={c.id} className="sp-chip" style={{borderColor:c.color+"55",color:c.color,background:c.color+"11"}}>
              {c.icon} {c.name}
            </div>
          ))}
          {!connectors.some(c=>c.active) && <div className="sp-none">No connectors active yet</div>}
        </div>
        <div className="sp-body">
          {cats.map(cat=>(
            <div key={cat} className="sp-section">
              <div className="sp-cat">{cat}</div>
              <div className="cc-grid">
                {connectors.filter(c=>c.cat===cat).map(c=>(
                  <ConnCard key={c.id} conn={c} onToggle={onToggle} onGitHub={onGitHub}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MODEL SELECTOR ────────────────────────────────────────────────────────────
function ModelPicker({ model, onChange }) {
  const [open, setOpen] = useState(false);
  const cur = MODELS.find(m=>m.id===model)||MODELS[1];
  const ref = useRef(null);

  useEffect(()=>{
    if (!open) return;
    const close = e => { if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",close);
    return ()=>document.removeEventListener("mousedown",close);
  },[open]);

  return (
    <div className="mp-wrap" ref={ref}>
      <button className="mp-btn" onClick={()=>setOpen(o=>!o)}>
        <span className="mp-em">{cur.emoji}</span>
        <span className="mp-nick">{cur.nick}</span>
        <span className="mp-badge" style={{color:cur.badgeColor,background:cur.badgeBg}}>{cur.badge}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{opacity:.45,marginLeft:2}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="mp-drop">
          <div className="mp-droph">Choose Intelligence Level</div>
          {MODELS.map(m=>(
            <button key={m.id} className={`mp-opt ${m.id===model?"mp-sel":""}`} onClick={()=>{onChange(m.id);setOpen(false);}}>
              <span className="mp-opt-em">{m.emoji}</span>
              <div style={{flex:1}}>
                <div className="mp-opt-name">{m.full}</div>
                <div className="mp-opt-desc">{m.blurb}</div>
              </div>
              <span className="mp-badge" style={{color:m.badgeColor,background:m.badgeBg}}>{m.badge}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MESSAGE ───────────────────────────────────────────────────────────────────
function Msg({ msg, isLast, onRegen, modelId }) {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const [vote, setVote] = useState(null);
  const m = MODELS.find(x=>x.id===modelId)||MODELS[1];

  const copy = () => {
    navigator.clipboard.writeText(msg.content).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  if (msg.role==="user") return (
    <div className="row-u">
      <div className="bub-u">
        {msg.files?.length>0 && (
          <div className="bub-files">{msg.files.map((f,i)=><span key={i} className="bub-file">📎 {f.name}</span>)}</div>
        )}
        <span>{msg.content}</span>
      </div>
      <div className="av-u">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
    </div>
  );

  return (
    <div className="row-a" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div className="av-a" style={{background:`linear-gradient(135deg, ${m.badgeBg}, white)`, border:`1.5px solid ${m.badgeColor}33`}}>
        <span style={{fontSize:17}}>{m.emoji}</span>
      </div>
      <div className="ai-body">
        <div className="ai-tag" style={{color:m.badgeColor}}>{m.full}</div>
        {msg.thinking ? <Thinking modelEmoji={m.emoji}/> : <Markdown text={msg.content}/>}
        {!msg.thinking && (
          <div className={`actbar ${(hover||isLast)?"ab-vis":""}`}>
            <button className={`ab-btn ${copied?"ab-ok":""}`} onClick={copy}>
              {copied ? <>✓ Copied</> : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>}
            </button>
            {isLast && onRegen && (
              <button className="ab-btn" onClick={onRegen}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Retry
              </button>
            )}
            <div className="ab-sep"/>
            <button className={`ab-btn ${vote===1?"ab-up":""}`} onClick={()=>setVote(vote===1?null:1)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill={vote===1?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
            </button>
            <button className={`ab-btn ${vote===-1?"ab-dn":""}`} onClick={()=>setVote(vote===-1?null:-1)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill={vote===-1?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ chats, active, onSelect, onNew, onDelete, onRename, collapsed, onToggle }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [ev, setEv] = useState("");

  const filtered = chats.filter(c=>c.title.toLowerCase().includes(q.toLowerCase()));
  const grouped = filtered.reduce((a,c)=>{
    const diff=(Date.now()-c.ts)/86400000;
    const g = diff<1?"Today":diff<7?"This Week":diff<30?"This Month":"Older";
    (a[g]=a[g]||[]).push(c); return a;
  },{});

  return (
    <aside className={`sb ${collapsed?"sb-off":""}`}>
      {/* Header */}
      <div className="sb-hd">
        {!collapsed && <AskMeLogo size={32} textSize={18}/>}
        {collapsed && <AskMeLogo size={30} noText/>}
        <button className="ib sb-tog" onClick={onToggle}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {!collapsed && (
        <>
          <button className="sb-new" onClick={onNew}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Conversation
          </button>

          <div className="sb-srch">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search conversations…" value={q} onChange={e=>setQ(e.target.value)} className="sb-si"/>
          </div>

          <div className="sb-list">
            {["Today","This Week","This Month","Older"].map(g=>{
              const items=grouped[g]; if(!items?.length) return null;
              return (
                <div key={g}>
                  <div className="sb-gl">{g}</div>
                  {items.map(c=>(
                    <div key={c.id} className={`sb-it ${c.id===active?"sb-act":""}`} onClick={()=>onSelect(c.id)}>
                      {editing===c.id
                        ? <input className="sb-ei" autoFocus value={ev} onChange={e=>setEv(e.target.value)} onClick={e=>e.stopPropagation()} onBlur={()=>{onRename(c.id,ev);setEditing(null);}} onKeyDown={e=>{if(e.key==="Enter"){onRename(c.id,ev);setEditing(null);}}}/>
                        : <>
                            <span className="sb-ico">💬</span>
                            <span className="sb-ttl">{c.title}</span>
                            <div className="sb-acts">
                              <button className="ib mini" onClick={e=>{e.stopPropagation();setEditing(c.id);setEv(c.title);}}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button className="ib mini" onClick={e=>{e.stopPropagation();onDelete(c.id);}}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                              </button>
                            </div>
                          </>
                      }
                    </div>
                  ))}
                </div>
              );
            })}
            {filtered.length===0 && (
              <div className="sb-empty">
                <div style={{fontSize:36,marginBottom:8}}>💬</div>
                <div>No conversations yet.<br/>Start one below!</div>
              </div>
            )}
          </div>

          <div className="sb-ft">
            <div className="sb-user">
              <div className="sb-av">A</div>
              <div>
                <div className="sb-un">Ask Me User</div>
                <div className="sb-pl">All Features · Unlimited</div>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

// ── INPUT AREA ────────────────────────────────────────────────────────────────
function InputBar({ onSend, busy, model, onModel, style, onStyle, connectors, onShowConn }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const voiceActive = connectors.find(c=>c.id==="voice")?.active;

  const onVoiceResult = useCallback(t => setText(p => p + (p?" ":"") + t), []);
  const { listening, start: startVoice, stop: stopVoice } = useVoice(onVoiceResult, !!voiceActive);

  useEffect(()=>{
    if (!taRef.current) return;
    taRef.current.style.height="auto";
    taRef.current.style.height=Math.min(taRef.current.scrollHeight,190)+"px";
  },[text]);

  const send = () => {
    if (!text.trim()||busy) return;
    onSend(text.trim(), files);
    setText(""); setFiles([]);
    if (taRef.current) taRef.current.style.height="auto";
  };
  const onKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };
  const addFiles = e => setFiles(p=>[...p,...Array.from(e.target.files)]);
  const wsActive = connectors.find(c=>c.id==="websearch")?.active;
  const activeConns = connectors.filter(c=>c.active);

  return (
    <div className="ib-wrap">
      {/* Toolbar */}
      <div className="ib-top">
        <ModelPicker model={model} onChange={onModel}/>
        <div className="style-row">
          {RESPONSE_STYLES.map(s=>(
            <button key={s.id} className={`sp ${style===s.id?"sp-on":""}`} onClick={()=>onStyle(s.id)}>{s.label}</button>
          ))}
        </div>
        <button className={`conn-trigger ${activeConns.length?"ct-on":""}`} onClick={onShowConn}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
          Connectors
          {activeConns.length>0 && <span className="ct-badge">{activeConns.length}</span>}
        </button>
      </div>

      {/* Active connector chips */}
      {activeConns.length>0 && (
        <div className="ib-chips">
          {activeConns.map(c=>(
            <div key={c.id} className="ibc" style={{borderColor:c.color+"44",background:c.color+"0d",color:c.color}}>
              <span>{c.icon}</span>{c.name}<span className="ibc-dot">●</span>
            </div>
          ))}
        </div>
      )}

      {/* File chips */}
      {files.length>0 && (
        <div className="ib-files">
          {files.map((f,i)=>(
            <div key={i} className="fc">
              📎 {f.name}
              <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Main box */}
      <div className={`ib-box ${listening?"ib-listening":""}`}>
        <textarea
          ref={taRef}
          className="ib-ta"
          rows={1}
          disabled={busy}
          placeholder={listening ? "🎙️ Listening…" : wsActive ? "Search the web with Ask Me…" : "Ask me anything…"}
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={onKey}
        />
        <div className="ib-btns">
          {voiceActive && (
            <button className={`ib-ib ${listening?"ib-mic-on":""}`} onClick={listening?stopVoice:startVoice} title="Voice input">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
          )}
          <button className="ib-ib" onClick={()=>fileRef.current?.click()} title="Attach file">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input ref={fileRef} type="file" multiple hidden onChange={addFiles}/>
          <button className={`send ${text.trim()&&!busy?"send-on":""}`} onClick={send} disabled={!text.trim()||busy}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="ib-disc">Ask Me can make mistakes — always verify important information</div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function AskMe() {
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [style, setStyle] = useState("default");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [sbOff, setSbOff] = useState(false);
  const [connectors, setConnectors] = useState(INIT_CONNECTORS);
  const [showConn, setShowConn] = useState(false);
  const [showGH, setShowGH] = useState(false);
  const endRef = useRef(null);

  const cur = chats.find(c=>c.id===active);
  const msgs = cur?.messages||[];

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const upd = useCallback((id,fn)=>{ setChats(p=>p.map(c=>c.id===id?{...c,...fn(c)}:c)); },[]);

  const newChat = useCallback((title="New Chat")=>{
    const id = uid();
    setChats(p=>[{id,title,messages:[],ts:Date.now()},...p]);
    setActive(id); return id;
  },[]);

  const buildSystem = useCallback(()=>{
    const styleRule = RESPONSE_STYLES.find(s=>s.id===style)?.prompt||"";
    const wsOn = connectors.find(c=>c.id==="websearch")?.active;
    const ghOn = connectors.find(c=>c.id==="github")?.active;
    const wOn  = connectors.find(c=>c.id==="weather")?.active;
    const voiceOn = connectors.find(c=>c.id==="voice")?.active;

    let sys = `You are Ask Me, a world-class premium AI assistant. You are knowledgeable, precise, helpful, and warm.`;
    if (styleRule) sys += `\n\nResponse style: ${styleRule}`;
    if (wsOn) sys += `\n\nWeb Search is enabled. When asked about current events, news, or real-time data, indicate you have access to up-to-date information.`;
    if (ghOn) sys += `\n\nGitHub is connected. Help the user with their code, repositories, pull requests, and development workflow.`;
    if (wOn)  sys += `\n\nWeather connector is active. When asked about weather, provide helpful weather-related information.`;
    if (voiceOn) sys += `\n\nVoice input is enabled — the user may be speaking their messages, so interpret them accordingly.`;
    return sys;
  },[style, connectors]);

  const sendMsg = useCallback(async (content, files)=>{
    let chatId = active;
    if (!chatId || !chats.find(c=>c.id===active)) {
      chatId = newChat(content.slice(0,50)+(content.length>50?"…":""));
    } else if ((chats.find(c=>c.id===active)?.messages||[]).length===0) {
      upd(chatId,()=>({title:content.slice(0,50)}));
    }

    const userMsg = { id:uid(), role:"user", content, files:files.map(f=>({name:f.name,type:f.type})), ts:Date.now() };
    const thinkMsg = { id:uid(), role:"assistant", content:"", thinking:true, ts:Date.now() };

    setChats(p=>p.map(c=>c.id===chatId?{...c,messages:[...c.messages,userMsg,thinkMsg]}:c));
    setBusy(true); setErr(null);

    const history = [...(chats.find(c=>c.id===chatId)?.messages||[]), userMsg]
      .filter(m=>!m.thinking)
      .map(m=>({role:m.role,content:m.content}));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model,
          max_tokens:1000,
          system:buildSystem(),
          messages:history,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d.error?.message||`API Error ${res.status}`);
      }
      const data = await res.json();
      const reply = data.content?.map(b=>b.text||"").join("")||"";
      setChats(p=>p.map(c=>c.id===chatId?{...c,messages:c.messages.map(m=>m.thinking?{...m,content:reply,thinking:false}:m)}:c));
    } catch(e) {
      setErr(e.message);
      setChats(p=>p.map(c=>c.id===chatId?{...c,messages:c.messages.filter(m=>!m.thinking)}:c));
    } finally { setBusy(false); }
  },[active, chats, model, buildSystem, newChat, upd]);

  const regen = useCallback(async ()=>{
    if(!cur||busy) return;
    const lastU = [...msgs].reverse().find(m=>m.role==="user");
    if(!lastU) return;
    const tk = {id:uid(),role:"assistant",content:"",thinking:true,ts:Date.now()};
    upd(active,c=>({messages:[...c.messages.filter(m=>!m.thinking),tk]}));
    setBusy(true); setErr(null);
    const history=msgs.filter(m=>m.role==="user"||(m.role==="assistant"&&!m.thinking)).map(m=>({role:m.role,content:m.content}));
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model,max_tokens:1000,messages:history})});
      if(!res.ok) throw new Error("Regeneration failed");
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"";
      upd(active,c=>({messages:c.messages.map(m=>m.thinking?{...m,content:reply,thinking:false}:m)}));
    } catch(e){setErr(e.message);upd(active,c=>({messages:c.messages.filter(m=>!m.thinking)}));}
    finally{setBusy(false);}
  },[active,cur,msgs,model,busy,upd]);

  const toggleConn = id => setConnectors(p=>p.map(c=>c.id===id?{...c,active:!c.active}:c));
  const connectGH  = info => setConnectors(p=>p.map(c=>c.id==="github"?{...c,active:true,...info}:c));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Lato:wght@300;400;700&display=swap');

        :root {
          --sky:  #0ea5e9;
          --sky2: #38bdf8;
          --sky3: #7dd3fc;
          --sky4: #bae6fd;
          --sky5: #e0f2fe;
          --navy: #0369a1;
          --navy2:#0284c7;

          --beige:  #f5f0e8;
          --beige2: #ede7d8;
          --beige3: #ddd0ba;
          --beige4: #ccc0a0;

          --gray:  #f8f9fb;
          --gray2: #f0f2f5;
          --gray3: #e4e8ef;
          --gray4: #c8d0dc;
          --gray5: #8896a8;

          --text:  #1a2232;
          --text2: #2e3d52;
          --text3: #5a6c82;
          --text4: #9aaabb;

          --border: #e2e8f0;
          --border2:#ccd5e0;

          --sh: 0 1px 4px rgba(14,30,50,.07), 0 1px 2px rgba(14,30,50,.05);
          --sh2:0 4px 16px rgba(14,30,50,.11), 0 2px 6px rgba(14,30,50,.07);
          --sh3:0 12px 48px rgba(14,30,50,.16);
          --r:  12px;
          --rl: 20px;
        }

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Lato',system-ui,sans-serif;background:var(--gray);color:var(--text);font-size:14px;line-height:1.65;-webkit-font-smoothing:antialiased;}

        /* APP SHELL */
        .app{display:flex;height:100vh;overflow:hidden;background:var(--gray);}

        /* ── SIDEBAR ── */
        .sb{
          width:272px;min-width:272px;
          background:white;
          border-right:1.5px solid var(--border);
          display:flex;flex-direction:column;
          transition:width .24s cubic-bezier(.4,0,.2,1),min-width .24s cubic-bezier(.4,0,.2,1);
          overflow:hidden;
          box-shadow:3px 0 16px rgba(14,30,50,.04);
        }
        .sb.sb-off{width:58px;min-width:58px;}

        .sb-hd{
          display:flex;align-items:center;justify-content:space-between;
          padding:16px 14px;
          border-bottom:1px solid var(--border);
          min-height:66px;
          background:linear-gradient(135deg,white,var(--sky5));
        }

        .sb-new{
          display:flex;align-items:center;gap:8px;
          margin:12px 12px 8px;
          padding:10px 16px;
          background:linear-gradient(135deg,var(--navy),var(--sky));
          color:white;border:none;border-radius:var(--r);
          font-size:13px;font-weight:700;cursor:pointer;
          font-family:inherit;letter-spacing:.01em;
          box-shadow:0 3px 12px rgba(3,105,161,.3);
          transition:all .2s;
        }
        .sb-new:hover{background:linear-gradient(135deg,var(--navy2),var(--sky2));box-shadow:0 5px 20px rgba(3,105,161,.4);transform:translateY(-1px);}

        .sb-srch{
          display:flex;align-items:center;gap:8px;
          margin:0 12px 8px;padding:8px 12px;
          background:var(--gray2);border:1px solid var(--border);border-radius:10px;
          color:var(--text4);
        }
        .sb-si{flex:1;background:none;border:none;outline:none;font-size:13px;color:var(--text2);font-family:inherit;}
        .sb-si::placeholder{color:var(--text4);}

        .sb-list{flex:1;overflow-y:auto;padding:4px 8px;}
        .sb-list::-webkit-scrollbar{width:4px;}
        .sb-list::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}

        .sb-gl{font-size:10px;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:.08em;padding:10px 8px 4px;}

        .sb-it{
          display:flex;align-items:center;gap:8px;
          padding:8px 8px;border-radius:10px;cursor:pointer;
          transition:background .14s;min-height:38px;
        }
        .sb-it:hover{background:var(--sky5);}
        .sb-it.sb-act{background:var(--sky5);border-left:2.5px solid var(--sky);}
        .sb-ico{font-size:12px;opacity:.55;flex-shrink:0;}
        .sb-ttl{flex:1;font-size:13px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .sb-it.sb-act .sb-ttl{color:var(--navy);font-weight:700;}
        .sb-acts{display:none;gap:2px;}
        .sb-it:hover .sb-acts{display:flex;}
        .sb-ei{flex:1;background:white;border:1.5px solid var(--sky);border-radius:6px;padding:2px 8px;font-size:13px;outline:none;font-family:inherit;color:var(--text);}
        .sb-empty{text-align:center;color:var(--text4);font-size:12.5px;padding:40px 16px;line-height:1.8;}

        .sb-ft{border-top:1px solid var(--border);padding:12px;}
        .sb-user{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;cursor:pointer;transition:background .14s;}
        .sb-user:hover{background:var(--gray2);}
        .sb-av{width:32px;height:32px;background:linear-gradient(135deg,var(--navy),var(--sky));border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:13px;flex-shrink:0;}
        .sb-un{font-size:13px;font-weight:700;color:var(--text);}
        .sb-pl{font-size:11px;color:var(--sky);font-weight:600;}

        /* ── MAIN ── */
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--gray);}

        /* ── WELCOME ── */
        .welcome{
          flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:40px 24px;overflow-y:auto;
          background:radial-gradient(ellipse at 50% 30%,var(--sky5) 0%,var(--beige) 50%,var(--gray) 100%);
        }
        .wl-logo{margin-bottom:28px;animation:wfloat 4s ease-in-out infinite;}
        @keyframes wfloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        .wl-h1{
          font-family:'Playfair Display',Georgia,serif;
          font-size:40px;font-weight:900;letter-spacing:-.025em;
          color:var(--text);text-align:center;margin-bottom:12px;
        }
        .wl-h1 em{
          font-style:normal;
          background:linear-gradient(135deg,var(--navy) 0%,var(--sky) 60%,var(--sky3) 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        }
        .wl-sub{color:var(--text3);font-size:16px;text-align:center;max-width:420px;margin-bottom:42px;font-weight:300;}

        .starters{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:700px;width:100%;}
        @media(max-width:640px){.starters{grid-template-columns:1fr 1fr;}}

        .sc{
          background:white;border:1.5px solid var(--border);border-radius:var(--r);
          padding:18px 16px;cursor:pointer;text-align:left;font-family:inherit;
          transition:all .2s;box-shadow:var(--sh);
        }
        .sc:hover{border-color:var(--sky);box-shadow:0 6px 24px rgba(14,165,233,.14);transform:translateY(-3px);}
        .sc-cat{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--sky);margin-bottom:8px;}
        .sc-ico{font-size:22px;margin-bottom:8px;}
        .sc-txt{font-size:12.5px;color:var(--text2);line-height:1.55;font-weight:400;}

        /* ── MESSAGES ── */
        .msgs-wrap{flex:1;overflow-y:auto;padding:28px 0 8px;}
        .msgs-wrap::-webkit-scrollbar{width:6px;}
        .msgs-wrap::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
        .msgs-inner{max-width:760px;margin:0 auto;padding:0 28px;}

        .row-u{display:flex;justify-content:flex-end;align-items:flex-end;gap:10px;margin-bottom:22px;}
        .row-a{display:flex;align-items:flex-start;gap:14px;margin-bottom:26px;}

        .bub-u{
          background:linear-gradient(135deg,var(--navy),var(--sky2));
          color:white;border-radius:20px 20px 4px 20px;
          padding:13px 18px;max-width:72%;
          box-shadow:0 3px 16px rgba(3,105,161,.25);
          line-height:1.65;white-space:pre-wrap;
        }
        .bub-files{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;}
        .bub-file{background:rgba(255,255,255,.2);border-radius:6px;padding:3px 9px;font-size:11px;}

        .av-u{
          width:33px;height:33px;border-radius:50%;flex-shrink:0;
          background:linear-gradient(135deg,var(--navy),var(--sky));
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 10px rgba(3,105,161,.25);
        }
        .av-a{
          width:36px;height:36px;border-radius:11px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          box-shadow:var(--sh);margin-top:2px;
        }
        .ai-body{flex:1;min-width:0;}
        .ai-tag{font-size:10.5px;font-weight:700;letter-spacing:.04em;margin-bottom:6px;text-transform:uppercase;}

        /* Markdown */
        .md{color:var(--text2);line-height:1.8;}
        .mp{margin-bottom:12px;}.mp:last-child{margin-bottom:0;}
        .mh1{font-family:'Playfair Display',serif;font-size:1.55em;color:var(--text);margin:20px 0 10px;font-weight:800;}
        .mh2{font-family:'Playfair Display',serif;font-size:1.3em;color:var(--text);margin:18px 0 8px;font-weight:700;}
        .mh3{font-size:1.05em;font-weight:700;color:var(--text);margin:14px 0 6px;}
        .mul{padding-left:22px;margin:10px 0;}
        .mli{margin:5px 0;color:var(--text2);}
        .mbq{border-left:3px solid var(--sky);padding:6px 14px;margin:10px 0;color:var(--text3);background:var(--sky5);border-radius:0 8px 8px 0;font-style:italic;}
        .codeblock{margin:14px 0;border-radius:var(--r);overflow:hidden;border:1px solid var(--border);box-shadow:var(--sh);}
        .cb-hdr{display:flex;align-items:center;justify-content:space-between;background:var(--beige2);padding:8px 16px;border-bottom:1px solid var(--border);}
        .cb-lang{font-size:10px;font-weight:800;text-transform:uppercase;color:var(--navy);letter-spacing:.07em;}
        .cb-copy{background:none;border:1px solid var(--border2);border-radius:5px;padding:2px 10px;font-size:11px;color:var(--text3);cursor:pointer;font-family:inherit;transition:all .15s;}
        .cb-copy:hover{background:white;color:var(--text);}
        .codeblock pre{background:#0f1e30;padding:16px;overflow-x:auto;margin:0;}
        .codeblock code{font-family:'Fira Code','JetBrains Mono',monospace;font-size:13px;color:#7dd3fc;line-height:1.65;}
        .ic{background:var(--sky5);border:1px solid var(--sky4);border-radius:5px;padding:1px 7px;font-family:monospace;font-size:.88em;color:var(--navy);}

        /* Action bar */
        .actbar{display:flex;align-items:center;gap:4px;margin-top:12px;opacity:0;transition:opacity .2s;}
        .actbar.ab-vis{opacity:1;}
        .ab-btn{
          display:flex;align-items:center;gap:5px;background:none;
          border:1px solid var(--border);border-radius:8px;padding:4px 11px;
          font-size:12px;color:var(--text3);cursor:pointer;font-family:inherit;transition:all .15s;
        }
        .ab-btn:hover{border-color:var(--border2);color:var(--text2);background:var(--gray2);}
        .ab-btn.ab-ok{color:#16a34a;border-color:#bbf7d0;background:#f0fdf4;}
        .ab-btn.ab-up{color:var(--sky);border-color:var(--sky4);background:var(--sky5);}
        .ab-btn.ab-dn{color:#dc2626;border-color:#fecaca;background:#fff1f2;}
        .ab-sep{width:1px;height:15px;background:var(--border);margin:0 2px;}

        /* Thinking */
        .thinking{display:flex;align-items:center;gap:10px;padding:10px 0;}
        .th-emoji{font-size:18px;}
        .th-dots{display:flex;gap:5px;}
        .th-dots span{width:7px;height:7px;background:var(--sky);border-radius:50%;animation:tpulse 1.4s ease-in-out infinite;}
        .th-dots span:nth-child(2){animation-delay:.22s;}
        .th-dots span:nth-child(3){animation-delay:.44s;}
        @keyframes tpulse{0%,80%,100%{opacity:.3;transform:scale(.75);}40%{opacity:1;transform:scale(1);}}
        .th-label{font-size:12px;color:var(--text3);font-style:italic;font-weight:300;}

        /* ── MODEL PICKER ── */
        .mp-wrap{position:relative;}
        .mp-btn{
          display:flex;align-items:center;gap:8px;
          background:white;border:1.5px solid var(--border);border-radius:var(--r);
          padding:8px 14px;font-size:13px;font-weight:600;color:var(--text2);
          cursor:pointer;font-family:inherit;box-shadow:var(--sh);transition:all .15s;
        }
        .mp-btn:hover{border-color:var(--sky);color:var(--text);box-shadow:var(--sh2);}
        .mp-em{font-size:17px;}
        .mp-nick{font-weight:700;}
        .mp-badge{font-size:9px;font-weight:800;letter-spacing:.07em;padding:2px 7px;border-radius:5px;}
        .mp-drop{
          position:absolute;top:calc(100% + 7px);left:0;z-index:120;
          background:white;border:1.5px solid var(--border);border-radius:var(--rl);
          min-width:340px;box-shadow:var(--sh3);overflow:hidden;
          animation:mpOpen .16s ease;
        }
        @keyframes mpOpen{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:none;}}
        .mp-droph{padding:13px 18px 9px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--text4);border-bottom:1px solid var(--border);}
        .mp-opt{
          display:flex;align-items:center;gap:14px;padding:14px 18px;
          cursor:pointer;background:none;border:none;width:100%;text-align:left;
          font-family:inherit;transition:background .12s;
        }
        .mp-opt:hover{background:var(--sky5);}
        .mp-opt.mp-sel{background:var(--beige);}
        .mp-opt-em{font-size:26px;}
        .mp-opt-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px;}
        .mp-opt-desc{font-size:11.5px;color:var(--text3);}

        /* ── INPUT BAR ── */
        .ib-wrap{
          padding:14px 28px 18px;
          background:white;
          border-top:1.5px solid var(--border);
          max-width:760px;margin:0 auto;width:100%;
          box-shadow:0 -4px 24px rgba(14,30,50,.06);
        }
        .ib-top{display:flex;align-items:center;gap:10px;margin-bottom:11px;flex-wrap:wrap;}
        .style-row{display:flex;gap:5px;}
        .sp{background:none;border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:12px;color:var(--text3);cursor:pointer;font-family:inherit;transition:all .15s;}
        .sp:hover{border-color:var(--sky);color:var(--sky);}
        .sp.sp-on{border-color:var(--sky);color:var(--navy);background:var(--sky5);font-weight:700;}

        .conn-trigger{
          display:flex;align-items:center;gap:6px;margin-left:auto;
          background:white;border:1.5px solid var(--border);border-radius:var(--r);
          padding:7px 14px;font-size:12px;color:var(--text3);cursor:pointer;
          font-family:inherit;transition:all .15s;box-shadow:var(--sh);font-weight:600;
        }
        .conn-trigger:hover{border-color:var(--sky);color:var(--sky);}
        .conn-trigger.ct-on{border-color:var(--sky);color:var(--navy);background:var(--sky5);}
        .ct-badge{background:var(--navy);color:white;border-radius:10px;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;}

        .ib-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
        .ibc{display:flex;align-items:center;gap:5px;border:1px solid;border-radius:20px;padding:3px 11px;font-size:12px;font-weight:600;}
        .ibc-dot{font-size:8px;color:#22c55e;}

        .ib-files{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
        .fc{display:flex;align-items:center;gap:6px;background:var(--beige);border:1px solid var(--beige3);border-radius:8px;padding:5px 11px;font-size:12px;color:var(--text2);}
        .fc button{background:none;border:none;cursor:pointer;color:var(--text3);font-size:14px;padding:0;}

        .ib-box{
          background:var(--gray);border:1.5px solid var(--border);border-radius:var(--rl);
          transition:border-color .2s,box-shadow .2s;
          overflow:hidden;
        }
        .ib-box:focus-within{border-color:var(--sky);box-shadow:0 0 0 3px rgba(14,165,233,.12);}
        .ib-box.ib-listening{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.12);animation:pulse-border 1s ease-in-out infinite;}
        @keyframes pulse-border{0%,100%{box-shadow:0 0 0 3px rgba(239,68,68,.12);}50%{box-shadow:0 0 0 6px rgba(239,68,68,.06);}}

        .ib-ta{
          width:100%;background:none;border:none;outline:none;
          font-size:14px;color:var(--text);font-family:inherit;
          resize:none;padding:14px 14px 0;
          min-height:24px;max-height:190px;overflow-y:auto;line-height:1.65;
        }
        .ib-ta::placeholder{color:var(--text4);}
        .ib-ta::-webkit-scrollbar{width:3px;}

        .ib-btns{display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:10px 11px;}
        .ib-ib{
          width:33px;height:33px;background:none;border:1.5px solid var(--border);
          border-radius:10px;color:var(--text3);cursor:pointer;
          display:flex;align-items:center;justify-content:center;transition:all .15s;
        }
        .ib-ib:hover{border-color:var(--sky3);color:var(--sky);background:var(--sky5);}
        .ib-ib.ib-mic-on{border-color:#ef4444;color:#ef4444;background:#fff1f2;animation:mic-pulse 1s ease-in-out infinite;}
        @keyframes mic-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}

        .send{width:36px;height:36px;border-radius:11px;border:none;background:var(--gray3);color:var(--text4);cursor:not-allowed;display:flex;align-items:center;justify-content:center;transition:all .2s;}
        .send.send-on{background:linear-gradient(135deg,var(--navy),var(--sky));color:white;cursor:pointer;box-shadow:0 3px 12px rgba(3,105,161,.3);}
        .send.send-on:hover{background:linear-gradient(135deg,var(--navy2),var(--sky2));transform:scale(1.06);box-shadow:0 5px 18px rgba(3,105,161,.4);}

        .ib-disc{text-align:center;color:var(--text4);font-size:11px;margin-top:10px;font-weight:300;}

        /* ── BUTTONS ── */
        .ib{background:none;border:none;color:var(--text3);cursor:pointer;padding:5px;border-radius:7px;display:flex;align-items:center;justify-content:center;transition:all .15s;font-family:inherit;}
        .ib:hover{color:var(--text);background:var(--gray2);}
        .ib.mini{padding:3px;}
        .sb-tog{margin-left:auto;}

        /* ── CONNECTORS PANEL ── */
        .overlay{position:fixed;inset:0;z-index:200;background:rgba(14,30,50,.28);backdrop-filter:blur(5px);display:flex;justify-content:flex-end;align-items:stretch;}
        .side-panel{width:440px;background:white;height:100%;overflow-y:auto;box-shadow:var(--sh3);animation:spIn .26s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;}
        @keyframes spIn{from{transform:translateX(100%);}to{transform:none;}}
        .sp-head{display:flex;align-items:flex-start;justify-content:space-between;padding:26px 24px 16px;border-bottom:1px solid var(--border);}
        .sp-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:var(--text);}
        .sp-sub{font-size:13px;color:var(--text3);margin-top:3px;}
        .sp-active-bar{display:flex;gap:8px;flex-wrap:wrap;padding:14px 24px;border-bottom:1px solid var(--border);min-height:60px;align-items:center;}
        .sp-chip{border:1px solid;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;}
        .sp-none{color:var(--text4);font-size:13px;font-style:italic;}
        .sp-body{flex:1;overflow-y:auto;padding:16px 24px;}
        .sp-section{margin-bottom:24px;}
        .sp-cat{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text4);margin-bottom:10px;}
        .cc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}

        .conn-card{background:var(--gray2);border:1.5px solid var(--border);border-radius:var(--r);padding:16px;transition:all .2s;}
        .conn-card.cc-on{background:white;}
        .cc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
        .cc-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;}
        .cc-cat{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;color:var(--text4);}
        .conn-card.cc-on .cc-cat{font-weight:800;}
        .cc-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px;}
        .cc-desc{font-size:11px;color:var(--text3);line-height:1.5;}
        .cc-status{font-size:11px;font-weight:700;margin-top:8px;}

        .tog{width:40px;height:23px;background:var(--gray4);border-radius:12px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
        .tok{position:absolute;width:17px;height:17px;background:white;border-radius:50%;top:3px;left:3px;transition:left .2s;box-shadow:0 1px 5px rgba(0,0,0,.2);}
        .tog.tog-on .tok{left:20px;}

        /* ── MODAL ── */
        .overlay{position:fixed;inset:0;z-index:300;background:rgba(14,30,50,.35);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;}
        .modal{background:white;border-radius:var(--rl);width:500px;max-width:96vw;box-shadow:var(--sh3);animation:mIn .2s ease;overflow:hidden;}
        @keyframes mIn{from{opacity:0;transform:scale(.96) translateY(12px);}to{opacity:1;transform:none;}}
        .modal-head{display:flex;align-items:flex-start;justify-content:space-between;padding:24px 24px 16px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,white,var(--sky5));}
        .modal-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:var(--text);}
        .modal-sub{font-size:12px;color:var(--text3);margin-top:3px;}
        .modal-body{padding:22px 24px;}
        .modal-foot{display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid var(--border);background:var(--gray);}
        .x-btn{background:none;border:none;color:var(--text3);cursor:pointer;font-size:16px;padding:4px;border-radius:7px;transition:all .15s;}
        .x-btn:hover{background:var(--gray2);color:var(--text);}

        .fg{margin-bottom:18px;}
        .fl{font-size:11px;font-weight:800;color:var(--text2);display:block;margin-bottom:7px;text-transform:uppercase;letter-spacing:.05em;}
        .fi{width:100%;background:var(--gray2);border:1.5px solid var(--border);border-radius:var(--r);padding:11px 14px;font-size:13px;color:var(--text);font-family:inherit;outline:none;transition:border-color .2s;}
        .fi:focus{border-color:var(--sky);background:white;}
        .fh{font-size:11px;color:var(--text4);margin-top:5px;line-height:1.6;}

        .perms{background:var(--gray2);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;}
        .perm{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--text3);padding:3px 0;}
        .pcheck{color:#16a34a;font-weight:800;}

        .btn-pri{background:linear-gradient(135deg,var(--navy),var(--sky));color:white;border:none;border-radius:var(--r);padding:11px 22px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 12px rgba(3,105,161,.3);transition:all .2s;letter-spacing:.01em;}
        .btn-pri:hover{transform:translateY(-1px);box-shadow:0 5px 20px rgba(3,105,161,.4);}
        .btn-pri.loading{opacity:.75;cursor:wait;}
        .btn-pri.done{background:linear-gradient(135deg,#15803d,#22c55e);}
        .btn-sec{background:white;color:var(--text2);border:1.5px solid var(--border);border-radius:var(--r);padding:11px 22px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;}
        .btn-sec:hover{background:var(--gray2);border-color:var(--border2);}

        /* ERROR */
        .err-bar{max-width:760px;margin:0 auto 14px;background:#fff1f2;border:1.5px solid #fecaca;border-radius:var(--r);padding:11px 16px;color:#dc2626;font-size:13px;display:flex;align-items:center;gap:9px;}
        .err-bar button{margin-left:auto;background:none;border:none;color:#dc2626;cursor:pointer;font-size:16px;}
      `}</style>

      <div className="app">
        <Sidebar
          chats={chats}
          active={active}
          onSelect={setActive}
          onNew={()=>setActive(null)}
          onDelete={id=>{ setChats(p=>p.filter(c=>c.id!==id)); if(active===id) setActive(null); }}
          onRename={(id,t)=>setChats(p=>p.map(c=>c.id===id?{...c,title:t}:c))}
          collapsed={sbOff}
          onToggle={()=>setSbOff(v=>!v)}
        />

        <div className="main">
          {!cur||msgs.length===0 ? (
            <div className="welcome">
              <div className="wl-logo"><AskMeLogo size={80} textSize={38}/></div>
              <h1 className="wl-h1">Hello, I'm <em>Ask Me</em></h1>
              <p className="wl-sub">Your premium AI companion. Powered by world-class intelligence — ask anything, create anything, understand everything.</p>
              <div className="starters">
                {STARTERS.map((s,i)=>(
                  <button key={i} className="sc" onClick={()=>sendMsg(s.text,[])}>
                    <div className="sc-cat">{s.cat}</div>
                    <div className="sc-ico">{s.icon}</div>
                    <div className="sc-txt">{s.text}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="msgs-wrap">
              <div className="msgs-inner">
                {msgs.map((m,i)=>(
                  <Msg key={m.id} msg={m} isLast={i===msgs.length-1} onRegen={m.role==="assistant"&&!m.thinking?regen:null} modelId={model}/>
                ))}
                {err && (
                  <div className="err-bar">
                    ⚠️ {err}
                    <button onClick={()=>setErr(null)}>✕</button>
                  </div>
                )}
                <div ref={endRef}/>
              </div>
            </div>
          )}

          <InputBar
            onSend={sendMsg} busy={busy}
            model={model} onModel={setModel}
            style={style} onStyle={setStyle}
            connectors={connectors}
            onShowConn={()=>setShowConn(true)}
          />
        </div>
      </div>

      {showConn && (
        <ConnectorsPanel
          connectors={connectors}
          onToggle={toggleConn}
          onGitHub={()=>{ setShowConn(false); setShowGH(true); }}
          onClose={()=>setShowConn(false)}
        />
      )}
      {showGH && (
        <GithubModal
          onClose={()=>{ setShowGH(false); setShowConn(true); }}
          onConnect={info=>{ connectGH(info); setShowGH(false); }}
        />
      )}
    </>
  );

  function connectGH(info){ setConnectors(p=>p.map(c=>c.id==="github"?{...c,active:true,...info}:c)); }
}
