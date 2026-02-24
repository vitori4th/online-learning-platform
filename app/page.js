"use client";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

const features = [
  { icon: "⚡", title: "Cursos gerados em segundos", desc: "Digite o tema e nossa IA cria um curso completo com módulos, aulas e exercícios instantaneamente." },
  { icon: "🎯", title: "Personalizado para você", desc: "Cada curso é adaptado ao seu nível, ritmo e objetivos. Sem conteúdo genérico." },
  { icon: "📊", title: "Acompanhe seu progresso", desc: "Dashboard completo com métricas, certificados e histórico de aprendizado." },
  { icon: "🔄", title: "Aprenda fazendo", desc: "Exercícios práticos, quizzes e projetos reais integrados em cada módulo." },
];

const courses = [
  { emoji: "🎨", title: "UI/UX Design Masterclass", level: "Intermediário", students: "2.4k" },
  { emoji: "⚛️", title: "React & Next.js Completo", level: "Avançado", students: "3.1k" },
  { emoji: "🧠", title: "Machine Learning", level: "Avançado", students: "1.8k" },
  { emoji: "📊", title: "Data Science com Python", level: "Iniciante", students: "4.2k" },
  { emoji: "🔐", title: "Cybersecurity Essentials", level: "Intermediário", students: "1.2k" },
  { emoji: "🚀", title: "DevOps & Cloud AWS", level: "Avançado", students: "2.7k" },
];

const testimonials = [
  { name: "Ana Souza", role: "Designer", text: "Criei um curso de Figma em 30 segundos. A qualidade do conteúdo me surpreendeu.", avatar: "A" },
  { name: "Carlos Lima", role: "Dev Backend", text: "Aprendi Kubernetes do zero com um curso gerado especialmente para o meu nível.", avatar: "C" },
  { name: "Mariana Reis", role: "Product Manager", text: "A melhor plataforma de aprendizado que já usei. Rápida, precisa e personalizada.", avatar: "M" },
];

