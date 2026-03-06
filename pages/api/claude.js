"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DEMO DATA
═══════════════════════════════════════════════════════════════════ */
const DEMO_SUMMARY = {
  chapterTitle: "Newton's Laws of Motion", subject: "Physical Sciences", grade: "Grade 11", curriculum: "CAPS",
  overview: "Newton's three laws of motion form the foundation of classical mechanics. They describe how objects behave when forces act upon them — from staying still, to accelerating, to interacting with other objects.",
  sections: [
    { id:"s1", title:"The Three Newton's Laws", type:"concepts", icon:"⚖️", concepts: [
      {term:"Newton's 1st Law",definition:"An object stays at rest or moves at constant velocity unless acted on by a net external force.",icon:"😴",color:"#e8f4fd",borderColor:"#93c5fd"},
      {term:"Newton's 2nd Law",definition:"Fnet = ma. The acceleration is directly proportional to net force and inversely proportional to mass.",icon:"🚀",color:"#fef3e2",borderColor:"#fcd34d"},
      {term:"Newton's 3rd Law",definition:"For every action there is an equal and opposite reaction acting on DIFFERENT objects.",icon:"🔄",color:"#f0fdf4",borderColor:"#86efac"},
      {term:"Inertia",definition:"The tendency of an object to resist changes in its state of motion. Proportional to mass.",icon:"🏋️",color:"#f5f0ff",borderColor:"#c4b5fd"},
      {term:"Net Force (Fnet)",definition:"Vector sum of ALL forces on an object. If Fnet = 0, object is in equilibrium.",icon:"➕",color:"#fff0f0",borderColor:"#fca5a5"},
      {term:"Equilibrium",definition:"Fnet = 0. Object is either stationary or moving at constant velocity.",icon:"⚖️",color:"#f0fdf4",borderColor:"#6ee7b7"},
    ]},
    { id:"s2", title:"Problem Solving Flowchart", type:"flowchart", icon:"🔢", flowchart: { nodes: [
      {id:"n1",text:"Read the problem carefully",type:"start",bgColor:"#0f0e0d",borderColor:"#0f0e0d",textColor:"#ffffff"},
      {id:"n2",text:"Draw a Free Body Diagram (FBD) — show ALL forces",type:"process",bgColor:"#e8f4fd",borderColor:"#3b82f6",textColor:"#1e3a5f"},
      {id:"n3",text:"Choose a positive direction",type:"process",bgColor:"#fef3e2",borderColor:"#f59e0b",textColor:"#78350f"},
      {id:"n4",text:"Apply Fnet = ma in chosen direction",type:"process",bgColor:"#fce3d6",borderColor:"#c8410a",textColor:"#7c2d12"},
      {id:"n5",text:"Solve for unknown — check units",type:"process",bgColor:"#f0fdf4",borderColor:"#22c55e",textColor:"#14532d"},
      {id:"n6",text:"Write final answer with unit and direction",type:"end",bgColor:"#2d6a4f",borderColor:"#2d6a4f",textColor:"#ffffff"},
    ], edges:[{from:"n1",to:"n2"},{from:"n2",to:"n3"},{from:"n3",to:"n4"},{from:"n4",to:"n5"},{from:"n5",to:"n6"}]}},
    { id:"s3", title:"Essential Formulas", type:"formulas", icon:"📐", formulas: [
      {name:"Newton's 2nd Law",expression:"Fnet = ma",note:"Fnet in N, m in kg, a in m/s²"},
      {name:"Weight",expression:"Fg = mg",note:"g = 9.8 m/s² (use 10 in exams unless told otherwise)"},
      {name:"Static Friction",expression:"fs(max) = μs · FN",note:"μs = coefficient of static friction"},
      {name:"Kinetic Friction",expression:"fk = μk · FN",note:"μk < μs always"},
      {name:"Normal (incline)",expression:"FN = mg·cosθ",note:"θ = angle of incline"},
    ]},
  ],
  examTips: [
    {type:"must",icon:"🚨",label:"MUST KNOW",text:"Always draw a Free Body Diagram before solving. CAPS exams explicitly award marks for a correctly labelled FBD."},
    {type:"common",icon:"⚠️",label:"COMMON MISTAKE",text:"Normal force ≠ weight on an incline. Always use FN = mg·cosθ."},
    {type:"marks",icon:"✅",label:"MARKS STRATEGY",text:"For 4+ mark questions: (1) state formula, (2) substitute, (3) calculate, (4) answer with unit."},
    {type:"remember",icon:"💡",label:"KEY REMEMBER",text:"Newton's 3rd Law pairs act on DIFFERENT objects — never the same object."},
  ],
  gradeExpectations: "Grade 11 CAPS Paper 1 allocates 30–40 marks to Mechanics. Newton's Laws questions carry 15–20 marks every year. You must draw FBDs, solve connected systems, calculate friction, and explain laws verbally with key terms."
};

const SAMPLE_PAPER = {
  paperTitle: "Grade 11 Physical Sciences — Paper 1", totalMarks:75, timeAllowed:90,
  instructions:"Answer ALL questions. Show all working. Calculators permitted.",
  questions:[
    {id:"Q1",number:"1",text:"Newton's Laws of Motion",marks:15,timeMinutes:18,type:"mixed",subQuestions:[
      {id:"Q1a",label:"a",text:"State Newton's Second Law of Motion in words.",marks:2,timeMinutes:3,type:"short",options:null},
      {id:"Q1b",label:"b",text:"A 5 kg block is pushed along a frictionless surface by a net force of 20 N. Calculate the acceleration.",marks:4,timeMinutes:5,type:"calculation",options:null},
      {id:"Q1c",label:"c",text:"Which best describes an inertial reference frame?",marks:2,timeMinutes:2,type:"mcq",options:["A. A frame that is accelerating uniformly","B. A frame moving at constant velocity or at rest","C. A frame rotating about a fixed axis","D. A frame attached to a falling object"]},
      {id:"Q1d",label:"d",text:"A 10 kg object rests on a surface. μs = 0.4. Calculate maximum static friction. (g = 10 m/s²)",marks:4,timeMinutes:5,type:"calculation",options:null},
      {id:"Q1e",label:"e",text:"Explain, using Newton's Third Law, what happens when a rocket expels gas downward.",marks:3,timeMinutes:4,type:"essay",options:null},
    ]},
    {id:"Q2",number:"2",text:"Waves, Sound and Light",marks:20,timeMinutes:24,type:"mixed",subQuestions:[
      {id:"Q2a",label:"a",text:"Define 'frequency' of a wave.",marks:2,timeMinutes:2,type:"short",options:null},
      {id:"Q2b",label:"b",text:"A sound wave travels at 340 m/s with wavelength 0.68 m. Calculate its frequency.",marks:3,timeMinutes:4,type:"calculation",options:null},
      {id:"Q2c",label:"c",text:"Which type of wave requires a medium to travel through?",marks:2,timeMinutes:2,type:"mcq",options:["A. Electromagnetic wave","B. Light wave","C. Mechanical wave","D. Radio wave"]},
      {id:"Q2d",label:"d",text:"Explain the Doppler effect and give ONE real-life example.",marks:4,timeMinutes:6,type:"essay",options:null},
    ]},
    {id:"Q3",number:"3",text:"Electricity and Magnetism",marks:20,timeMinutes:24,type:"mixed",subQuestions:[
      {id:"Q3a",label:"a",text:"State Ohm's Law.",marks:2,timeMinutes:2,type:"short",options:null},
      {id:"Q3b",label:"b",text:"A 10 Ω resistor connected to 12 V battery. Calculate the current.",marks:3,timeMinutes:4,type:"calculation",options:null},
      {id:"Q3c",label:"c",text:"Two resistors 4 Ω and 6 Ω in parallel. Find equivalent resistance.",marks:4,timeMinutes:5,type:"calculation",options:null},
    ]},
  ]
};

/* Grade profiles for tone adaptation */
const GRADE_PROFILES = {
  "Grade 1": { emoji:"🎈", color:"#ff6b9d", bg:"#fff0f6", tone:"super playful", ageGroup:"foundation" },
  "Grade 2": { emoji:"🌟", color:"#ff8c42", bg:"#fff5f0", tone:"super playful", ageGroup:"foundation" },
  "Grade 3": { emoji:"🦄", color:"#a855f7", bg:"#faf0ff", tone:"super playful", ageGroup:"foundation" },
  "Grade 4": { emoji:"🚀", color:"#3b82f6", bg:"#f0f6ff", tone:"playful", ageGroup:"intermediate" },
  "Grade 5": { emoji:"⚡", color:"#eab308", bg:"#fffbf0", tone:"playful", ageGroup:"intermediate" },
  "Grade 6": { emoji:"🎯", color:"#10b981", bg:"#f0fdf8", tone:"playful", ageGroup:"intermediate" },
  "Grade 7": { emoji:"🔥", color:"#f97316", bg:"#fff8f0", tone:"engaging", ageGroup:"senior" },
  "Grade 8": { emoji:"💡", color:"#6366f1", bg:"#f5f0ff", tone:"engaging", ageGroup:"senior" },
  "Grade 9": { emoji:"🧠", color:"#0d7377", bg:"#f0fafa", tone:"engaging", ageGroup:"senior" },
  "Grade 10": { emoji:"📐", color:"#c8410a", bg:"#fff8f5", tone:"academic", ageGroup:"senior" },
  "Grade 11": { emoji:"⚗️", color:"#1a5f8a", bg:"#f0f6ff", tone:"academic", ageGroup:"matric" },
  "Grade 12": { emoji:"🎓", color:"#2d6a4f", bg:"#f0fdf8", tone:"academic", ageGroup:"matric" },
};

/* Clean initial state — no demo data, user asks their own questions */
const DEMO_MESSAGES = [
  {
    id:1, role:"assistant", type:"text",
    content:`Hello! 👋 I'm **Lumi**, your AI tutor.\n\nAsk me anything — a concept you're struggling with, a calculation you need help with, or an exam question. You can also upload a photo or PDF of your question.\n\nWhat would you like to work on?`,
  }
];

/* ═══════════════════════════════════════════════════════════════════
   TUTOR SYSTEM PROMPTS
═══════════════════════════════════════════════════════════════════ */
function buildTutorSystem(grade, subject) {
  const profile = GRADE_PROFILES[grade] || GRADE_PROFILES["Grade 11"];
  const ageGroup = profile.ageGroup;

  const toneInstructions = {
    foundation: `You are a super fun, encouraging tutor for young learners (${grade}). 
- Use VERY simple words, short sentences. Maximum 2-3 sentences per idea.
- Use lots of emojis 🎉🌟✨ and exclamation marks!
- Relate EVERYTHING to things kids know: toys, animals, games, food, cartoons.
- Celebrate every attempt: "Wow, great try! 🌟"
- Use rhymes, songs, or stories to explain concepts.
- NEVER use technical jargon. Say "push" not "force", "how fast" not "velocity".
- Make learning feel like a game. Use "Level 1", "Achievement unlocked!" etc.`,

    intermediate: `You are an enthusiastic, relatable tutor for ${grade} learners.
- Use fun analogies from sports, games (Minecraft, FIFA), social media, food.
- Keep explanations short and punchy — use bullet points and numbered steps.
- Celebrate progress with energy: "Nailed it! 🔥"
- Use some emojis but not overwhelming.
- Introduce proper vocabulary BUT always explain it simply first.
- South African references: taxi rides, braai, soccer, load shedding.
- Challenge them: "Can you try the next one? I bet you've got this 💪"`,

    senior: `You are a cool, relatable tutor for ${grade} learners who want to really GET it.
- Use relevant South African examples (Eskom, taxis, Springboks, matric).
- Be direct and structured — students this age need clarity.
- Use step-by-step working for calculations, clearly numbered.
- Show the WHY behind every formula/concept.
- Use moderate emojis. Be encouraging but treat them as capable.
- Reference real exam patterns: "In a typical test, they'll ask you to..."
- Break down hard concepts with memorable analogies.`,

    academic: `You are a knowledgeable, exam-focused tutor for ${grade} CAPS learners.
- You know the CAPS curriculum inside out for this grade.
- Give structured, exam-ready explanations following CAPS marking guidelines.
- For calculations: always show (1) formula (2) substitution (3) calculation (4) answer with unit — exactly as CAPS expects.
- Reference exam patterns, mark allocations, and common examiner tricks.
- Use South African context where relevant (NSC exams, November papers).
- Be encouraging but academic in tone — these students are heading for matric.
- Point out where marks are typically lost and how to avoid it.
- Use minimal but purposeful emojis.`,

    matric: `You are a highly experienced, exam-focused tutor for ${grade} CAPS learners preparing for NSC.
- You understand exactly what NSC examiners expect for ${subject}.
- For every answer, structure it exactly as CAPS marking memos expect.
- Always note mark allocations: "This step = 1 mark ✓"
- Reference common NSC paper patterns and typical question types.
- Be direct, clear, and efficient — matric students need precision.
- Explain exactly WHERE marks are allocated and WHERE students lose marks.
- Use the language of CAPS: "resultant force", "state and apply", "hence or otherwise".
- Minimal emojis. Professional but warm tone.
- For Grade 12: reference supplementary and preparatory exams too.`
  };

  return `${toneInstructions[ageGroup]}

SUBJECT CONTEXT: You are tutoring ${subject} for ${grade} in South Africa following the CAPS curriculum.

KEY RULES:
1. NEVER just give the answer — guide the student to discover it with hints and questions.
2. If a student is wrong, DON'T say "wrong" — say "let's check that step" or "almost there".
3. Always end with a follow-up question or challenge to deepen understanding.
4. If an image or document is shared, analyze it carefully and address what you see.
5. Format your response with markdown: **bold** for key terms, use numbered lists for steps.
6. Keep responses focused — don't overwhelm. Teach one concept at a time.
7. Always include a "💡 Quick Tip:" or "🎯 Exam Tip:" relevant to CAPS at the end.

GRADE-SPECIFIC CONTENT for ${grade} ${subject}:
${grade === "Grade 11" && subject.includes("Sciences") ? `
- Newton's Laws (Fnet=ma, action-reaction pairs, friction)
- Momentum and impulse  
- Work, energy and power
- Waves, sound and light (Doppler, reflection, refraction)
- Electricity (Ohm's Law, series/parallel circuits)
- Electromagnetism
- Common CAPS marks: calculations 60%, definitions 15%, explanations 25%
` : `Tailor content to the ${grade} CAPS ${subject} curriculum.`}

When responding:
- Structure multi-step solutions clearly
- Use ✓ to mark correct steps (as CAPS memos do)
- Use → to show logical flow
- Box/highlight final answers: **Answer: [value] [unit]**`;
}

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Syne:wght@700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  /* === Youthful Neon-on-Dark Palette === */
  --bg:#080612;
  --surface:#100e22;
  --surface2:#17143a;
  --border:#252248;
  --border2:#3a3570;

  --ink:#f2eeff;
  --ink2:#a89fcc;
  --ink3:#5c5488;

  --violet:#7c4dff;
  --violet2:#9d75ff;
  --violet-glow:rgba(124,77,255,.22);
  --coral:#ff4f6d;
  --coral2:#ff8096;
  --coral-glow:rgba(255,79,109,.18);
  --mint:#00e5c3;
  --mint-glow:rgba(0,229,195,.16);
  --gold:#ffd166;
  --gold-glow:rgba(255,209,102,.16);
  --sky:#38bdf8;
  --sky-glow:rgba(56,189,248,.16);

  /* Legacy aliases so all existing class logic keeps working */
  --paper:var(--bg);
  --white:var(--surface);
  --cream:var(--surface2);
  --line:var(--border);
  --accent:var(--coral);
  --muted:var(--ink3);
  --success:var(--mint);
  --warn:var(--gold);
  --blue:var(--sky);
  --purple:var(--violet2);
  --teal:#00c9a7;
  --tutor:var(--violet2);
  --sidebar-w:228px;
}

