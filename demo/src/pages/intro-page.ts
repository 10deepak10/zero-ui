import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('intro-page')
export class IntroPage extends LitElement {
  @state() private isHovering = false;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1e 100%);
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #fff;
      overflow: hidden;
      position: relative;
    }

    .hero-section {
      position: relative;
      height: 50dvh;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .canvas-container {
      position: absolute;
      inset: 0;
      cursor: pointer;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .content {
      position: relative;
      z-index: 10;
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 24px;
    }

    .tagline {
      text-align: center;
      font-size: 1.5rem;
      color: #8b9dc3;
      font-weight: 300;
      letter-spacing: 1px;
      margin-bottom: 40px;
    }

    .description {
      text-align: center;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #6b7d9f;
      max-width: 800px;
      margin: 0 auto 60px;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 80px;
    }

    .btn {
      padding: 16px 40px;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      box-shadow: 0 8px 32px rgba(59,130,246,0.3);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 48px rgba(59,130,246,0.5);
    }

    .btn-secondary {
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      color: #fff;
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .feature-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      padding: 40px;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s ease;
    }

    .feature-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(59,130,246,.1), rgba(139,92,246,.1));
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      border-color: rgba(59,130,246,0.3);
      box-shadow: 0 20px 60px rgba(59,130,246,0.2);
    }

    .feature-card:hover::before {
      opacity: 1;
    }

    .feature-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 20px;
      transition: transform 0.4s ease;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .feature-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .feature-description {
      font-size: 1.05rem;
      color: #8b9dc3;
      line-height: 1.7;
    }

    @media (max-width: 768px) {
      .tagline { font-size: 1.2rem; }
      .description { font-size: 1rem; }
      .features { grid-template-columns: 1fr; }
    }
  `;

  firstUpdated() {
    this.initCanvas();
  }

  initCanvas() {
    const canvas = this.renderRoot.querySelector('#hero-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const container = canvas.parentElement!;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ------------------------------------------------------
       PARTICLE SETTINGS
    ------------------------------------------------------ */
    const PARTICLE_SIZE = 1;
    const PARTICLE_COUNT = 400;
    const particles: any[] = [];

    let mouse = { x: null as number | null, y: null as number | null };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseenter', () => this.isHovering = true);
    canvas.addEventListener('mouseleave', () => {
      this.isHovering = false;
      mouse.x = mouse.y = null;
    });

    /* ------------------------------------------------------
       HELPER: GET PARTICLE POSITIONS OF TEXT
    ------------------------------------------------------ */
    const getTextPoints = (text: string) => {
      const temp = document.createElement("canvas");
      const tctx = temp.getContext("2d")!;
      temp.width = canvas.width;
      temp.height = canvas.height;

      const fontSize = canvas.width * 0.18;
      tctx.font = `bold ${fontSize}px Segoe UI`;
      tctx.fillStyle = "#fff";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";

      tctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const img = tctx.getImageData(0, 0, canvas.width, canvas.height);
      const buffer = [];

      for (let y = 0; y < img.height; y += 6) {
        for (let x = 0; x < img.width; x += 6) {
          const alpha = img.data[(y * img.width + x) * 4 + 3];
          if (alpha > 180) buffer.push({ x, y });
        }
      }
      return buffer;
    };

    /* ------------------------------------------------------
       SHAPES → Z, 0, UI
    ------------------------------------------------------ */
    const shapes = {
      zero: [] as any[],
      // circle: [],
      Z: [] as any[],
      UI: [] as any[],
    };

    const initShapes = () => {
      // // circle shape
      // const cx = canvas.width / 2;
      // const cy = canvas.height / 2;
      // const r = Math.min(canvas.width, canvas.height) * 0.25;

      // for (let i = 0; i < PARTICLE_COUNT; i++) {
      //   const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      //   shapes.circle.push({
      //     x: cx + Math.cos(angle) * r,
      //     y: cy + Math.sin(angle) * r,
      //   });
      // }

      // text shapes
      shapes.zero = getTextPoints("0");
      shapes.Z = getTextPoints("Z");
      shapes.UI = getTextPoints("UI");
    };

    initShapes();

    /* ------------------------------------------------------
       SET TARGET SHAPE ON HOVER
    ------------------------------------------------------ */
    type ShapeKeys = keyof typeof shapes; // "zero" | "Z" | "UI"
    let targetShape: typeof shapes[ShapeKeys] = shapes.zero;
    const morphOrder: ShapeKeys[] = ["Z", "UI"];
    let currentMorphIndex = 0;

    canvas.addEventListener("mouseenter", () => {
      targetShape = shapes[morphOrder[currentMorphIndex]];

      currentMorphIndex = (currentMorphIndex + 1) % morphOrder.length;
    });

    canvas.addEventListener("mouseleave", () => {
      targetShape = shapes.zero;
    });

    /* ------------------------------------------------------
       INIT PARTICLES
    ------------------------------------------------------ */
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const base = shapes.zero[i % shapes.zero.length];
      particles.push({
        x: base.x,
        y: base.y,
        vx: 0,
        vy: 0,
        size: PARTICLE_SIZE,
      });
    }

    /* ------------------------------------------------------
       RENDER LOOP (GLASS GLOW + MORPH)
    ------------------------------------------------------ */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        const target = targetShape[i % targetShape.length];

        // Morph ease
        p.vx += (target.x - p.x) * 0.06;
        p.vy += (target.y - p.y) * 0.06;

        // Repel effect—very subtle
        if (mouse.x) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const force = Math.min(60 / (dist + 20), 0.1);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // damping
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        /* GLASSMORPHISM PARTICLE */
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        gradient.addColorStop(0, "rgba(255,255,255,0.95)");
        gradient.addColorStop(0.3, "rgba(120,170,255,0.45)");
        gradient.addColorStop(1, "rgba(100,100,255,0)");

        ctx.globalCompositeOperation = "lighter"; // neon add-glow
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(animate);
    };

    animate();
  }


  render() {
    return html`
      <div class="hero-section">
        <div class="canvas-container">
          <canvas id="hero-canvas"></canvas>
        </div>
      </div>

      <div class="content">
        <h2 class="tagline">HIGH-PERFORMANCE WEB COMPONENTS</h2>

        <p class="description">
          Zero UI delivers blazing-fast, tree-shakeable components built with Lit. 
          Designed for the modern web with zero framework overhead and universal compatibility.
        </p>

        <div class="cta-buttons">
          <button class="btn btn-primary">Get Started</button>
          <button class="btn btn-secondary">Documentation</button>
        </div>

        <div class="features">
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h3 class="feature-title">Blazing Fast</h3>
            <p class="feature-description">
              Built on native web standards with zero overhead. Lightning-fast performance that scales effortlessly.
            </p>
          </div>

          <div class="feature-card">
            <span class="feature-icon">🌲</span>
            <h3 class="feature-title">Tree-Shakeable</h3>
            <p class="feature-description">
              Modular architecture ensures you only bundle what you use. Keep your applications lean and efficient.
            </p>
          </div>

          <div class="feature-card">
            <span class="feature-icon">🔌</span>
            <h3 class="feature-title">Universal</h3>
            <p class="feature-description">
              Works with React, Angular, Vue, and vanilla HTML. Truly framework-agnostic.
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