export default function Home() {
  const [topic, setTopic] = useState("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f4f4f6;
          --white: #ffffff;
          --border: #e8e8ed;
          --purple-dark: oklch(0.208 0.042 265.755);
          --purple: #312e81;
          --purple-mid: #4338ca;
          --purple-light: #ede9fe;
          --purple-text: #4f46e5;
          --text: #111827;
          --muted: #6b7280;
          --muted2: #9ca3af;
        }

        body {
          background: var(--white);
          color: var(--text);
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
        }

        /* NAV */
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 60px;
          height: 64px;
          border-bottom: 1px solid var(--border);
          background: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 36px; height: 36px;
          background: var(--purple-dark);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          font-size: 16px; font-weight: 800;
        }

        .nav-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.3px;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }

        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s;
        }

        .nav-links a:hover { color: var(--text); }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-outline {
          padding: 8px 18px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: transparent;
          color: var(--text);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-outline:hover { border-color: var(--purple-mid); color: var(--purple-mid); }

        .btn-primary {
          padding: 8px 18px;
          border: none;
          border-radius: 8px;
          background: var(--purple-dark);
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: var(--purple); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(31,27,75,0.2); }

        /* HERO */
        .hero {
          background: linear-gradient(160deg, var(--purple-dark) 0%, var(--purple) 50%, var(--purple-mid) 100%);
          padding: 90px 60px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          top: -100px; left: -100px;
          border-radius: 50%;
        }

        .hero::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          bottom: -80px; right: -60px;
          border-radius: 50%;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.9);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 28px;
          letter-spacing: 0.04em;
          position: relative;
          z-index: 1;
        }

        .badge-dot {
          width: 6px; height: 6px;
          background: #a5f3a5;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-title {
          font-size: clamp(36px, 5.5vw, 62px);
          font-weight: 800;
          color: white;
          letter-spacing: -2px;
          line-height: 1.1;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .hero-title span {
          color: rgba(255,255,255,0.55);
        }

        .hero-sub {
          font-size: 17px;
          color: rgba(255,255,255,0.65);
          max-width: 500px;
          margin: 0 auto 40px;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        .hero-input-wrap {
          display: flex;
          max-width: 520px;
          margin: 0 auto 16px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.25);
          position: relative;
          z-index: 1;
        }

        .hero-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 16px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: var(--text);
          background: transparent;
        }

        .hero-input::placeholder { color: var(--muted2); }

        .hero-btn {
          padding: 14px 24px;
          background: var(--purple-dark);
          color: white;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .hero-btn:hover { background: var(--purple); }

        .hero-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          position: relative;
          z-index: 1;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 56px;
          position: relative;
          z-index: 1;
        }

        .hero-stat-num {
          font-size: 26px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .hero-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 3px;
          font-weight: 500;
        }

        /* SECTION WRAPPER */
        .section {
          padding: 72px 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-tag {
          display: inline-block;
          background: var(--purple-light);
          color: var(--purple-text);
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .section-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -1px;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .section-sub {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 48px;
        }

        /* HOW IT WORKS */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }

        .step {
          background: white;
          padding: 36px 32px;
        }

        .step-num {
          font-size: 13px;
          font-weight: 700;
          color: var(--purple-text);
          background: var(--purple-light);
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }

        .step-icon { font-size: 28px; margin-bottom: 14px; display: block; }

        .step-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.3px;
          margin-bottom: 10px;
        }

        .step-desc { font-size: 13.5px; color: var(--muted); line-height: 1.7; }

        /* FEATURES */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .feature-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 32px;
          transition: all 0.2s;
        }
        .feature-card:hover {
          border-color: #c7d2fe;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(79,70,229,0.08);
        }

        .feature-icon {
          width: 44px; height: 44px;
          background: var(--purple-light);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          margin-bottom: 18px;
        }

        .feature-title { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; margin-bottom: 8px; }
        .feature-desc { font-size: 13.5px; color: var(--muted); line-height: 1.7; }

        /* COURSES */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .course-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .course-card:hover {
          border-color: #c7d2fe;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79,70,229,0.07);
        }

        .course-emoji {
          width: 44px; height: 44px;
          background: var(--purple-light);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .course-info { flex: 1; }
        .course-title { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; margin-bottom: 6px; line-height: 1.4; }

        .course-meta { display: flex; gap: 10px; align-items: center; }

        .level-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 100px;
          background: var(--purple-light);
          color: var(--purple-text);
        }

        .students { font-size: 11px; color: var(--muted2); }

        /* TESTIMONIALS */
        .testimonials-bg {
          background: var(--bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .testimonial-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px;
        }

        .testimonial-text {
          font-size: 14px;
          color: var(--text);
          line-height: 1.7;
          margin-bottom: 20px;
          font-style: italic;
        }

        .testimonial-author { display: flex; align-items: center; gap: 10px; }

        .avatar {
          width: 36px; height: 36px;
          background: var(--purple-dark);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        .author-name { font-size: 13px; font-weight: 700; color: var(--text); }
        .author-role { font-size: 12px; color: var(--muted); }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 60%, var(--purple-mid) 100%);
          padding: 80px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          top: -100px; right: -80px;
          border-radius: 50%;
        }

        .cta-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: white;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .cta-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
        }

        .cta-btn {
          padding: 14px 32px;
          background: white;
          color: var(--purple-dark);
          border: none;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          z-index: 1;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }

        /* FOOTER */
        footer {
          padding: 28px 60px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
        }

        .footer-logo { display: flex; align-items: center; gap: 8px; }
        .footer-copy { font-size: 13px; color: var(--muted); }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.15s; }
        .footer-links a:hover { color: var(--text); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fu { animation: fadeUp 0.5s ease forwards; }
        .fu1 { animation-delay: 0.05s; opacity: 0; }
        .fu2 { animation-delay: 0.15s; opacity: 0; }
        .fu3 { animation-delay: 0.25s; opacity: 0; }
        .fu4 { animation-delay: 0.35s; opacity: 0; }

        @media (max-width: 900px) {
          nav { padding: 0 24px; }
          .nav-links { display: none; }
          .hero { padding: 60px 24px; }
          .hero-stats { gap: 28px; }
          .section { padding: 52px 24px; }
          .steps { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .courses-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .cta { padding: 60px 24px; }
          footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#">
          <div className="nav-logo-icon">C</div>
          <span className="nav-logo-text">CourseAI</span>
        </a>
        <ul className="nav-links">
          <li><a href="#how">Como funciona</a></li>
          <li><a href="#features">Recursos</a></li>
          <li><a href="#explore">Explore</a></li>
          <li><a href="#blog">Depoimentos</a></li>
        </ul>
        <div className="nav-right">
          <a href='/workspace'>
            <button className="btn-outline">Entrar</button>
          </a>
          <button className="btn-primary">Começar grátis</button>
          <UserButton />
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge fu fu1">
          <span className="badge-dot" />
          Plataforma de aprendizado com IA
        </div>

        <h1 className="hero-title fu fu2">
          Aprenda qualquer coisa,<br />
          <span>do jeito certo.</span>
        </h1>

        <p className="hero-sub fu fu3">
          Digite o que você quer aprender e nossa IA gera um curso completo,
          personalizado para o seu nível, em segundos.
        </p>

        <div className="hero-input-wrap fu fu4">
          <input
            className="hero-input"
            placeholder="Ex: Aprenda React do zero..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button className="hero-btn">Gerar Curso →</button>
        </div>
        <p className="hero-hint fu fu4">Primeiro curso grátis · Sem cartão de crédito</p>

        <div className="hero-stats fu fu4">
          {[
            { num: "47k+", label: "Cursos gerados" },
            { num: "12k+", label: "Estudantes ativos" },
            { num: "4.9★", label: "Avaliação média" },
          ].map((s) => (
            <div key={s.label}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }} id="how">
        <div className="section">
          <div className="section-tag">Como funciona</div>
          <h2 className="section-title">Do zero ao curso em 3 passos.</h2>
          <p className="section-sub">Simples, rápido e poderoso. Sem configurações complicadas.</p>

          <div className="steps">
            {[
              { num: "1", icon: "✍️", title: "Descreva o tema", desc: "Digite qualquer assunto que você quer aprender — da programação à gastronomia, sem limites." },
              { num: "2", icon: "⚡", title: "IA cria o curso", desc: "Nossa IA estrutura módulos, aulas, exercícios e quizzes personalizados para o seu perfil." },
              { num: "3", icon: "🎯", title: "Aprenda no seu ritmo", desc: "Acesse em qualquer dispositivo, acompanhe seu progresso e peça aprofundamentos." },
            ].map((s) => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <span className="step-icon">{s.icon}</span>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="section" id="features">
        <div className="section-tag">Recursos</div>
        <h2 className="section-title">Feito para quem não<br />tem tempo a perder.</h2>
        <p className="section-sub">Tudo que você precisa para aprender de forma eficiente e consistente.</p>

        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COURSES */}
      <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} id="explore">
        <div className="section">
          <div className="section-tag">Explore</div>
          <h2 className="section-title">Cursos já criados<br />pela comunidade.</h2>
          <p className="section-sub">Veja exemplos do que já foi gerado e comece a partir deles.</p>

          <div className="courses-grid">
            {courses.map((c) => (
              <div className="course-card" key={c.title}>
                <div className="course-emoji">{c.emoji}</div>
                <div className="course-info">
                  <div className="course-title">{c.title}</div>
                  <div className="course-meta">
                    <span className="level-tag">{c.level}</span>
                    <span className="students">👥 {c.students}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="testimonials-bg" id="blog">
        <div className="section">
          <div className="section-tag">Depoimentos</div>
          <h2 className="section-title">O que nossos alunos dizem.</h2>
          <p className="section-sub" style={{ marginBottom: 36 }}>Mais de 12 mil pessoas já transformaram a forma de aprender.</p>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="testimonial-text">"{t.text}"</div>
                <div className="testimonial-author">
                  <div className="avatar">{t.avatar}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2 className="cta-title">Comece a aprender hoje.<br />Grátis.</h2>
        <p className="cta-sub">Seu primeiro curso gerado pela IA sem custo. Sem cartão.</p>
        <button className="cta-btn">Criar meu primeiro curso →</button>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <div className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: 13 }}>C</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>CourseAI</span>
        </div>
        <span className="footer-copy">© 2026 CourseAI. Todos os direitos reservados.</span>
        <div className="footer-links">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Contato</a>
        </div>
      </footer>
    </>
  );
}