/* ── Base ── */
html,body{
  height:100%;
  font-family:'Plus Jakarta Sans',sans-serif;
  background:var(--bg);
  color:var(--ink);
  overflow:hidden;
}

/* ── Animated radial mesh background ── */
body::before{
  content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 55% at 15% 5%,  rgba(124,77,255,.20) 0%, transparent 65%),
    radial-gradient(ellipse 55% 45% at 85% 95%,  rgba(255,79,109,.14) 0%, transparent 60%),
    radial-gradient(ellipse 45% 40% at 65% 45%,  rgba(0,229,195,.08) 0%, transparent 55%),
    radial-gradient(ellipse 60% 30% at 50% 100%, rgba(124,77,255,.10) 0%, transparent 70%);
}
/* Subtle animated shimmer */
body::after{
  content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,255,255,.012) 2px,
    rgba(255,255,255,.012) 4px
  );
}

/* ── Layout shell ── */
.app-shell{display:flex;height:100vh;overflow:hidden;position:relative;z-index:1}

/* ════════════════════════════
   SIDEBAR
════════════════════════════ */
.side-nav{
  width:var(--sidebar-w);flex-shrink:0;
  background:rgba(16,14,34,.94);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow:hidden;z-index:100;
  box-shadow:4px 0 48px rgba(0,0,0,.5);
}
.nav-brand{
  display:flex;align-items:center;gap:.7rem;
  padding:1.3rem 1.2rem 1.1rem;
  border-bottom:1px solid var(--border);
  background:linear-gradient(135deg,rgba(124,77,255,.14),rgba(255,79,109,.07));
}
.logo{
  font-family:'Syne',sans-serif;
  font-size:1.35rem;font-weight:800;letter-spacing:-.02em;color:var(--ink);
}
.logo span{
  background:linear-gradient(130deg,var(--violet2) 30%,var(--coral));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.logo-tag{
  font-size:.52rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  background:var(--violet-glow);color:var(--violet2);
  border:1px solid rgba(124,77,255,.38);padding:.15rem .45rem;border-radius:3px;
}
.nav-tabs{flex:1;overflow-y:auto;padding:.75rem .6rem;display:flex;flex-direction:column;gap:.12rem}
.nav-tab{
  display:flex;align-items:center;gap:.7rem;
  padding:.68rem .9rem;border-radius:9px;
  font-size:.82rem;font-weight:500;color:var(--ink2);
  cursor:pointer;border:none;background:transparent;
  transition:all .17s;text-align:left;width:100%;
  font-family:'Plus Jakarta Sans',sans-serif;
  border-left:2.5px solid transparent;position:relative;overflow:hidden;
}
.nav-tab::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,rgba(124,77,255,.1),transparent);
  opacity:0;transition:opacity .18s;
}
.nav-tab:hover::before{opacity:1}
.nav-tab:hover{color:var(--ink);transform:translateX(2px)}
.nav-tab.active-assessment{background:rgba(255,79,109,.11);color:var(--coral2);border-left-color:var(--coral);font-weight:700}
.nav-tab.active-learning{background:rgba(0,229,195,.09);color:var(--mint);border-left-color:var(--mint);font-weight:700}
.nav-tab.active-tutor{background:rgba(124,77,255,.13);color:var(--violet2);border-left-color:var(--violet);font-weight:700}
.nav-tab.active-library{background:rgba(255,209,102,.09);color:var(--gold);border-left-color:var(--gold);font-weight:700}
.nav-tab-icon{font-size:1rem;width:20px;text-align:center;flex-shrink:0}
.nav-tab-label{flex:1}
.nav-foot{padding:.9rem 1rem;border-top:1px solid var(--border)}
.demo-pill{
  font-size:.58rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  background:var(--violet-glow);color:var(--violet2);border:1px solid rgba(124,77,255,.35);
  padding:.28rem .7rem;border-radius:4px;display:block;text-align:center;
}

/* ── Main content ── */
.main-content{flex:1;overflow:hidden;display:flex;flex-direction:column;position:relative}

/* ════════════════════════════
   SHARED BUTTONS
════════════════════════════ */
.btn{
  font-family:'Plus Jakarta Sans',sans-serif;font-size:.82rem;font-weight:600;
  padding:.52rem 1.1rem;border-radius:8px;cursor:pointer;
  display:inline-flex;align-items:center;gap:.45rem;
  transition:all .16s;border:1px solid transparent;
}
.btn-primary{
  background:linear-gradient(135deg,var(--violet),#9b5fff);color:#fff;
  box-shadow:0 4px 20px rgba(124,77,255,.38);
}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 7px 28px rgba(124,77,255,.52)}
.btn-primary:disabled{background:var(--surface2);color:var(--ink3);box-shadow:none;transform:none;cursor:not-allowed}
.btn-ghost{background:transparent;color:var(--ink2);border-color:var(--border2)}
.btn-ghost:hover{background:var(--surface2);color:var(--ink)}

/* ════════════════════════════
   STUDY LIBRARY
════════════════════════════ */
.sl-lib{padding:2rem;max-width:1100px;margin:0 auto}
.sl-lib-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap}
.sl-lib-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--ink);letter-spacing:-.02em}
.sl-lib-sub{font-size:.85rem;color:var(--ink2);margin-top:.25rem;line-height:1.5}
.sl-lib-actions{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.role-switch{display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:6px;overflow:hidden;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase}
.rs-btn{padding:.32rem .75rem;border:none;background:transparent;cursor:pointer;color:var(--ink3);transition:all .13s;font-family:'Plus Jakarta Sans',sans-serif}
.rs-btn:hover{color:var(--ink)}
.rs-btn.active-su{background:var(--coral);color:#fff}
.rs-btn.active-st{background:var(--mint);color:#000}
.lib-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.75rem;margin-bottom:1.5rem}
.lib-stat{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.85rem 1rem;display:flex;align-items:center;gap:.7rem}
.lib-stat-ico{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.lib-stat-val{font-size:1.4rem;font-weight:700;color:var(--ink);line-height:1}
.lib-stat-lbl{font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-top:.12rem}
.lib-filters{display:flex;gap:.55rem;align-items:center;flex-wrap:wrap;background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:.65rem 1rem;margin-bottom:1.5rem}
.lf-label{font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);white-space:nowrap}
.lf-sep{width:1px;height:16px;background:var(--border);flex-shrink:0}
.lf-select,.lf-search{font-family:'Plus Jakarta Sans',sans-serif;font-size:.8rem;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--ink);padding:.32rem .65rem;outline:none;cursor:pointer;transition:border-color .13s}
.lf-select:focus,.lf-search:focus{border-color:var(--violet)}
.lf-search{cursor:text;width:160px}
.lf-search::placeholder{color:var(--border2)}
.view-toggle{display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin-left:auto}
.vt-btn{padding:.28rem .58rem;border:none;background:transparent;cursor:pointer;font-size:.9rem;color:var(--ink3);transition:all .13s}
.vt-btn.on{background:var(--violet);color:#fff}
.folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(228px,1fr));gap:1rem}
.folder-list-view{display:flex;flex-direction:column;gap:.55rem}
.folder-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;cursor:pointer;transition:all .2s;animation:lib-fade .25s ease both}
@keyframes lib-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.folder-card:hover{border-color:var(--violet);box-shadow:0 4px 28px rgba(124,77,255,.2);transform:translateY(-3px)}
.folder-card.fc-archived{opacity:.42}
.folder-card.fc-hidden{opacity:.58;border-style:dashed}
.fc-color-bar{height:3px}
.fc-body{padding:.95rem 1rem .7rem}
.fc-icon-row{display:flex;align-items:center;gap:.6rem;margin-bottom:.55rem}
.fc-folder-icon{font-size:1.6rem}
.fc-tags-inline{display:flex;gap:.3rem;flex-wrap:wrap}
.fc-name{font-weight:700;font-size:.92rem;color:var(--ink);margin-bottom:.35rem;line-height:1.35}
.fc-foot{border-top:1px solid var(--border);padding:.55rem 1rem;display:flex;align-items:center;justify-content:space-between;background:var(--surface2)}
.fc-file-count{font-size:.62rem;color:var(--ink3)}
.fc-su-actions{display:flex;gap:.28rem;opacity:0;transition:opacity .13s}
.folder-card:hover .fc-su-actions{opacity:1}
.fca-btn{width:24px;height:24px;border-radius:5px;border:1px solid var(--border);background:var(--surface2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.65rem;color:var(--ink3);transition:all .12s}
.fca-btn:hover{background:var(--surface);border-color:var(--border2);color:var(--ink)}
.fca-btn.del:hover{background:rgba(255,79,109,.15);border-color:var(--coral);color:var(--coral)}
.fca-btn.arc:hover{background:rgba(255,209,102,.12);border-color:var(--gold);color:var(--gold)}
.fca-btn.hid:hover{background:rgba(56,189,248,.12);border-color:var(--sky);color:var(--sky)}
.folder-row{background:var(--surface);border:1px solid var(--border);border-radius:9px;display:flex;align-items:center;gap:.9rem;padding:.7rem 1rem;cursor:pointer;transition:all .15s;animation:lib-fade .2s ease both}
.folder-row:hover{border-color:var(--violet);background:var(--surface2)}
.folder-row.fc-archived{opacity:.42}
.folder-row.fc-hidden{opacity:.58;border-style:dashed}
.fr-color-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.fr-name{font-weight:600;font-size:.88rem;color:var(--ink);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fr-tags{display:flex;gap:.3rem;flex-wrap:wrap}
.fr-count{font-size:.62rem;color:var(--ink3);white-space:nowrap;flex-shrink:0}
.fr-actions{display:flex;gap:.28rem;opacity:0;transition:opacity .13s;flex-shrink:0}
.folder-row:hover .fr-actions{opacity:1}
.lib-tag{font-size:.55rem;letter-spacing:.07em;text-transform:uppercase;padding:.1rem .38rem;border-radius:3px;border:1px solid;white-space:nowrap}
.lt-grade{background:rgba(56,189,248,.1);color:var(--sky);border-color:rgba(56,189,248,.28)}
.lt-caps{background:rgba(0,229,195,.1);color:var(--mint);border-color:rgba(0,229,195,.28)}
.lt-ieb{background:rgba(255,209,102,.1);color:var(--gold);border-color:rgba(255,209,102,.28)}
.lt-subj{background:rgba(124,77,255,.1);color:var(--violet2);border-color:rgba(124,77,255,.28)}
.lt-all{background:rgba(255,79,109,.1);color:var(--coral2);border-color:rgba(255,79,109,.28)}
.lt-archived{background:var(--surface2);color:var(--ink3);border-color:var(--border)}
.lt-hidden{background:rgba(56,189,248,.1);color:var(--sky);border-color:rgba(56,189,248,.28)}
.lib-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem;text-align:center;gap:.7rem;border:1px dashed var(--border2);border-radius:12px;background:var(--surface)}
.lib-empty-icon{font-size:2.5rem;opacity:.3}
.lib-empty-title{font-weight:700;font-size:.95rem;color:var(--ink)}
.lib-empty-sub{font-size:.82rem;color:var(--ink2);max-width:36ch;line-height:1.6}
.folder-detail{padding:2rem;max-width:1100px;margin:0 auto;animation:lib-fade .2s ease}
.fd-back-btn{display:inline-flex;align-items:center;gap:.45rem;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:.4rem .85rem;border:1px solid var(--border);border-radius:7px;background:transparent;cursor:pointer;color:var(--ink2);transition:all .13s;margin-bottom:1.35rem;font-family:'Plus Jakarta Sans',sans-serif}
.fd-back-btn:hover{border-color:var(--violet2);color:var(--violet2)}
.fd-header{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap}
.fd-folder-icon{font-size:2.2rem;margin-top:.1rem;flex-shrink:0}
.fd-info{flex:1;min-width:0}
.fd-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:.45rem}
.fd-tags{display:flex;gap:.4rem;flex-wrap:wrap}
.fd-actions{display:flex;gap:.55rem;flex-wrap:wrap}
.files-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.85rem}
.file-tile{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1rem;display:flex;flex-direction:column;gap:.45rem;cursor:pointer;transition:all .15s;position:relative;animation:lib-fade .22s ease both}
.file-tile:hover{border-color:var(--violet);transform:translateY(-2px);box-shadow:0 4px 20px rgba(124,77,255,.18)}
.ft-icon{font-size:2rem}
.ft-name{font-size:.8rem;font-weight:600;color:var(--ink);line-height:1.4;word-break:break-word}
.ft-size{font-size:.62rem;color:var(--ink3)}
.ft-del{position:absolute;top:.42rem;right:.42rem;width:20px;height:20px;border-radius:4px;border:1px solid var(--coral);background:rgba(255,79,109,.15);display:flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--coral);cursor:pointer;opacity:0;transition:opacity .12s}
.file-tile:hover .ft-del{opacity:1}
.lib-modal-overlay{position:fixed;inset:0;background:rgba(4,2,14,.78);backdrop-filter:blur(10px);z-index:400;display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:mo-in .14s ease}
@keyframes mo-in{from{opacity:0}to{opacity:1}}
.lib-modal{background:var(--surface);border:1px solid var(--border2);border-radius:14px;width:min(520px,100%);max-height:90vh;overflow-y:auto;box-shadow:0 28px 80px rgba(0,0,0,.7),0 0 0 1px rgba(124,77,255,.12);animation:mo-slide .18s ease}
@keyframes mo-slide{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}
.lib-modal.sm{width:min(380px,100%)}
.lm-header{padding:1.4rem 1.4rem 0;display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem}
.lm-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;color:var(--ink)}
.lm-sub{font-size:.78rem;color:var(--ink2);margin-top:.18rem}
.lm-close{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.75rem;color:var(--ink2);transition:all .12s;flex-shrink:0}
.lm-close:hover{background:rgba(255,79,109,.12);color:var(--coral);border-color:var(--coral)}
.lm-body{padding:1.25rem 1.4rem;display:flex;flex-direction:column;gap:.95rem}
.lm-footer{padding:0 1.4rem 1.4rem;display:flex;gap:.55rem;justify-content:flex-end}
.lm-fg{display:flex;flex-direction:column;gap:.38rem}
.lm-label{font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3)}
.lm-input,.lm-select{font-family:'Plus Jakarta Sans',sans-serif;font-size:.85rem;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--ink);padding:.58rem .85rem;outline:none;transition:border-color .13s;width:100%}
.lm-input:focus,.lm-select:focus{border-color:var(--violet)}
.lm-select option{background:var(--surface)}
.lm-row2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.curr-toggle{display:flex;gap:.45rem}
.ct-btn{flex:1;padding:.58rem;border:1.5px solid var(--border);border-radius:7px;background:transparent;cursor:pointer;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);text-align:center;transition:all .14s;font-family:'Plus Jakarta Sans',sans-serif}
.ct-btn:hover{border-color:var(--violet2);color:var(--ink)}
.ct-btn.caps.on{background:rgba(0,229,195,.1);border-color:var(--mint);color:var(--mint)}
.ct-btn.ieb.on{background:rgba(255,209,102,.1);border-color:var(--gold);color:var(--gold)}
.drop-zone{border:2px dashed var(--border2);border-radius:10px;padding:1.5rem;text-align:center;cursor:pointer;transition:all .14s;background:var(--surface2)}
.drop-zone:hover,.drop-zone.dz-drag{border-color:var(--violet);background:rgba(124,77,255,.06)}
.dz-ico{font-size:1.75rem;margin-bottom:.45rem}
.dz-text{font-size:.82rem;font-weight:500;color:var(--ink2)}
.dz-text strong{color:var(--ink)}
.dz-sub{font-size:.7rem;color:var(--border2);margin-top:.15rem}
.dz-file-list{display:flex;flex-direction:column;gap:.32rem;margin-top:.8rem}
.dz-file{display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:var(--ink2);padding:.35rem .6rem;background:var(--surface);border-radius:6px;border:1px solid var(--border)}
.prog-bar{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-top:.35rem}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--violet),var(--coral));border-radius:3px;transition:width .3s ease}
.confirm-body{padding:1.25rem 1.4rem}
.confirm-msg{font-size:.9rem;color:var(--ink2);line-height:1.6}

/* ════════════════════════════
   ASSESSMENT TAB
════════════════════════════ */
.intro-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100%;padding:2.5rem 1.5rem;text-align:center}
.intro-eyebrow{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--violet2);margin-bottom:.85rem;font-weight:600}
.intro-title{font-family:'Syne',sans-serif;font-size:2.6rem;font-weight:800;color:var(--ink);line-height:1.15;margin-bottom:.9rem;letter-spacing:-.025em}
.intro-title em{background:linear-gradient(130deg,var(--violet2),var(--coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.intro-sub{font-size:.97rem;color:var(--ink2);max-width:48ch;line-height:1.65;margin-bottom:2rem}
.paper-preview-card{background:var(--surface);border:1px solid var(--border2);border-radius:16px;width:min(560px,100%);overflow:hidden;box-shadow:0 10px 48px rgba(0,0,0,.45),0 0 0 1px rgba(124,77,255,.1)}
.ppc-top{background:linear-gradient(135deg,rgba(124,77,255,.22),rgba(255,79,109,.12));padding:1.5rem;border-bottom:1px solid var(--border)}
.ppc-label{font-size:.58rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--violet2);margin-bottom:.45rem}
.ppc-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:800;color:var(--ink);line-height:1.3;margin-bottom:.85rem}
.ppc-stats{display:flex;gap:.75rem;flex-wrap:wrap}
.ppc-stat{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:.55rem .9rem;text-align:center}
.ppc-stat strong{display:block;font-size:1.3rem;font-weight:800;color:var(--ink)}
.ppc-stat{font-size:.62rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3)}
.ppc-body{padding:1.25rem}
.ppc-qs{display:flex;flex-direction:column;gap:.45rem;margin-bottom:1rem}
.ppc-q{display:flex;align-items:center;gap:.65rem;padding:.55rem .75rem;background:var(--surface2);border-radius:9px;border:1px solid var(--border);font-size:.83rem;color:var(--ink2)}
.ppc-q-num{font-weight:800;color:var(--violet2);flex-shrink:0;font-size:.75rem;background:rgba(124,77,255,.16);padding:.12rem .4rem;border-radius:5px}
.ppc-q-marks{margin-left:auto;font-size:.65rem;color:var(--ink3);flex-shrink:0;white-space:nowrap}
.btn-begin{width:100%;padding:.9rem;background:linear-gradient(135deg,var(--violet),#9b5fff);color:#fff;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.95rem;font-weight:700;cursor:pointer;box-shadow:0 4px 28px rgba(124,77,255,.48);transition:all .18s;letter-spacing:.01em}
.btn-begin:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(124,77,255,.58)}
.sel-wrap{flex:1;overflow-y:auto;padding:1.5rem 1.5rem 0}
.sel-paper-meta{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem}
.spm-title{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:700;color:var(--ink);margin-bottom:.6rem}
.spm-row{display:flex;gap:.85rem;flex-wrap:wrap;margin-bottom:.6rem}
.spm-stat strong{color:var(--ink);font-weight:700}
.spm-stat{font-size:.82rem;color:var(--ink2)}
.spm-instructions{font-size:.82rem;color:var(--ink3);line-height:1.55;border-left:2.5px solid var(--violet);padding-left:.75rem}
.sec-label{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink3);margin-bottom:.75rem;padding:0 1.5rem}
.q-list{display:flex;flex-direction:column;gap:.6rem;padding:0 1.5rem}
.q-card{background:var(--surface);border:1.5px solid var(--border);border-radius:11px;cursor:pointer;transition:all .17s;overflow:hidden}
.q-card:hover{border-color:var(--border2)}
.q-card.sel{border-color:var(--violet);background:rgba(124,77,255,.07)}
.qc-head{display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem}
.qc-check{width:20px;height:20px;border-radius:5px;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:var(--violet2);transition:all .14s;flex-shrink:0;background:transparent}
.q-card.sel .qc-check{background:var(--violet);border-color:var(--violet);color:#fff}
.qc-num{font-weight:800;color:var(--violet2);font-size:.82rem;flex-shrink:0}
.qc-txt{flex:1;font-size:.88rem;color:var(--ink);font-weight:500}
.qc-badges{display:flex;gap:.35rem;align-items:center;flex-shrink:0}
.badge{font-size:.58rem;font-weight:700;padding:.1rem .38rem;border-radius:4px;border:1px solid;text-transform:uppercase;letter-spacing:.06em}
.badge.m{background:rgba(0,229,195,.1);color:var(--mint);border-color:rgba(0,229,195,.28)}
.badge.t{background:rgba(255,209,102,.1);color:var(--gold);border-color:rgba(255,209,102,.28)}
.subq-list{border-top:1px solid var(--border);padding:.65rem 1rem .8rem 3.2rem;display:flex;flex-direction:column;gap:.45rem;background:var(--surface2)}
.subq-row{display:flex;align-items:flex-start;gap:.55rem;font-size:.8rem;color:var(--ink2);line-height:1.5}
.subq-lbl{font-weight:700;color:var(--violet2);flex-shrink:0;min-width:1.2rem}
.type-pill{font-size:.55rem;font-weight:700;padding:.1rem .38rem;border-radius:4px;border:1px solid;text-transform:uppercase;letter-spacing:.06em}
.tp-mcq{background:rgba(56,189,248,.1);color:var(--sky);border-color:rgba(56,189,248,.28)}
.tp-calc{background:rgba(255,209,102,.1);color:var(--gold);border-color:rgba(255,209,102,.28)}
.tp-essay{background:rgba(124,77,255,.1);color:var(--violet2);border-color:rgba(124,77,255,.28)}
.tp-short{background:rgba(0,229,195,.1);color:var(--mint);border-color:rgba(0,229,195,.28)}
.sel-footer{display:flex;align-items:center;gap:.75rem;padding:1rem 1.5rem;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0}
.sf-info{font-size:.82rem;color:var(--ink2);flex:1}
.sf-info strong{color:var(--ink)}
.launch-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100%;padding:2.5rem;text-align:center;gap:.7rem}
.launch-ey{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mint);font-weight:600}
.launch-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:var(--ink)}
.launch-meta{font-size:.95rem;color:var(--ink2)}
.launch-meta strong{color:var(--violet2)}
.launch-detail{font-size:.82rem;color:var(--ink3)}
.btn-launch{margin-top:1rem;padding:1rem 2.5rem;background:linear-gradient(135deg,var(--mint),#00b8a0);color:#000;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:800;cursor:pointer;box-shadow:0 4px 28px rgba(0,229,195,.38);transition:all .18s}
.btn-launch:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(0,229,195,.52)}
.quiz-fs{display:flex;flex-direction:column;height:100%;background:var(--bg)}
.quiz-bar{display:flex;align-items:center;gap:1rem;padding:.75rem 1.5rem;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0}
.qb-timer{display:flex;align-items:center;gap:.45rem;font-size:.88rem;font-weight:700;color:var(--ink);background:var(--surface2);padding:.35rem .75rem;border-radius:8px;border:1px solid var(--border)}
.qb-timer.danger{background:rgba(255,79,109,.12);color:var(--coral);border-color:var(--coral)}
.qb-prog{flex:1;height:5px;background:var(--surface2);border-radius:3px;overflow:hidden}
.qb-prog-fill{height:100%;background:linear-gradient(90deg,var(--violet),var(--coral));border-radius:3px;transition:width .4s ease}
.qb-count{font-size:.78rem;color:var(--ink3)}
.qb-submit{font-size:.78rem;padding:.38rem .85rem;background:var(--coral);color:#fff;border:none;border-radius:7px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all .13s}
.qb-submit:hover{transform:translateY(-1px);filter:brightness(1.1)}
.q-body{flex:1;overflow-y:auto;padding:2rem}
.q-meta{display:flex;gap:.5rem;align-items:center;margin-bottom:.65rem;flex-wrap:wrap}
.q-parent{font-size:.72rem;color:var(--ink3);background:var(--surface2);padding:.18rem .5rem;border-radius:5px;border:1px solid var(--border)}
.q-text{font-size:1.05rem;color:var(--ink);line-height:1.7;margin-bottom:1.35rem;font-weight:500;max-width:72ch}
.mcq-opts{display:flex;flex-direction:column;gap:.55rem;margin-bottom:1.5rem;max-width:560px}
.mcq-opt{display:flex;align-items:flex-start;gap:.75rem;padding:.8rem 1rem;background:var(--surface2);border:1.5px solid var(--border);border-radius:11px;cursor:pointer;transition:all .14s;font-size:.9rem;color:var(--ink2)}
.mcq-opt.sel{background:rgba(124,77,255,.1);border-color:var(--violet);color:var(--ink)}
.mcq-opt:hover{border-color:var(--border2);color:var(--ink);background:var(--surface)}
.mcq-dot{width:18px;height:18px;border-radius:50%;border:1.5px solid var(--border2);flex-shrink:0;margin-top:.1rem;display:flex;align-items:center;justify-content:center;font-size:.65rem;transition:all .14s;font-weight:700;color:transparent}
.mcq-opt.sel .mcq-dot{border-color:var(--violet);background:var(--violet);color:#fff}
.txt-ans{width:100%;max-width:640px;min-height:130px;background:var(--surface2);border:1.5px solid var(--border);border-radius:11px;color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;padding:.9rem 1rem;outline:none;resize:vertical;transition:border-color .14s;line-height:1.6}
.txt-ans:focus{border-color:var(--violet)}
.txt-ans::placeholder{color:var(--border2)}
.char-count{font-size:.65rem;color:var(--ink3);margin-top:.35rem}
.q-nav{display:flex;align-items:center;gap:.75rem;padding:1rem 2rem;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0}
.qn-dots{display:flex;gap:.35rem;flex:1;flex-wrap:wrap}
.qn-dot{width:8px;height:8px;border-radius:50%;background:var(--border2);cursor:pointer;transition:all .14s}
.qn-dot.answered{background:var(--mint)}
.qn-dot.current{background:var(--violet);transform:scale(1.4);box-shadow:0 0 8px var(--violet-glow)}
.grading-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;min-height:100%;padding:2.5rem;text-align:center}
.spin{width:44px;height:44px;border:3px solid var(--border);border-top-color:var(--violet);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.grading-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;color:var(--ink)}
.grading-sub{font-size:.85rem;color:var(--ink2)}
.grading-bar{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;width:260px}
.grading-prog{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;width:260px}
.grading-prog-fill{height:100%;background:linear-gradient(90deg,var(--violet),var(--coral));border-radius:3px;transition:width .4s ease}
.results-wrap{flex:1;overflow-y:auto;padding:2rem}
.results-header{display:flex;align-items:flex-start;gap:1.75rem;margin-bottom:2rem;flex-wrap:wrap}
.rh-ring{flex-shrink:0}
.rh-info{flex:1;min-width:200px;padding-top:.5rem}
.rh-title{font-family:'Syne',sans-serif;font-size:1.55rem;font-weight:800;color:var(--ink);margin-bottom:.45rem}
.rh-stats{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:.85rem}
.rh-stat{font-size:.82rem;color:var(--ink2);background:var(--surface);border:1px solid var(--border);padding:.3rem .75rem;border-radius:7px}
.rh-stat strong{color:var(--ink)}
.rh-actions{display:flex;gap:.55rem;flex-wrap:wrap}
.results-list{display:flex;flex-direction:column;gap:.75rem}
.rc-card{background:var(--surface);border:1px solid var(--border);border-radius:11px;overflow:hidden;transition:all .15s}
.rc-card:hover{border-color:var(--border2)}
.rc-head{display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;cursor:pointer}
.rc-m{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800;flex-shrink:0}
.rc-m.pass{background:rgba(0,229,195,.1);color:var(--mint);border:1.5px solid rgba(0,229,195,.28)}
.rc-m.fail{background:rgba(255,79,109,.1);color:var(--coral);border:1.5px solid rgba(255,79,109,.28)}
.rc-q{flex:1;font-size:.88rem;color:var(--ink2);line-height:1.4;min-width:0}
.rc-q strong{display:block;color:var(--ink);margin-bottom:.12rem;font-size:.9rem}
.rc-chevron{font-size:.75rem;color:var(--ink3);transition:transform .2s}
.rc-detail{padding:.85rem 1rem 1rem;border-top:1px solid var(--border);background:var(--surface2)}
.rc-answer{font-size:.83rem;color:var(--ink2);margin-bottom:.65rem;line-height:1.55}
.rc-answer strong{color:var(--ink)}
.rc-feedback{font-size:.83rem;color:var(--ink2);line-height:1.6;padding:.75rem;background:rgba(0,229,195,.06);border:1px solid rgba(0,229,195,.15);border-radius:9px;border-left:3px solid var(--mint)}

/* ════════════════════════════
   SMART LEARNING
════════════════════════════ */
.sl-coming{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;min-height:100%;padding:3rem;text-align:center}
.sl-coming-icon{font-size:3.5rem}
.sl-coming-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:900;color:var(--ink)}
.sl-coming-sub{color:var(--ink2);max-width:40ch;line-height:1.7}

/* ════════════════════════════
   TUTOR TAB
════════════════════════════ */
.tutor-shell{display:flex;height:100%;overflow:hidden}
.tutor-sidebar{width:220px;flex-shrink:0;border-right:1px solid var(--border);background:var(--surface);display:flex;flex-direction:column;overflow:hidden}
.sp-label{font-size:.58rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--ink3);margin-bottom:.55rem;padding:.85rem 1rem .35rem}
.grade-list{padding:0 .55rem .5rem;display:flex;flex-direction:column;gap:.1rem;overflow-y:auto;max-height:180px}
.grade-btn{font-family:'Plus Jakarta Sans',sans-serif;font-size:.78rem;padding:.38rem .65rem;border:none;background:transparent;cursor:pointer;color:var(--ink2);border-radius:7px;text-align:left;transition:all .13s;border-left:2px solid transparent}
.grade-btn:hover{background:var(--surface2);color:var(--ink)}
.grade-btn.active{background:rgba(124,77,255,.1);color:var(--violet2);border-left-color:var(--violet);font-weight:600}
.subj-list{padding:0 .55rem .5rem;display:flex;flex-direction:column;gap:.1rem}
.subj-btn{font-family:'Plus Jakarta Sans',sans-serif;font-size:.78rem;padding:.38rem .65rem;border:none;background:transparent;cursor:pointer;color:var(--ink2);border-radius:7px;text-align:left;transition:all .13s;border-left:2px solid transparent}
.subj-btn:hover{background:var(--surface2);color:var(--ink)}
.subj-btn.active{background:rgba(124,77,255,.1);color:var(--violet2);border-left-color:var(--violet);font-weight:600}
.personality-card{margin:.55rem .7rem;border-radius:9px;overflow:hidden}
.pc-inner{padding:.65rem .85rem;border-radius:9px}
.pc-name{font-size:.85rem;font-weight:700}
.pc-desc{font-size:.7rem;line-height:1.4;margin-top:.15rem}
.demo-section{padding:.5rem .7rem .7rem;border-top:1px solid var(--border);margin-top:auto}
.ds-label{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);margin-bottom:.45rem;padding:.55rem 0 0}
.demo-q{font-size:.73rem;color:var(--ink2);padding:.4rem .6rem;border-radius:7px;cursor:pointer;transition:all .13s;line-height:1.4;border:1px solid transparent}
.demo-q:hover{background:var(--surface2);border-color:var(--border);color:var(--ink)}
.demo-q-num{font-size:.58rem;font-weight:700;color:var(--violet2);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.15rem}
.tutor-chat{flex:1;display:flex;flex-direction:column;overflow:hidden}
.chat-header{display:flex;align-items:center;gap:.75rem;padding:.85rem 1.25rem;border-bottom:1px solid var(--border);background:var(--surface);flex-shrink:0}
.lumi-avatar{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,var(--violet),var(--coral));display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;box-shadow:0 3px 16px rgba(124,77,255,.45)}
.chat-header-info{flex:1}
.ch-name{font-weight:700;font-size:.9rem;color:var(--ink)}
.ch-status{display:flex;align-items:center;gap:.4rem;font-size:.7rem;color:var(--ink3)}
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--mint);box-shadow:0 0 7px var(--mint);animation:pulse-dot 2s ease-in-out infinite}
@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.35}}
.ch-grade{font-size:.75rem;font-weight:600;padding:.25rem .6rem;border-radius:7px;background:rgba(124,77,255,.13);color:var(--violet2);border:1px solid rgba(124,77,255,.28)}
.ch-clear{font-family:'Plus Jakarta Sans',sans-serif;font-size:.72rem;font-weight:600;padding:.28rem .65rem;border:1px solid var(--border2);border-radius:7px;background:transparent;cursor:pointer;color:var(--ink3);transition:all .13s}
.ch-clear:hover{border-color:var(--violet2);color:var(--violet2)}
.chat-messages{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:.9rem;background:var(--bg)}
.msg-row{display:flex;gap:.75rem;align-items:flex-start}
.msg-row.user{flex-direction:row-reverse}
.msg-avatar{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;flex-shrink:0}
.msg-avatar.ai{background:linear-gradient(135deg,var(--violet),var(--coral));color:#fff;box-shadow:0 2px 12px rgba(124,77,255,.38)}
.msg-avatar.user{background:var(--surface2);color:var(--ink2);border:1px solid var(--border)}
.msg-bubble{display:flex;flex-direction:column;gap:.3rem;max-width:78%}
.bubble{padding:.85rem 1.05rem;border-radius:14px;font-size:.9rem;line-height:1.7}
.bubble.ai{background:var(--surface);border:1px solid var(--border);color:var(--ink);border-radius:4px 14px 14px 14px}
.bubble.user{background:linear-gradient(135deg,var(--violet),#8b5cf6);color:#fff;border-radius:14px 4px 14px 14px;box-shadow:0 3px 18px rgba(124,77,255,.32)}
.bubble.ai p{margin:.4rem 0}.bubble.ai p:first-child{margin-top:0}.bubble.ai p:last-child{margin-bottom:0}
.bubble.ai strong{color:var(--violet2)}
.bubble.ai em{color:var(--mint)}
.bubble.ai ul,.bubble.ai ol{padding-left:1.2rem;margin:.4rem 0}
.bubble.ai li{margin:.2rem 0}
.bubble.ai code{background:var(--surface2);padding:.1rem .3rem;border-radius:4px;font-size:.82em;color:var(--coral2)}
.tip-box,.exam-box{background:rgba(0,229,195,.06);border:1px solid rgba(0,229,195,.18);border-left:3px solid var(--mint);border-radius:0 9px 9px 0;padding:.55rem .75rem;margin:.5rem 0;font-size:.85rem}
.exam-box{background:rgba(255,79,109,.06);border-color:rgba(255,79,109,.18);border-left-color:var(--coral)}
.msg-time{font-size:.62rem;color:var(--ink3);padding:0 .2rem}
.msg-row.user .msg-time{text-align:right}
.suggestions{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.7rem}
.sug-btn{display:inline-block;padding:.32rem .78rem;background:rgba(124,77,255,.1);border:1px solid rgba(124,77,255,.28);border-radius:20px;font-size:.76rem;color:var(--violet2);cursor:pointer;transition:all .15s}
.sug-btn:hover{background:rgba(124,77,255,.22);border-color:var(--violet2);color:var(--ink)}
.img-attachment{margin-top:.6rem;border-radius:9px;overflow:hidden;max-width:300px;border:1px solid var(--border)}
.file-attachment{display:flex;align-items:center;gap:.5rem;padding:.45rem .7rem;background:rgba(124,77,255,.1);border:1px solid rgba(124,77,255,.25);border-radius:8px;font-size:.8rem;color:var(--violet2);margin-top:.5rem}
.fa-icon{font-size:1rem}
.voice-bubble{display:flex;align-items:center;gap:.6rem;padding:.4rem 0;margin-top:.35rem}
.voice-play{width:28px;height:28px;border-radius:50%;background:var(--violet);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.65rem;flex-shrink:0}
.voice-wave{display:flex;align-items:center;gap:2px;height:24px}
.wv{width:3px;border-radius:2px;background:rgba(255,255,255,.5);animation:wv-pulse 1.2s ease-in-out infinite}
@keyframes wv-pulse{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
.voice-dur{font-size:.72rem;color:rgba(255,255,255,.65)}
.typing-indicator{display:flex;gap:5px;align-items:center;padding:.85rem 1.05rem;background:var(--surface);border:1px solid var(--border);border-radius:4px 14px 14px 14px}
.typing-dot{width:8px;height:8px;border-radius:50%;background:var(--violet2);animation:typing .9s ease-in-out infinite}
.typing-dot:nth-child(2){animation-delay:.2s}.typing-dot:nth-child(3){animation-delay:.4s}
@keyframes typing{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-7px);opacity:1}}
.chat-input-area{padding:.85rem 1.25rem 1rem;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0}
.input-attachments{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.5rem}
.att-chip{display:flex;align-items:center;gap:.4rem;padding:.25rem .6rem;background:rgba(124,77,255,.1);border:1px solid rgba(124,77,255,.25);border-radius:6px;font-size:.75rem;color:var(--violet2)}
.att-chip button{background:none;border:none;cursor:pointer;color:var(--violet2);font-size:.75rem;transition:color .12s}
.att-chip button:hover{color:var(--coral)}
.input-row{display:flex;align-items:flex-end;gap:.55rem;background:var(--surface2);border:1.5px solid var(--border2);border-radius:13px;padding:.5rem .6rem .5rem .9rem;transition:border-color .15s}
.input-row:focus-within{border-color:var(--violet);box-shadow:0 0 0 3px var(--violet-glow)}
.chat-textarea{flex:1;background:transparent;border:none;outline:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;color:var(--ink);resize:none;max-height:120px;line-height:1.6;padding:.15rem 0}
.chat-textarea::placeholder{color:var(--border2)}
.input-actions{display:flex;align-items:center;gap:.3rem}
.ia-btn{width:30px;height:30px;border-radius:7px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.95rem;color:var(--ink3);transition:all .13s}
.ia-btn:hover{background:var(--surface);color:var(--ink);transform:scale(1.1)}
.ia-btn.recording{background:rgba(255,79,109,.15);color:var(--coral);animation:rec-pulse 1s ease-in-out infinite}
@keyframes rec-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,79,109,.3)}50%{box-shadow:0 0 0 7px rgba(255,79,109,0)}}
.send-btn{width:34px;height:34px;border-radius:9px;border:none;background:linear-gradient(135deg,var(--violet),#8b5cf6);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:all .15s;flex-shrink:0;box-shadow:0 2px 12px rgba(124,77,255,.4)}
.send-btn:hover{transform:translateY(-1px);box-shadow:0 5px 20px rgba(124,77,255,.55)}
.send-btn:disabled{background:var(--surface2);color:var(--border2);box-shadow:none;transform:none;cursor:not-allowed}
.input-hints{display:flex;gap:.85rem;margin-top:.45rem;flex-wrap:wrap}
.ih-hint{font-size:.65rem;color:var(--ink3)}
.rec-overlay{position:absolute;inset:0;background:rgba(4,2,16,.92);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.85rem;z-index:50}
.rec-title{font-family:'Syne',sans-serif;font-size:1.25rem;font-weight:700;color:var(--ink)}
.rec-time{font-size:2rem;font-weight:800;color:var(--coral);font-family:'Syne',sans-serif}
.rec-mic{font-size:2.5rem;animation:rec-pulse 1s ease-in-out infinite}
.rec-actions{display:flex;gap:.75rem;margin-top:.5rem}
.rec-stop{padding:.65rem 1.5rem;background:var(--coral);color:#fff;border:none;border-radius:9px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .14s}
.rec-stop:hover{transform:translateY(-1px);filter:brightness(1.1)}
.rec-cancel{padding:.65rem 1.5rem;background:transparent;color:var(--ink2);border:1px solid var(--border2);border-radius:9px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;cursor:pointer;transition:all .14s}
.rec-cancel:hover{border-color:var(--ink2);color:var(--ink)}
@media(max-width:680px){.tutor-sidebar{display:none}.tutor-shell{flex-direction:column}}
`

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
function fmt(s){const m=Math.floor(s/60),sec=s%60;return`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`}
function typePill(type){const map={mcq:["tp-mcq","MCQ"],calculation:["tp-calc","Calc"],essay:["tp-essay","Essay"],short:["tp-short","Short"],mixed:["tp-short","Mixed"]};const[cls,label]=map[type]||["tp-short",type];return<span className={`type-pill ${cls}`}>{label}</span>}

function parseMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ol>${m}</ol>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/💡 Quick Tip:(.+)/g, '<div class="tip-box">💡 <strong>Quick Tip:</strong>$1</div>')
    .replace(/🎯 Exam Tip:(.+)/g, '<div class="exam-box">🎯 <strong>Exam Tip:</strong>$1</div>')
    .replace(/✓ Step \d+/g, m => `<span style="color:var(--success);font-weight:700">${m}</span>`);
}

async function callClaude(systemPrompt, messages, maxTokens = 1000) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: maxTokens,
      system: systemPrompt,
      messages
    })
  });
  const d = await res.json();
  // Surface API errors clearly instead of returning an empty string
  if (!res.ok || d.error) {
    throw new Error(d.error || `API error ${res.status}`);
  }
  const text = d.content?.map(b => b.type === "text" ? b.text : "").join("") || "";
  if (!text) throw new Error("Empty response from AI — please try again.");
  return text;
}

async function gradeAnswer(q, ans, marks) {
  if (!ans?.trim()) return { score: 0, max: marks || 1, feedback: "No answer provided.", correct: false };
  try {
    const raw = await callClaude(
      `Grade this Grade 11 Physics answer. Return ONLY JSON: {"score":number,"max":number,"feedback":"1-2 sentences","correct":boolean}. Max marks: ${marks || 1}.`,
      [{ role: "user", content: `Q: ${q}\nA: ${ans}` }], 400
    );
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch { return { score: 0, max: marks || 1, feedback: "Grading error.", correct: false }; }
}

/* ═══════════════════════════════════════════════════════════════════
   BUBBLE RENDERER
═══════════════════════════════════════════════════════════════════ */
function MessageBubble({ msg, gradeProfile }) {
  const isUser = msg.role === "user";
  const html = !isUser ? parseMarkdown(msg.content || "") : null;

  // Inline styles on AI bubble guarantee visibility regardless of CSS var resolution
  const aiBubbleStyle = {
    background: "#100e22",
    border: "1px solid #3a3570",
    color: "#f2eeff",
    borderRadius: "4px 14px 14px 14px",
    padding: ".85rem 1.05rem",
    fontSize: ".9rem",
    lineHeight: "1.7",
    minHeight: "2rem",
    wordBreak: "break-word",
  };

  return (
    <div className={`msg-row ${isUser ? "user" : ""}`}>
      <div className={`msg-avatar ${isUser ? "user" : "ai"}`}>
        {isUser ? "U" : "✨"}
      </div>
      <div className="msg-bubble">
        <div className={`bubble ${isUser ? "user" : "ai"}`}
          style={!isUser ? aiBubbleStyle : {}}>
          {isUser ? (
            <>
              <span>{msg.content}</span>
              {msg.imageUrl && (
                <div className="img-attachment">
                  <img src={msg.imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
                </div>
              )}
              {msg.fileName && !msg.imageUrl && (
                <div className="file-attachment">
                  <span className="fa-icon">📄</span>
                  <span>{msg.fileName}</span>
                </div>
              )}
              {msg.isVoice && (
                <div className="voice-bubble">
                  <button className="voice-play">▶</button>
                  <div className="voice-wave">
                    {Array.from({ length: 18 }, (_, i) => (
                      <div key={i} className="wv" style={{
                        height: `${8 + Math.sin(i * 0.8) * 8 + Math.random() * 6}px`,
                        animationDelay: `${i * 0.08}s`
                      }} />
                    ))}
                  </div>
                  <span className="voice-dur">{msg.voiceDuration || "0:05"}</span>
                </div>
              )}
            </>
          ) : (
            msg.content
              ? <div dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />
              : <span style={{color:"#ff8096",fontStyle:"italic"}}>⚠️ No response received — check that ANTHROPIC_API_KEY is set in Vercel and redeploy.</span>
          )}

        </div>
        <div className="msg-time">{msg.time || ""}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TUTOR TAB
═══════════════════════════════════════════════════════════════════ */
const SUBJECTS = ["Physical Sciences", "Mathematics", "Life Sciences", "Accounting", "History", "Geography", "English"];
const GRADES = Object.keys(GRADE_PROFILES);



function TutorTab() {
  const [grade, setGrade] = useState("Grade 11");
  const [subject, setSubject] = useState("Physical Sciences");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recTimerRef = useRef(null);
  const textareaRef = useRef(null);
  const profile = GRADE_PROFILES[grade] || GRADE_PROFILES["Grade 11"];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  // Handle suggestion clicks via event delegation
  useEffect(() => {
    const handler = (e) => {
      const btn = e.target.closest(".sug-btn");
      if (btn) sendMessage(btn.dataset.suggestion);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [grade, subject, messages, attachments]);

  function nowTime() {
    return new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  }

  async function sendMessage(text, extraData = {}) {
    const content = text || input.trim();
    const att = attachments[0] || null;
    if (!content && !att && !extraData.isVoice) return;

    const userMsg = {
      id: Date.now(), role: "user", type: "text",
      content: content || (extraData.isVoice ? "[Voice message]" : att ? "" : "[Message]"),
      time: nowTime(),
      ...extraData,
      ...(att || {}),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setLoading(true);

    // Build conversation history — preserve vision blocks for images
    const systemPrompt = buildTutorSystem(grade, subject);
    const contextSuffix = `\n\n[Context: ${grade} · ${subject} · South Africa CAPS curriculum]`;

    // Convert stored messages to API format, keeping multipart content intact
    const history = [...messages, userMsg]
      .filter(m => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m, idx, arr) => {
        if (m.role === "assistant") return { role: "assistant", content: m.content };

        // Build multipart content for user messages
        const parts = [];

        // Text part
        const textContent = (m.content || "").trim();
        const isLast = idx === arr.length - 1;
        const suffix = isLast ? contextSuffix : "";

        if (m.imageBase64) {
          // Real vision: send the image as a base64 image block
          if (textContent) parts.push({ type: "text", text: textContent + suffix });
          else parts.push({ type: "text", text: (m.imagePrompt || "Please look at this image and help me with it.") + suffix });
          parts.push({
            type: "image",
            source: {
              type: "base64",
              media_type: m.imageMime || "image/jpeg",
              data: m.imageBase64,
            }
          });
        } else if (m.pdfText) {
          // PDF: inject extracted text so Claude can read it
          const pdfBlock = `\n\n--- UPLOADED DOCUMENT: "${m.fileName}" ---\n${m.pdfText.slice(0, 6000)}\n--- END DOCUMENT ---`;
          parts.push({ type: "text", text: (textContent || "Please help me with this document.") + pdfBlock + suffix });
        } else {
          // Plain text (including voice)
          const voiceNote = m.isVoice ? " [voice question]" : "";
          parts.push({ type: "text", text: (textContent || "[No text]") + voiceNote + suffix });
        }

        return { role: "user", content: parts.length === 1 ? parts[0].text : parts };
      });

    try {
      const response = await callClaude(systemPrompt, history, 1200);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "assistant", type: "text",
        content: response || "⚠️ Empty response — please try again.",
        time: nowTime()
      }]);
    } catch (e) {
      console.error("[sendMessage] error:", e.message);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "assistant", type: "text",
        content: `⚠️ ${e.message || "Connection error — please try again."}`,
        time: nowTime()
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  async function handleFileUpload(e, type) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (type === "image") {
      // Read as base64 for Claude vision
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result; // e.g. "data:image/jpeg;base64,/9j/..."
        const [header, b64] = dataUrl.split(",");
        const mimeMatch = header.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        setAttachments([{
          imageUrl: dataUrl,       // for preview in bubble
          imageBase64: b64,        // raw base64 for Claude API
          imageMime: mime,
          imagePrompt: input.trim() || "",
          fileName: file.name,
          type: "image",
        }]);
      };
      reader.readAsDataURL(file);
    } else {
      // PDF — extract text using PDF.js loaded from CDN
      setAttachments([{ fileName: file.name, fileType: "pdf", pdfLoading: true }]);
      try {
        // Load PDF.js from CDN if not already loaded
        if (!window.pdfjsLib) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 10); // cap at 10 pages
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          fullText += tc.items.map(item => item.str).join(" ") + "\n";
        }
        setAttachments([{
          fileName: file.name,
          fileType: "pdf",
          pdfText: fullText.trim() || "[Could not extract text from this PDF — it may be a scanned image]",
          pageCount: pdf.numPages,
        }]);
      } catch (err) {
        setAttachments([{
          fileName: file.name,
          fileType: "pdf",
          pdfText: "[PDF text extraction failed — ask your question and describe the document]",
        }]);
      }
    }
  }

  function startRecording() {
    setRecording(true);
    setRecTime(0);
    recTimerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
  }

  function stopRecording() {
    clearInterval(recTimerRef.current);
    const dur = `0:${String(recTime).padStart(2, "0")}`;
    setRecording(false);
    sendMessage("", { isVoice: true, voiceDuration: dur, content: "[Voice message — transcribing…]" });
    setRecTime(0);
  }

  function cancelRecording() {
    clearInterval(recTimerRef.current);
    setRecording(false);
    setRecTime(0);
  }

  function handleGradeChange(g) {
    setGrade(g);
    const p = GRADE_PROFILES[g];
    const greetings = {
      foundation: `Hey! 🎉 I'm **Lumi**, your super fun learning buddy! I'm now set up for **${g}**! What are we learning today? 🌟`,
      intermediate: `What's up! 🔥 I'm **Lumi** — your go-to tutor for **${g}**! Drop your question and let's crush it together! ⚡`,
      senior: `Hey there! 💡 I'm **Lumi**, your AI tutor — now calibrated for **${g}**. What are we working on? Let's get it! 🧠`,
      academic: `Good day! ⚗️ I'm **Lumi** — your AI tutor calibrated for **${g} CAPS**. Ready to work through concepts and exam prep. What's the question?`,
      matric: `Hello! 🎓 I'm **Lumi** — focused on **${g} NSC exam prep**. Time is precious — let's work efficiently. What do you need help with?`
    };
    setMessages([{
      id: Date.now(), role: "assistant", type: "text",
      content: greetings[p.ageGroup] || greetings.academic,
      time: nowTime(),

    }]);
  }

  const toneDescriptions = {
    foundation: "Super playful 🎈 Uses stories, games & rhymes. Relates to toys & animals.",
    intermediate: "Fun & energetic ⚡ South African examples. Sports, games, food analogies.",
    senior: "Engaging & clear 🔥 Real-world SA context. Step-by-step with WHY.",
    academic: "Exam-focused 📐 CAPS-aligned structure. Mark allocation guidance.",
    matric: "NSC precision 🎓 Marking memo style. Marks noted per step."
  };

  return (
    <>
      {recording && (
        <div className="rec-overlay">
          <div className="rec-ring">🎙️</div>
          <div className="rec-title">Recording…</div>
          <div className="rec-time">0:{String(recTime).padStart(2, "0")}</div>
          <div className="rec-sub">Speak your question clearly</div>
          <button className="rec-stop" onClick={stopRecording}>⬛ Stop & Send</button>
          <button className="rec-cancel" onClick={cancelRecording}>Cancel</button>
        </div>
      )}

      <div className="tutor-shell">
        {/* SIDEBAR */}
        <div className="tutor-sidebar">
          <div className="ts-header">
            <div className="ts-label">AI Tutor</div>
            <div className="ts-title">Lumi ✨</div>
            <div className="ts-sub">Grade-aware CAPS tutor. Adjusts tone & depth to your level.</div>
          </div>

          {/* Grade picker */}
          <div className="grade-picker">
            <div className="gp-label">Select Grade</div>
            <div className="grade-grid">
              {GRADES.map(g => (
                <button key={g} className={`grade-btn ${grade === g ? "active" : ""}`}
                  onClick={() => handleGradeChange(g)}>
                  {g.replace("Grade ", "Gr ")}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="subject-picker">
            <div className="sp-label">Subject</div>
            <div className="subj-list">
              {SUBJECTS.map(s => (
                <button key={s} className={`subj-btn ${subject === s ? "active" : ""}`}
                  onClick={() => setSubject(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div className="personality-card">
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".5rem" }}>Tutor Mode</div>
            <div className="pc-inner" style={{ background: profile.bg, border: `1px solid ${profile.color}22` }}>
              <div className="pc-name" style={{ color: profile.color }}>{profile.emoji} {grade}</div>
              <div className="pc-desc" style={{ color: profile.color + "aa", fontSize: ".75rem" }}>
                {toneDescriptions[profile.ageGroup]}
              </div>
            </div>
          </div>


        </div>

        {/* CHAT */}
        <div className="tutor-chat">
          {/* Chat header */}
          <div className="chat-header">
            <div className="lumi-avatar">✨</div>
            <div className="chat-header-info">
              <div className="ch-name">Lumi — AI Tutor</div>
              <div className="ch-status">
                <span className="status-dot" />
                Online · {grade} · {subject}
              </div>
            </div>
            <span className="ch-grade">{profile.emoji} {grade}</span>
            <button className="ch-clear" onClick={() => handleGradeChange(grade)}>↺ New Chat</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} gradeProfile={profile} />
            ))}

            {loading && (
              <div className="msg-row">
                <div className="msg-avatar ai">✨</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            {attachments.length > 0 && (
              <div className="input-attachments">
                {attachments.map((a, i) => (
                  <div key={i} className="att-chip">
                    <span>
                      {a.imageUrl ? "🖼️" : "📄"} {a.fileName || "File"}
                      {a.pdfLoading && " — reading…"}
                      {a.pdfText && !a.pdfLoading && ` — ${a.pageCount||"?"}p extracted ✓`}
                      {a.imageBase64 && " — ready ✓"}
                    </span>
                    <button onClick={() => setAttachments([])}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="input-row">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                placeholder={`Ask Lumi anything about ${subject}…`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                style={{ height: "auto" }}
                onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              />
              <div className="input-actions">
                {/* Image upload */}
                <button className="ia-btn" title="Upload image/photo" onClick={() => imageInputRef.current?.click()}>📷</button>
                <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFileUpload(e, "image")} />

                {/* PDF upload */}
                <button className="ia-btn" title="Upload PDF" onClick={() => fileInputRef.current?.click()}>📎</button>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => handleFileUpload(e, "pdf")} />

                {/* Voice */}
                <button className={`ia-btn ${recording ? "recording" : ""}`} title="Voice record" onClick={() => recording ? stopRecording() : startRecording()}>🎙️</button>

                {/* Send */}
                <button className="send-btn" disabled={!input.trim() && attachments.length === 0} onClick={() => sendMessage()}>➤</button>
              </div>
            </div>
            <div className="input-hints">
              <span className="ih-hint">📷 Photo of homework</span>
              <span className="ih-hint">📎 PDF upload</span>
              <span className="ih-hint">🎙️ Voice question</span>
              <span className="ih-hint">↵ Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCORE RING
═══════════════════════════════════════════════════════════════════ */
function ScoreRing({ pct }) {
  const r = 78, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const color = pct >= 75 ? "#2d6a4f" : pct >= 60 ? "#c9922a" : pct >= 50 ? "#c8410a" : "#842029";
  return (
    <svg width="200" height="200">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8e2d6" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 1.2s ease" }} />
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "2.6rem", fontWeight: 900, fill: color }}>{pct}%</text>
      <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", fill: "#7a7060", textTransform: "uppercase" }}>SCORE</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ASSESSMENT TAB (unchanged)
═══════════════════════════════════════════════════════════════════ */
function AssessmentTab() {
  const [stage, setStage] = useState("intro");
  const [selected, setSelected] = useState(new Set());
  const [quizItems, setQuizItems] = useState([]);
  const [curIdx, setCurIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [results, setResults] = useState([]);
  const [gradingProg, setGradingProg] = useState(0);
  const timerRef = useRef(null);
  const paper = SAMPLE_PAPER;

  useEffect(() => {
    if (stage !== "quiz") { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); doSubmit(); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  function toggle(id) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function buildItems() { const items = []; for (const q of paper.questions) { if (!selected.has(q.id)) continue; if (q.subQuestions?.length) { q.subQuestions.forEach(sq => items.push({ ...sq, parentText: q.text })); } else { items.push({ ...q, parentText: null }); } } return items; }
  function calcTime(items) { return Math.max(items.reduce((s, i) => s + (i.timeMinutes || (i.marks ? i.marks * 1.5 : 3)), 0), 1); }
  function handleBegin() { const items = buildItems(); const secs = calcTime(items) * 60; setQuizItems(items); setTotalTime(secs); setTimeLeft(secs); setAnswers({}); setCurIdx(0); setStage("launch"); }
  function handleLaunch() { setStage("quiz"); document.documentElement.requestFullscreen?.().catch(() => {}); }
  async function doSubmit() {
    clearInterval(timerRef.current);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setStage("grading"); setGradingProg(0);
    const graded = [];
    for (let i = 0; i < quizItems.length; i++) {
      const item = quizItems[i]; const ans = answers[item.id] || "";
      const fullQ = item.options?.length ? `${item.text}\nOptions:\n${item.options.join("\n")}` : item.text;
      const r = await gradeAnswer(fullQ, ans, item.marks);
      graded.push({ item, answer: ans, ...r });
      setGradingProg(Math.round(((i + 1) / quizItems.length) * 100));
    }
    setResults(graded); setStage("results");
  }

  if (stage === "intro") return (
    <div className="intro-wrap">
      <div className="intro-eyebrow">— Sample Paper Loaded —</div>
      <h1 className="intro-title">Practice smarter, <em>score</em> higher.</h1>
      <p className="intro-sub">Pick your questions and get AI-graded with detailed feedback.</p>
      <div className="paper-preview-card">
        <div className="ppc-top">
          <div className="ppc-label">Question Paper</div>
          <div className="ppc-title">{paper.paperTitle}</div>
          <div className="ppc-stats">
            <div className="ppc-stat"><strong>{paper.totalMarks}</strong>Total Marks</div>
            <div className="ppc-stat"><strong>{paper.timeAllowed} min</strong>Time Allowed</div>
            <div className="ppc-stat"><strong>{paper.questions.length}</strong>Questions</div>
          </div>
        </div>
        <div className="ppc-body">
          <div className="ppc-qs">{paper.questions.map(q => (
            <div key={q.id} className="ppc-q">
              <span className="ppc-q-num">Q{q.number}</span><span>{q.text}</span>
              <span className="ppc-q-marks">{q.marks}m · {q.subQuestions?.length || 0} parts</span>
            </div>
          ))}</div>
          <button className="btn-begin" onClick={() => setStage("selecting")}>Choose Questions →</button>
        </div>
      </div>
    </div>
  );

  if (stage === "selecting") {
    const selMks = paper.questions.filter(q => selected.has(q.id)).reduce((s, q) => s + q.marks, 0);
    const selTime = calcTime(buildItems());
    return (
      <>
        <div className="sel-wrap">
          <div className="sel-paper-meta">
            <div className="spm-title">{paper.paperTitle}</div>
            <div className="spm-row">
              <div className="spm-stat"><strong>{paper.totalMarks}</strong>Total Marks</div>
              <div className="spm-stat"><strong>{paper.timeAllowed} min</strong>Full Duration</div>
            </div>
            <p className="spm-instructions">{paper.instructions}</p>
          </div>
          <div className="sec-label">Select questions</div>
          <div className="q-list">{paper.questions.map(q => (
            <div key={q.id} className={`q-card ${selected.has(q.id) ? "sel" : ""}`} onClick={() => toggle(q.id)}>
              <div className="qc-head">
                <div className="qc-check">{selected.has(q.id) ? "✓" : ""}</div>
                <div className="qc-num">Q{q.number}</div>
                <div className="qc-txt">{q.text}</div>
                <div className="qc-badges"><span className="badge m">{q.marks}m</span><span className="badge t">{q.timeMinutes}min</span>{typePill(q.type)}</div>
              </div>
              {q.subQuestions?.length > 0 && <div className="subq-list">{q.subQuestions.map(sq => (
                <div key={sq.id} className="subq-row">
                  <span className="subq-lbl">{sq.label})</span>
                  <span>{sq.text.length > 100 ? sq.text.slice(0, 100) + "…" : sq.text}</span>
                  <span className="badge m" style={{ marginLeft: "auto", flexShrink: 0 }}>{sq.marks}m</span>
                  {typePill(sq.type)}
                </div>
              ))}</div>}
            </div>
          ))}</div>
        </div>
        <div className="sel-footer">
          <div className="sf-info"><strong>{selected.size}</strong> selected{selMks > 0 && <> · <strong>{selMks}m</strong> · ~<strong>{selTime}min</strong></>}</div>
          <button className="btn btn-ghost" onClick={() => { const all = new Set(paper.questions.map(q => q.id)); setSelected(p => p.size === all.size ? new Set() : all); }}>{selected.size === paper.questions.length ? "Deselect All" : "Select All"}</button>
          <button className="btn btn-primary" disabled={selected.size === 0} onClick={handleBegin}>Begin →</button>
        </div>
      </>
    );
  }

  if (stage === "launch") { const mins = Math.round(totalTime / 60); const mks = quizItems.reduce((s, i) => s + (i.marks || 0), 0); return (<div className="launch-screen"><div className="launch-ey">— Ready —</div><h2 className="launch-title">{paper.paperTitle}</h2><div className="launch-meta"><strong>{quizItems.length}</strong> questions &nbsp;·&nbsp; <strong>{mks}</strong> marks &nbsp;·&nbsp; <strong>{mins} min</strong></div><p className="launch-detail">Will attempt fullscreen. Start when ready.</p><button className="btn-launch" onClick={handleLaunch}>Start Assessment ↗</button></div>); }

  if (stage === "grading") return (<div className="grading-screen"><div className="spin" /><div className="grading-title">Marking…</div><p className="grading-sub">AI reviewing each response</p><div className="grading-prog"><div className="grading-prog-fill" style={{ width: `${gradingProg}%` }} /></div><p className="grading-sub" style={{ marginTop: ".4rem" }}>{gradingProg}%</p></div>);

  if (stage === "quiz") {
    const item = quizItems[curIdx]; const ans = answers[item?.id] || "";
    const done = Object.keys(answers).length; const danger = timeLeft < 60;
    const pct = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    return (
      <div className="quiz-fs">
        <div className="quiz-bar">
          <div className="qb-title">{paper.paperTitle}</div>
          <div className="qb-dots">{quizItems.map((q, i) => (<button key={q.id} className={`q-dot ${i === curIdx ? "active" : ""} ${answers[q.id] ? "done" : ""}`} onClick={() => setCurIdx(i)}>{i + 1}</button>))}</div>
          <div className={`quiz-timer ${danger ? "danger" : ""}`}>⏱ {fmt(timeLeft)}</div>
        </div>
        <div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
        <div className="quiz-body"><div className="qb-inner">
          <div className="q-eyebrow"><span>Q{curIdx + 1}/{quizItems.length}</span><span className="sep">·</span><span>{item?.marks}m</span><span className="sep">·</span>{typePill(item?.type)}</div>
          {item?.parentText && <div className="q-parent">📚 {item.parentText}</div>}
          <div className="q-txt">{item?.text}</div>
          {item?.type === "mcq" && item?.options?.length ? (
            <div className="mcq-opts">{item.options.map((opt, i) => (<div key={i} className={`mcq-opt ${ans === opt ? "picked" : ""}`} onClick={() => setAnswers(p => ({ ...p, [item.id]: opt }))}><span className="opt-ltr">{opt[0]}</span><span className="opt-txt">{opt.slice(2).trim()}</span></div>))}</div>
          ) : (<><div className="ans-hint">{item?.type === "calculation" ? "Show working + answer with units." : "Write your answer clearly."}</div><textarea className="txt-ans" placeholder="Type here…" value={ans} onChange={e => setAnswers(p => ({ ...p, [item.id]: e.target.value }))} /></>)}
        </div></div>
        <div className="quiz-foot">
          <span className="qf-count">{done}/{quizItems.length} answered</span>
          {curIdx > 0 && <button className="btn btn-ghost" onClick={() => setCurIdx(i => i - 1)}>← Prev</button>}
          {curIdx < quizItems.length - 1 ? <button className="btn btn-primary" onClick={() => setCurIdx(i => i + 1)}>Next →</button> : <button className="btn btn-primary" onClick={doSubmit}>Submit ✓</button>}
        </div>
      </div>
    );
  }

  if (stage === "results") {
    const totMax = results.reduce((s, r) => s + (r.max || 0), 0);
    const totScore = results.reduce((s, r) => s + (r.score || 0), 0);
    const pct = totMax > 0 ? Math.round((totScore / totMax) * 100) : 0;
    const correct = results.filter(r => r.correct).length;
    const gm = pct >= 75 ? ["Distinction", "gl-dist"] : pct >= 60 ? ["Merit", "gl-merit"] : pct >= 50 ? ["Pass", "gl-pass"] : ["Below Pass", "gl-fail"];
    return (
      <div className="results-wrap">
        <div className="res-header"><div className="res-ey">— Complete —</div><h2 className="res-title">{paper.paperTitle}</h2><p className="res-sub">{totScore} / {totMax} marks</p></div>
        <div className="score-ring-wrap"><ScoreRing pct={pct} /></div>
        <div className="grade-center"><span className={`grade-label ${gm[1]}`}>{gm[0]}</span></div>
        <div className="summary-bar" style={{ marginTop: "1.5rem" }}>
          <div className="sb-item"><strong>{totScore}/{totMax}</strong>Marks</div>
          <div className="sb-item"><strong>{correct}/{results.length}</strong>Correct</div>
          <div className="sb-item"><strong>{pct}%</strong>Score</div>
          <div className="sb-item"><strong>{gm[0]}</strong>Grade</div>
        </div>
        <div className="sec-label" style={{ marginBottom: "1rem" }}>Breakdown</div>
        <div className="res-cards">{results.map((r, i) => {
          const na = !r.answer; const ic = na ? "ic-skip" : r.correct ? "ic-ok" : r.score > 0 ? "ic-part" : "ic-bad"; const ico = na ? "–" : r.correct ? "✓" : r.score > 0 ? "~" : "✗";
          return (<div key={i} className="rc" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="rc-head"><div className={`rc-icon ${ic}`}>{ico}</div><div className="rc-q">{r.item?.parentText && <span style={{ color: "var(--muted)", fontSize: ".8rem" }}>{r.item.parentText} → </span>}{r.item?.text?.slice(0, 100)}{(r.item?.text?.length || 0) > 100 ? "…" : ""}</div><div className="rc-m">{r.score ?? 0}/{r.max}</div></div>
            <div className="rc-body"><strong>Your Answer</strong>{r.answer ? <span>{r.answer.length > 200 ? r.answer.slice(0, 200) + "…" : r.answer}</span> : <em style={{ color: "var(--line)" }}>No answer given</em>}{r.feedback && <div className="rc-fb">💬 {r.feedback}</div>}</div>
          </div>);
        })}</div>
        <div className="res-actions">
          <button className="btn btn-ghost" onClick={() => { setStage("selecting"); setSelected(new Set()); setResults([]); }}>Try Again</button>
          <button className="btn btn-primary" onClick={() => { setStage("intro"); setSelected(new Set()); setResults([]); }}>↩ Start Over</button>
        </div>
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   SMART LEARNING TAB (simplified — full version in v2)
═══════════════════════════════════════════════════════════════════ */
function SmartLearningTab() {
  return (
    <div className="sl-outer">
      <div className="sl-coming">
        <div style={{ fontSize: "3rem" }}>🧠</div>
        <div className="sl-coming-title">Smart Learning</div>
        <p className="sl-coming-sub">Upload a PDF chapter and get instant visual notes — mind maps, flowcharts, formula sheets, and CAPS exam tips.</p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".7rem", color: "var(--muted)", letterSpacing: ".1em" }}>Full demo available in previous version</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STUDY LIBRARY — DATA & CONSTANTS
═══════════════════════════════════════════════════════════════════ */
const LIB_GRADES = [
  "All Students","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12",
];
const LIB_CURRICULUMS = ["CAPS","IEB"];
const LIB_SUBJECTS = {
  "All Students":["General","Mathematics","English","Arts & Culture","Life Skills"],
  "Grade 1":["Mathematics","English Home Language","Afrikaans FAL","Life Skills"],
  "Grade 2":["Mathematics","English Home Language","Afrikaans FAL","Life Skills"],
  "Grade 3":["Mathematics","English Home Language","Afrikaans FAL","Life Skills"],
  "Grade 4":["Mathematics","English","Afrikaans","Natural Sciences","Social Sciences","Life Skills","Technology","Arts & Culture"],
  "Grade 5":["Mathematics","English","Afrikaans","Natural Sciences","Social Sciences","Life Skills","Technology","Arts & Culture"],
  "Grade 6":["Mathematics","English","Afrikaans","Natural Sciences","Social Sciences","Life Skills","Technology","Arts & Culture"],
  "Grade 7":["Mathematics","English","Afrikaans","Natural Sciences","Social Sciences","Life Orientation","Technology","EMS"],
  "Grade 8":["Mathematics","English","Afrikaans","Natural Sciences","Social Sciences","Life Orientation","Technology","EMS"],
  "Grade 9":["Mathematics","English","Afrikaans","Natural Sciences","Social Sciences","Life Orientation","Technology","EMS"],
  "Grade 10":["Mathematics","Mathematical Literacy","English","Physical Sciences","Life Sciences","Accounting","Geography","History","Business Studies","Economics","Life Orientation"],
  "Grade 11":["Mathematics","Mathematical Literacy","English","Physical Sciences","Life Sciences","Accounting","Geography","History","Business Studies","Economics","Life Orientation"],
  "Grade 12":["Mathematics","Mathematical Literacy","English","Physical Sciences","Life Sciences","Accounting","Geography","History","Business Studies","Economics","Life Orientation","CAT"],
};
const GRADE_COLORS_LIB = {
  "All Students":"#9d174d","Grade 1":"#c2410c","Grade 2":"#b45309","Grade 3":"#4d7c0f",
  "Grade 4":"#047857","Grade 5":"#0e7490","Grade 6":"#1d4ed8","Grade 7":"#4338ca",
  "Grade 8":"#6d28d9","Grade 9":"#7c3aed","Grade 10":"#a21caf","Grade 11":"#be185d","Grade 12":"#0f766e",
};
const LIB_GRADES_CONST = [
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","All Students"
];
// LIB_GRADES, LIB_CURRICULUMS, LIB_SUBJECTS, GRADE_COLORS_LIB defined below

/* ═══════════════════════════════════════════════════════════════════
   SUPABASE LIBRARY HELPERS
   All reads/writes go through /api/library (server-side proxy that
   holds the Supabase service-role key securely).
═══════════════════════════════════════════════════════════════════ */
async function libAPI(action, payload={}) {
  const res = await fetch("/api/library", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Library API error");
  return json;
}

function libUid(){ return "f_"+Math.random().toString(36).slice(2); }
function libNow(){ return new Date().toISOString().split("T")[0]; }
function libFileIcon(t){ return t==="pdf"?"📄":t==="image"?"🖼️":"📎"; }

/* ── CONFIRM MODAL ── */
function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel="Confirm", danger=false }){
  return (
    <div className="lib-modal-overlay" onClick={onCancel}>
      <div className="lib-modal sm" onClick={e=>e.stopPropagation()}>
        <div className="confirm-ico">{danger?"⚠️":"❓"}</div>
        <div className="lm-body" style={{paddingTop:0}}>
          <div className="confirm-title">{title}</div>
          <div className="confirm-msg">{message}</div>
        </div>
        <div className="lm-footer">
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          <button className={`btn btn-sm ${danger?"btn-accent-danger":"btn-primary"}`}
            style={danger?{background:"var(--coral)",color:"#fff"}:{}}
            onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ── DROP ZONE ── */
function DropZone({ files, setFiles }){
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  function addFiles(raw){
    const added = Array.from(raw).map(f=>({
      id: libUid(), name: f.name, file: f,
      type: f.type.includes("pdf")?"pdf":f.type.includes("image")?"image":"file",
      size: f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.round(f.size/1024)+" KB",
    }));
    setFiles(p=>[...p,...added]);
  }
  return (
    <div>
      <div className={`drop-zone ${drag?"dz-drag":""}`}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files)}}
        onClick={()=>inputRef.current?.click()}>
        <div className="dz-ico">☁️</div>
        <div className="dz-text"><strong>Drop files here</strong> or click to browse</div>
        <div className="dz-sub">PDF, PNG, JPG, DOCX — up to 50 MB each</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
          style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
      </div>
      {files.length>0 && (
        <div className="dz-file-list">
          {files.map(f=>(
            <div key={f.id} className="dz-file">
              <span>{libFileIcon(f.type)}</span>
              <span style={{flex:1,fontSize:".8rem",color:"var(--ink2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
              <span style={{fontSize:".62rem",flexShrink:0,color:"var(--ink3)"}}>{f.size}</span>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--coral)",fontSize:".8rem",flexShrink:0}}
                onClick={()=>setFiles(p=>p.filter(x=>x.id!==f.id))}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── CREATE FOLDER MODAL ── */
function CreateFolderModal({ onClose, onSave }){
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Grade 11");
  const [curr, setCurr] = useState("CAPS");
  const [subj, setSubj] = useState("Physical Sciences");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const subs = LIB_SUBJECTS[grade]||[];
  function handleGrade(g){ setGrade(g); setSubj(LIB_SUBJECTS[g]?.[0]||""); }
  async function handleSave(){
    if(!name.trim()) return;
    setSaving(true); setErr("");
    try {
      await onSave({name:name.trim(),grade,curriculum:curr,subject:subj});
    } catch(e){ setErr(e.message); setSaving(false); }
  }
  return (
    <div className="lib-modal-overlay" onClick={onClose}>
      <div className="lib-modal" onClick={e=>e.stopPropagation()}>
        <div className="lm-header">
          <div><div className="lm-title">📁 Create New Folder</div>
            <div className="lm-sub">Organise content by grade and curriculum</div></div>
          <button className="lm-close" onClick={onClose}>✕</button>
        </div>
        <div className="lm-body">
          <div className="lm-fg">
            <label className="lm-label">Folder Name</label>
            <input className="lm-input" placeholder="e.g. Term 2 Physics Notes"
              value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div className="lm-fg">
            <label className="lm-label">Curriculum</label>
            <div className="curr-toggle">
              {LIB_CURRICULUMS.map(c=>(
                <button key={c} className={`ct-btn ${c.toLowerCase()} ${curr===c?"on":""}`}
                  onClick={()=>setCurr(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="lm-row2">
            <div className="lm-fg">
              <label className="lm-label">Grade / Audience</label>
              <select className="lm-select" value={grade} onChange={e=>handleGrade(e.target.value)}>
                {LIB_GRADES.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="lm-fg">
              <label className="lm-label">Subject</label>
              <select className="lm-select" value={subj} onChange={e=>setSubj(e.target.value)}>
                {subs.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {err && <div style={{fontSize:".8rem",color:"var(--coral)",padding:".5rem",background:"rgba(255,79,109,.1)",borderRadius:"6px"}}>{err}</div>}
        </div>
        <div className="lm-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" disabled={!name.trim()||saving}
            onClick={handleSave}>
            {saving ? "Creating…" : "Create Folder"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── UPLOAD FILES MODAL ── */
function UploadFilesModal({ folder, onClose, onSave }){
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [prog, setProg] = useState(0);
  const [err, setErr] = useState("");
  async function doUpload(){
    if(!files.length) return;
    setUploading(true); setErr(""); setProg(0);
    try {
      await onSave(files, (p)=>setProg(p));
    } catch(e){
      setErr(e.message);
      setUploading(false);
    }
  }
  return (
    <div className="lib-modal-overlay" onClick={uploading?null:onClose}>
      <div className="lib-modal" onClick={e=>e.stopPropagation()}>
        <div className="lm-header">
          <div><div className="lm-title">⬆️ Upload to "{folder?.name}"</div>
            <div className="lm-sub">{folder?.curriculum} · {folder?.grade} · {folder?.subject}</div></div>
          <button className="lm-close" onClick={uploading?null:onClose}>✕</button>
        </div>
        <div className="lm-body">
          {!uploading && <DropZone files={files} setFiles={setFiles}/>}
          {uploading && (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",padding:"1rem 0"}}>
              <div className="spin"/>
              <div style={{fontSize:".85rem",color:"var(--ink2)"}}>Uploading files… {prog}%</div>
              <div className="grading-bar" style={{width:"100%"}}>
                <div className="grading-prog-fill" style={{width:`${prog}%`}}/>
              </div>
            </div>
          )}
          {err && <div style={{fontSize:".8rem",color:"var(--coral)",padding:".5rem",background:"rgba(255,79,109,.1)",borderRadius:"6px"}}>{err}</div>}
        </div>
        <div className="lm-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="btn btn-primary btn-sm" disabled={!files.length||uploading} onClick={doUpload}>
            {uploading ? `Uploading…` : `Upload ${files.length>0?files.length+" file"+(files.length>1?"s":""):""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── UPLOAD FOLDER MODAL (create + upload in one step) ── */
function UploadFolderModal({ onClose, onSave }){
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Grade 11");
  const [curr, setCurr] = useState("CAPS");
  const [subj, setSubj] = useState("Physical Sciences");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [prog, setProg] = useState(0);
  const [err, setErr] = useState("");
  const subs = LIB_SUBJECTS[grade]||[];
  function handleGrade(g){ setGrade(g); setSubj(LIB_SUBJECTS[g]?.[0]||""); }
  async function handleSave(){
    if(!name.trim()) return;
    setSaving(true); setErr("");
    try {
      await onSave({name:name.trim(),grade,curriculum:curr,subject:subj,files}, (p)=>setProg(p));
    } catch(e){ setErr(e.message); setSaving(false); }
  }
  return (
    <div className="lib-modal-overlay" onClick={saving?null:onClose}>
      <div className="lib-modal" onClick={e=>e.stopPropagation()}>
        <div className="lm-header">
          <div><div className="lm-title">📂 Upload New Folder</div>
            <div className="lm-sub">Create a folder and add files in one step</div></div>
          <button className="lm-close" onClick={saving?null:onClose}>✕</button>
        </div>
        <div className="lm-body">
          {!saving ? (<>
            <div className="lm-fg">
              <label className="lm-label">Folder Name</label>
              <input className="lm-input" placeholder="e.g. Term 3 Study Pack"
                value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div className="lm-fg">
              <label className="lm-label">Curriculum</label>
              <div className="curr-toggle">
                {LIB_CURRICULUMS.map(c=>(
                  <button key={c} className={`ct-btn ${c.toLowerCase()} ${curr===c?"on":""}`}
                    onClick={()=>setCurr(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="lm-row2">
              <div className="lm-fg">
                <label className="lm-label">Grade / Audience</label>
                <select className="lm-select" value={grade} onChange={e=>handleGrade(e.target.value)}>
                  {LIB_GRADES.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="lm-fg">
                <label className="lm-label">Subject</label>
                <select className="lm-select" value={subj} onChange={e=>setSubj(e.target.value)}>
                  {subs.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="lm-fg">
              <label className="lm-label">Files (optional — add more later)</label>
              <DropZone files={files} setFiles={setFiles}/>
            </div>
          </>) : (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",padding:"1rem 0"}}>
              <div className="spin"/>
              <div style={{fontSize:".85rem",color:"var(--ink2)"}}>Creating folder and uploading… {prog}%</div>
              <div className="grading-bar" style={{width:"100%"}}>
                <div className="grading-prog-fill" style={{width:`${prog}%`}}/>
              </div>
            </div>
          )}
          {err && <div style={{fontSize:".8rem",color:"var(--coral)",padding:".5rem",background:"rgba(255,79,109,.1)",borderRadius:"6px"}}>{err}</div>}
        </div>
        <div className="lm-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary btn-sm" disabled={!name.trim()||saving}
            onClick={handleSave}>
            {saving ? "Uploading…" : "Create & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STUDY LIBRARY TAB  (Supabase-backed)
══════════════════════════════════════════════ */
function StudyLibraryTab({ isSuperuser=true, studentGrade="Grade 11", studentCurriculum="CAPS" }){
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterGrade, setFilterGrade] = useState("All");
  const [filterCurr, setFilterCurr] = useState("All");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterSubj, setFilterSubj] = useState("All");
  const [search, setSearch] = useState("");
  const [openFolder, setOpenFolder] = useState(null);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  /* ── Load folders from Supabase on mount ── */
  useEffect(()=>{ loadFolders(); },[]);

  async function loadFolders(){
    setLoading(true); setLoadErr("");
    try {
      const data = await libAPI("getFolders");
      setFolders(data.folders||[]);
    } catch(e){
      setLoadErr("Could not load library: "+e.message);
    } finally { setLoading(false); }
  }

  const allSubjects = [...new Set(folders.map(f=>f.subject))].sort();
  const totalFiles = folders.reduce((s,f)=>s+(f.files?.length||0),0);
  const activeCount = folders.filter(f=>f.status==="active").length;

  const visible = folders.filter(f=>{
    if(!isSuperuser){
      if(f.status!=="active") return false;
      if(f.curriculum!==studentCurriculum) return false;
      if(f.grade!==studentGrade && f.grade!=="All Students") return false;
    } else {
      if(filterGrade!=="All" && f.grade!==filterGrade) return false;
      if(filterCurr!=="All" && f.curriculum!==filterCurr) return false;
      if(filterStatus!=="all" && f.status!==filterStatus) return false;
      if(filterSubj!=="All" && f.subject!==filterSubj) return false;
    }
    if(search && !f.name.toLowerCase().includes(search.toLowerCase())
      && !f.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ── CRUD ── */
  async function createFolder(data){
    const res = await libAPI("createFolder", data);
    setFolders(p=>[{...res.folder, files:[]},...p]);
    setModal(null);
  }

  async function createFolderWithFiles({name,grade,curriculum,subject,files}, onProgress){
    const res = await libAPI("createFolder", {name,grade,curriculum,subject});
    const folder = res.folder;
    const uploaded = await uploadFiles(folder.id, files, onProgress);
    setFolders(p=>[{...folder, files:uploaded},...p]);
    setModal(null);
  }

  async function uploadToFolder(folderId, files, onProgress){
    const uploaded = await uploadFiles(folderId, files, onProgress);
    setFolders(p=>p.map(f=>f.id===folderId
      ?{...f,files:[...(f.files||[]),...uploaded]}:f));
    if(openFolder?.id===folderId)
      setOpenFolder(p=>p?{...p,files:[...(p.files||[]),...uploaded]}:null);
    setModal(null);
  }

  /* Upload each file to Supabase Storage via /api/library */
  async function uploadFiles(folderId, files, onProgress){
    const uploaded = [];
    for(let i=0;i<files.length;i++){
      const f = files[i];
      if(!f.file) { uploaded.push(f); continue; } // already-saved file object
      // Convert File to base64
      const b64 = await new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload=()=>res(r.result.split(",")[1]);
        r.onerror=()=>rej(new Error("Read error"));
        r.readAsDataURL(f.file);
      });
      const res = await libAPI("uploadFile",{
        folderId, name:f.name, type:f.type,
        size:f.size, mimeType:f.file.type,
        data:b64,
      });
      uploaded.push(res.file);
      if(onProgress) onProgress(Math.round(((i+1)/files.length)*100));
    }
    return uploaded;
  }

  async function toggleArchive(id){
    const folder = folders.find(f=>f.id===id);
    const newStatus = folder?.status==="archived"?"active":"archived";
    await libAPI("setStatus",{id,status:newStatus});
    setFolders(p=>p.map(f=>f.id===id?{...f,status:newStatus}:f));
    setConfirm(null);
  }

  async function toggleHide(id){
    const folder = folders.find(f=>f.id===id);
    const newStatus = folder?.status==="hidden"?"active":"hidden";
    await libAPI("setStatus",{id,status:newStatus});
    setFolders(p=>p.map(f=>f.id===id?{...f,status:newStatus}:f));
  }

  async function deleteFolder(id){
    await libAPI("deleteFolder",{id});
    setFolders(p=>p.filter(f=>f.id!==id));
    if(openFolder?.id===id) setOpenFolder(null);
    setConfirm(null);
  }

  async function deleteFile(folderId, fileId){
    await libAPI("deleteFile",{folderId,fileId});
    setFolders(p=>p.map(f=>f.id===folderId?{...f,files:(f.files||[]).filter(x=>x.id!==fileId)}:f));
    setOpenFolder(p=>p?{...p,files:(p.files||[]).filter(x=>x.id!==fileId)}:null);
  }

  /* ── FOLDER DETAIL VIEW ── */
  if(openFolder){
    const live = folders.find(f=>f.id===openFolder.id)||openFolder;
    const color = GRADE_COLORS_LIB[live.grade]||"#6b3fa0";
    return (
      <div className="folder-detail">
        <button className="fd-back-btn" onClick={()=>setOpenFolder(null)}>← Back to Library</button>
        <div className="fd-header">
          <div className="fd-folder-icon" style={{color}}>📁</div>
          <div className="fd-info">
            <div className="fd-title">{live.name}</div>
            <div className="fd-tags">
              <span className={`lib-tag ${live.grade==="All Students"?"lt-all":"lt-grade"}`}>{live.grade}</span>
              <span className={`lib-tag ${live.curriculum==="CAPS"?"lt-caps":"lt-ieb"}`}>{live.curriculum}</span>
              <span className="lib-tag lt-subj">{live.subject}</span>
              {live.status==="archived"&&<span className="lib-tag lt-archived">Archived</span>}
              {live.status==="hidden"&&<span className="lib-tag lt-hidden">Hidden</span>}
            </div>
          </div>
          {isSuperuser&&(
            <div className="fd-actions">
              <button className="btn btn-primary btn-sm"
                onClick={()=>setModal({type:"upload",data:live})}>⬆️ Upload Files</button>
            </div>
          )}
        </div>

        {(live.files||[]).length===0?(
          <div className="lib-empty">
            <div className="lib-empty-icon">📂</div>
            <div className="lib-empty-title">This folder is empty</div>
            <div className="lib-empty-sub">
              {isSuperuser?"Click 'Upload Files' to add PDFs or images.":"No files uploaded here yet."}
            </div>
          </div>
        ):(
          <div className="files-grid">
            {(live.files||[]).map((file,i)=>(
              <div key={file.id} className="file-tile" style={{animationDelay:`${i*35}ms`}}>
                <div className="ft-icon">{libFileIcon(file.type)}</div>
                <div className="ft-name">{file.name}</div>
                <div className="ft-size">{file.size} · {file.added}</div>
                {/* Download button — works for both superuser and students */}
                {file.url && (
                  <a href={file.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"center",gap:".3rem",fontSize:".72rem",color:"var(--violet2)",textDecoration:"none",marginTop:"auto",padding:".28rem .5rem",background:"rgba(124,77,255,.1)",borderRadius:"5px",border:"1px solid rgba(124,77,255,.25)",transition:"all .13s"}}
                    onMouseOver={e=>{e.currentTarget.style.background="rgba(124,77,255,.2)"}}
                    onMouseOut={e=>{e.currentTarget.style.background="rgba(124,77,255,.1)"}}>
                    ↓ Download
                  </a>
                )}
                {isSuperuser&&(
                  <button className="ft-del"
                    onClick={e=>{e.stopPropagation();deleteFile(live.id,file.id)}}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {modal?.type==="upload"&&(
          <UploadFilesModal folder={modal.data} onClose={()=>setModal(null)}
            onSave={(files,onProg)=>uploadToFolder(modal.data.id,files,onProg)}/>
        )}
      </div>
    );
  }

  /* ── MAIN LIBRARY VIEW ── */
  return (
    <div className="sl-lib">
      <div className="sl-lib-header">
        <div>
          <div className="sl-lib-title">Study Library</div>
          <div className="sl-lib-sub">
            {isSuperuser
              ? "Manage and organise all study materials by grade and curriculum"
              : `Your ${studentCurriculum} materials for ${studentGrade}`}
          </div>
        </div>
        <div className="sl-lib-actions">
          <div className="role-switch" title="Switch between Superuser and Student view">
            <button className={`rs-btn ${isSuperuser?"active-su":""}`} style={{cursor:"default"}}>👑 Superuser</button>
            <button className={`rs-btn ${!isSuperuser?"active-st":""}`} style={{cursor:"default"}}>👤 Student</button>
          </div>
          {isSuperuser&&(<>
            <button className="btn btn-ghost btn-sm"
              onClick={()=>setModal({type:"createFolder"})}>📁 New Folder</button>
            <button className="btn btn-primary btn-sm"
              onClick={()=>setModal({type:"uploadFolder"})}>⬆️ Upload Folder</button>
          </>)}
        </div>
      </div>

      {isSuperuser&&(
        <div className="lib-stats">
          {[
            {ico:"📁",val:folders.length,lbl:"Total Folders",bg:"rgba(124,77,255,.12)",ic:"var(--violet2)"},
            {ico:"✅",val:activeCount,lbl:"Active",bg:"rgba(0,229,195,.1)",ic:"var(--mint)"},
            {ico:"📄",val:totalFiles,lbl:"Total Files",bg:"rgba(56,189,248,.1)",ic:"var(--sky)"},
            {ico:"🏫",val:LIB_GRADES.length-1,lbl:"Grade Groups",bg:"rgba(255,209,102,.1)",ic:"var(--gold)"},
          ].map((s,i)=>(
            <div key={i} className="lib-stat">
              <div className="lib-stat-ico" style={{background:s.bg,color:s.ic}}>{s.ico}</div>
              <div>
                <div className="lib-stat-val">{s.val}</div>
                <div className="lib-stat-lbl">{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lib-filters">
        <span className="lf-label">Filter</span>
        <input className="lf-search" placeholder="Search folders…"
          value={search} onChange={e=>setSearch(e.target.value)}/>
        {isSuperuser&&(<>
          <div className="lf-sep"/>
          <select className="lf-select" value={filterGrade} onChange={e=>setFilterGrade(e.target.value)}>
            <option value="All">All Grades</option>
            {LIB_GRADES.map(g=><option key={g}>{g}</option>)}
          </select>
          <select className="lf-select" value={filterCurr} onChange={e=>setFilterCurr(e.target.value)}>
            <option value="All">All Curriculums</option>
            {LIB_CURRICULUMS.map(c=><option key={c}>{c}</option>)}
          </select>
          <select className="lf-select" value={filterSubj} onChange={e=>setFilterSubj(e.target.value)}>
            <option value="All">All Subjects</option>
            {allSubjects.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="lf-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
            <option value="archived">Archived</option>
            <option value="all">All Status</option>
          </select>
        </>)}
        <div className="view-toggle" style={{marginLeft:"auto"}}>
          <button className={`vt-btn ${viewMode==="grid"?"on":""}`} onClick={()=>setViewMode("grid")}>⊞</button>
          <button className={`vt-btn ${viewMode==="list"?"on":""}`} onClick={()=>setViewMode("list")}>☰</button>
        </div>
      </div>

      {/* Loading / error states */}
      {loading && (
        <div style={{display:"flex",alignItems:"center",gap:".75rem",padding:"2rem",color:"var(--ink2)"}}>
          <div className="spin" style={{width:"24px",height:"24px",borderWidth:"2px"}}/>
          Loading library…
        </div>
      )}
      {loadErr && (
        <div style={{padding:"1rem",background:"rgba(255,79,109,.1)",border:"1px solid var(--coral)",borderRadius:"8px",color:"var(--coral)",fontSize:".85rem"}}>
          {loadErr} — <button style={{background:"none",border:"none",color:"var(--violet2)",cursor:"pointer",textDecoration:"underline"}} onClick={loadFolders}>Retry</button>
        </div>
      )}

      {!loading && !loadErr && (
        <>
          <div style={{fontSize:".75rem",color:"var(--ink3)",marginBottom:".9rem"}}>
            {visible.length} folder{visible.length!==1?"s":""} found
          </div>

          {visible.length===0&&(
            <div className="lib-empty">
              <div className="lib-empty-icon">🔍</div>
              <div className="lib-empty-title">No folders found</div>
              <div className="lib-empty-sub">
                {isSuperuser?"Adjust your filters or create a new folder."
                  :"No materials have been uploaded for your grade and curriculum yet."}
              </div>
            </div>
          )}

          {visible.length>0 && viewMode==="grid" && (
            <div className="folder-grid">
              {visible.map((folder,i)=>{
                const color = GRADE_COLORS_LIB[folder.grade]||"#6b3fa0";
                return (
                  <div key={folder.id}
                    className={`folder-card ${folder.status!=="active"?"fc-"+folder.status:""}`}
                    style={{animationDelay:`${i*45}ms`}}
                    onClick={()=>setOpenFolder(folder)}>
                    <div className="fc-color-bar" style={{background:color}}/>
                    <div className="fc-body">
                      <div className="fc-icon-row">
                        <div className="fc-folder-icon" style={{color}}>📁</div>
                        <div className="fc-tags-inline">
                          <span className={`lib-tag ${folder.grade==="All Students"?"lt-all":"lt-grade"}`}>{folder.grade}</span>
                          <span className={`lib-tag ${folder.curriculum==="CAPS"?"lt-caps":"lt-ieb"}`}>{folder.curriculum}</span>
                        </div>
                      </div>
                      <div className="fc-name">{folder.name}</div>
                      <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                        <span className="lib-tag lt-subj">{folder.subject}</span>
                        {folder.status==="archived"&&<span className="lib-tag lt-archived">Archived</span>}
                        {folder.status==="hidden"&&<span className="lib-tag lt-hidden">Hidden</span>}
                      </div>
                    </div>
                    <div className="fc-foot">
                      <span className="fc-file-count">📄 {(folder.files||[]).length} file{(folder.files||[]).length!==1?"s":""}</span>
                      {isSuperuser&&(
                        <div className="fc-su-actions" onClick={e=>e.stopPropagation()}>
                          <button className="fca-btn" title="Upload files"
                            onClick={()=>setModal({type:"upload",data:folder})}>⬆️</button>
                          <button className="fca-btn hid" title={folder.status==="hidden"?"Show":"Hide"}
                            onClick={()=>toggleHide(folder.id)}>
                            {folder.status==="hidden"?"👁":"🙈"}
                          </button>
                          <button className="fca-btn arc"
                            title={folder.status==="archived"?"Restore":"Archive"}
                            onClick={()=>setConfirm({type:"archive",id:folder.id,name:folder.name,isArchived:folder.status==="archived"})}>
                            🗃️
                          </button>
                          <button className="fca-btn del" title="Delete folder"
                            onClick={()=>setConfirm({type:"delete",id:folder.id,name:folder.name})}>
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {visible.length>0 && viewMode==="list" && (
            <div className="folder-list-view">
              {visible.map((folder,i)=>{
                const color = GRADE_COLORS_LIB[folder.grade]||"#6b3fa0";
                return (
                  <div key={folder.id}
                    className={`folder-row ${folder.status!=="active"?"fc-"+folder.status:""}`}
                    style={{animationDelay:`${i*30}ms`}}
                    onClick={()=>setOpenFolder(folder)}>
                    <div className="fr-color-dot" style={{background:color}}/>
                    <span style={{fontSize:"1.05rem",color}}>📁</span>
                    <span className="fr-name">{folder.name}</span>
                    <div className="fr-tags">
                      <span className={`lib-tag ${folder.grade==="All Students"?"lt-all":"lt-grade"}`}>{folder.grade}</span>
                      <span className={`lib-tag ${folder.curriculum==="CAPS"?"lt-caps":"lt-ieb"}`}>{folder.curriculum}</span>
                      <span className="lib-tag lt-subj">{folder.subject}</span>
                      {folder.status!=="active"&&(
                        <span className={`lib-tag ${folder.status==="archived"?"lt-archived":"lt-hidden"}`}>{folder.status}</span>
                      )}
                    </div>
                    <span className="fr-count">📄 {(folder.files||[]).length}</span>
                    {isSuperuser&&(
                      <div className="fr-actions" onClick={e=>e.stopPropagation()}>
                        <button className="fca-btn" onClick={()=>setModal({type:"upload",data:folder})}>⬆️</button>
                        <button className="fca-btn hid" onClick={()=>toggleHide(folder.id)}>
                          {folder.status==="hidden"?"👁":"🙈"}
                        </button>
                        <button className="fca-btn arc"
                          onClick={()=>setConfirm({type:"archive",id:folder.id,name:folder.name,isArchived:folder.status==="archived"})}>
                          🗃️
                        </button>
                        <button className="fca-btn del"
                          onClick={()=>setConfirm({type:"delete",id:folder.id,name:folder.name})}>
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      {modal?.type==="createFolder"&&(
        <CreateFolderModal onClose={()=>setModal(null)} onSave={createFolder}/>
      )}
      {modal?.type==="uploadFolder"&&(
        <UploadFolderModal onClose={()=>setModal(null)} onSave={createFolderWithFiles}/>
      )}
      {modal?.type==="upload"&&(
        <UploadFilesModal folder={modal.data} onClose={()=>setModal(null)}
          onSave={(files,onProg)=>uploadToFolder(modal.data.id,files,onProg)}/>
      )}

      {confirm?.type==="delete"&&(
        <ConfirmModal danger title="Delete Folder?"
          message={`Permanently delete "${confirm.name}" and all its files? This cannot be undone.`}
          confirmLabel="Delete" onConfirm={()=>deleteFolder(confirm.id)}
          onCancel={()=>setConfirm(null)}/>
      )}
      {confirm?.type==="archive"&&(
        <ConfirmModal
          title={confirm.isArchived?"Restore Folder?":"Archive Folder?"}
          message={confirm.isArchived
            ?`"${confirm.name}" will be restored and visible to students again.`
            :`"${confirm.name}" will be archived and hidden from all students.`}
          confirmLabel={confirm.isArchived?"Restore":"Archive"}
          onConfirm={()=>toggleArchive(confirm.id)}
          onCancel={()=>setConfirm(null)}/>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUPABASE AUTH — LOGIN SCREEN
   Calls /api/auth/login which uses Supabase Auth server-side.
   No Firebase. No extra SDK. One dependency.
═══════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLogin({ uid: data.uid, email: data.email, role: data.role });
    } catch (e) {
      setError(e.message || "Login failed. Check your email and password.");
    } finally { setLoading(false); }
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"var(--bg)",fontFamily:"'Plus Jakarta Sans',sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse 70% 55% at 20% 10%, rgba(124,77,255,.2) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 80% 90%, rgba(255,79,109,.14) 0%, transparent 60%)`}}/>
      <div style={{width:"min(420px,92vw)",background:"rgba(16,14,34,.95)",border:"1px solid rgba(58,53,112,.8)",borderRadius:"20px",padding:"2.5rem 2rem",boxShadow:"0 32px 80px rgba(0,0,0,.65), 0 0 0 1px rgba(124,77,255,.12)",position:"relative",zIndex:1}}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"2.2rem",fontWeight:800,letterSpacing:"-.02em",marginBottom:".35rem"}}>
            Exam<span style={{background:"linear-gradient(130deg,#9d75ff 30%,#ff4f6d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>IQ</span>
          </div>
          <div style={{fontSize:".75rem",color:"var(--ink3)",letterSpacing:".1em",textTransform:"uppercase",fontWeight:600}}>Superuser Portal</div>
        </div>

        {/* Fields */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginBottom:"1.4rem"}}>
          <div>
            <label style={{fontSize:".6rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink3)",display:"block",marginBottom:".38rem"}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="admin@school.co.za"
              style={{width:"100%",background:"var(--surface2)",border:"1.5px solid var(--border2)",borderRadius:"10px",color:"var(--ink)",fontFamily:"inherit",fontSize:".9rem",padding:".7rem 1rem",outline:"none",transition:"border-color .14s"}}
              onFocus={e=>e.target.style.borderColor="var(--violet)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}
            />
          </div>
          <div>
            <label style={{fontSize:".6rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink3)",display:"block",marginBottom:".38rem"}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder="••••••••"
                style={{width:"100%",background:"var(--surface2)",border:"1.5px solid var(--border2)",borderRadius:"10px",color:"var(--ink)",fontFamily:"inherit",fontSize:".9rem",padding:".7rem 2.8rem .7rem 1rem",outline:"none",transition:"border-color .14s"}}
                onFocus={e=>e.target.style.borderColor="var(--violet)"}
                onBlur={e=>e.target.style.borderColor="var(--border2)"}
              />
              <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:".75rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--ink3)",fontSize:".85rem"}}>{showPass?"🙈":"👁"}</button>
            </div>
          </div>
        </div>

        {error&&<div style={{background:"rgba(255,79,109,.1)",border:"1px solid rgba(255,79,109,.3)",borderRadius:"8px",padding:".65rem .9rem",fontSize:".82rem",color:"var(--coral2)",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>⚠️ {error}</div>}

        <button onClick={handleLogin} disabled={!email||!password||loading} style={{
          width:"100%",padding:".88rem",
          background:(!email||!password||loading)?"var(--surface2)":"linear-gradient(135deg,var(--violet),#9b5fff)",
          color:(!email||!password||loading)?"var(--ink3)":"#fff",
          border:"none",borderRadius:"10px",fontFamily:"inherit",fontSize:".95rem",fontWeight:700,
          cursor:(!email||!password||loading)?"not-allowed":"pointer",
          boxShadow:(!email||!password||loading)?"none":"0 4px 24px rgba(124,77,255,.42)",
          transition:"all .18s",display:"flex",alignItems:"center",justifyContent:"center",gap:".6rem",
        }}>
          {loading?<><div style={{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,.25)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Signing in…</>:"Sign In →"}
        </button>

        <div style={{textAlign:"center",fontSize:".7rem",color:"var(--ink3)",marginTop:"1.4rem"}}>
          🔒 Superuser access only · Contact admin to create an account
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("tutor");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const el = document.createElement("style"); el.textContent = STYLES; document.head.appendChild(el);
    try { const s = sessionStorage.getItem("examiq_user"); if (s) setUser(JSON.parse(s)); } catch {}
    setAuthChecked(true);
    return () => document.head.removeChild(el);
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    try { sessionStorage.setItem("examiq_user", JSON.stringify(userData)); } catch {}
  }

  function handleLogout() {
    setUser(null);
    try { sessionStorage.removeItem("examiq_user"); } catch {}
  }

  if (!authChecked) return null;
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const isSuperuser = user.role === "superuser";

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <div className="nav-brand">
          <div className="logo">Exam<span>IQ</span></div>
          <span className="logo-tag">v5</span>
        </div>
        <div className="nav-tabs">
          <button className={`nav-tab ${tab==="assessment"?"active-assessment":""}`} onClick={()=>setTab("assessment")}>
            <span className="nav-tab-icon">📝</span><span className="nav-tab-label">Assessment</span>
          </button>
          <button className={`nav-tab ${tab==="learning"?"active-learning":""}`} onClick={()=>setTab("learning")}>
            <span className="nav-tab-icon">🧠</span><span className="nav-tab-label">Smart Learning</span>
          </button>
          <button className={`nav-tab ${tab==="tutor"?"active-tutor":""}`} onClick={()=>setTab("tutor")}>
            <span className="nav-tab-icon">✨</span><span className="nav-tab-label">Tutor Assistance</span>
          </button>
          <button className={`nav-tab ${tab==="library"?"active-library":""}`} onClick={()=>setTab("library")}>
            <span className="nav-tab-icon">📚</span><span className="nav-tab-label">Study Library</span>
          </button>
          {isSuperuser&&(
            <button className={`nav-tab ${tab==="analytics"?"active-learning":""}`} onClick={()=>setTab("analytics")}>
              <span className="nav-tab-icon">📊</span><span className="nav-tab-label">Analytics</span>
            </button>
          )}
        </div>
        <div style={{padding:".85rem 1rem",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:".5rem",marginTop:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
            <div style={{width:"32px",height:"32px",borderRadius:"9px",flexShrink:0,background:"linear-gradient(135deg,var(--violet),var(--coral))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",fontWeight:700,color:"#fff",boxShadow:"0 2px 10px rgba(124,77,255,.35)"}}>
              {user.email?.[0]?.toUpperCase()||"S"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:".72rem",fontWeight:600,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
              <div style={{fontSize:".56rem",letterSpacing:".1em",textTransform:"uppercase",color:"var(--violet2)",fontWeight:700,marginTop:".08rem"}}>{user.role||"superuser"}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{width:"100%",padding:".35rem",background:"transparent",border:"1px solid var(--border2)",borderRadius:"7px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:".72rem",fontWeight:600,color:"var(--ink3)",cursor:"pointer",transition:"all .14s",display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor="var(--coral)";e.currentTarget.style.color="var(--coral2)"}}
            onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--ink3)"}}>
            ↩ Sign Out
          </button>
        </div>
      </aside>

      <div className="main-content" style={{overflow:tab==="tutor"?"hidden":"auto"}}>
        {tab==="assessment"&&<AssessmentTab />}
        {tab==="learning"&&<SmartLearningTab />}
        {tab==="tutor"&&<TutorTab />}
        {tab==="library"&&<StudyLibraryTab isSuperuser={isSuperuser} studentGrade="Grade 11" studentCurriculum="CAPS" />}
        {tab==="analytics"&&isSuperuser&&<AnalyticsTab />}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:"3rem",textAlign:"center",gap:"1rem"}}>
      <div style={{fontSize:"3rem"}}>📊</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"var(--ink)"}}>Analytics</div>
      <div style={{color:"var(--ink2)",maxWidth:"38ch",lineHeight:1.7,fontSize:".95rem"}}>
        Login events and usage patterns will appear here in the next update.
      </div>
    </div>
  );
}
