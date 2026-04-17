import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostData {
  id: string;
  title: string;
  tags: string[];
  date: string;
  description: string;
  url: string;
  featured?: boolean;
}

type VisualStyle = 'neural' | 'constellation' | 'circuit' | 'synaptic';

interface Node extends PostData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  labelCode: string;
}

interface Edge {
  s: number;
  t: number;
  strength: number;
  sharedTags: string[];
}

interface Transform {
  tx: number;
  ty: number;
  scale: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  Azure:          '#2196F3',
  AI:             '#4EC9B0',
  Governance:     '#C19CD8',
  Leadership:     '#4DA6FF',
  Operations:     '#FFBD2E',
  Architecture:   '#FF7043',
  Anxiety:        '#FF5F56',
  Infrastructure: '#27CA3F',
  'Log Analytics':'#569CD6',
  Development:    '#9BA3B8',
  Platform:       '#66B3FF',
  Observability:  '#F48FB1',
};

const DEFAULT_COLOR = '#7d8590';

function tagColor(tag: string): string {
  return TAG_COLORS[tag] ?? DEFAULT_COLOR;
}

function primaryTagColor(tags: string[]): string {
  for (const t of tags) {
    if (TAG_COLORS[t]) return TAG_COLORS[t];
  }
  return DEFAULT_COLOR;
}

// ─── Force simulation ─────────────────────────────────────────────────────────

const CHARGE    = 12000;
const SPRING_K  = 0.008;
const REST_LEN  = 260;
const GRAVITY   = 0.008;
const DAMPING   = 0.75;
const ALPHA_DEC = 0.002;

function initNodes(posts: PostData[]): Node[] {
  const angle = (2 * Math.PI) / posts.length;
  return posts.map((p, i) => ({
    ...p,
    x: Math.cos(angle * i) * 380 + (Math.random() - 0.5) * 60,
    y: Math.sin(angle * i) * 380 + (Math.random() - 0.5) * 60,
    vx: 0,
    vy: 0,
    radius: 8 + Math.min(p.tags.length * 2, 8),
    labelCode: p.id.slice(0, 8).toUpperCase().replace(/-/g, '_'),
  }));
}

function buildEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const shared = nodes[i].tags.filter(t => nodes[j].tags.includes(t));
      if (shared.length > 0) {
        edges.push({ s: i, t: j, strength: shared.length, sharedTags: shared });
      }
    }
  }
  return edges;
}

function stepSim(nodes: Node[], edges: Edge[], alpha: number): void {
  const n = nodes.length;

  // repulsion
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
      const force = (CHARGE * alpha) / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      nodes[i].vx -= fx;
      nodes[i].vy -= fy;
      nodes[j].vx += fx;
      nodes[j].vy += fy;
    }
  }

  // spring attraction along edges
  for (const e of edges) {
    const a = nodes[e.s], b = nodes[e.t];
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
    const f = SPRING_K * (dist - REST_LEN) * e.strength;
    const fx = (dx / dist) * f;
    const fy = (dy / dist) * f;
    a.vx += fx; a.vy += fy;
    b.vx -= fx; b.vy -= fy;
  }

  // centering gravity
  for (const nd of nodes) {
    nd.vx -= nd.x * GRAVITY * alpha;
    nd.vy -= nd.y * GRAVITY * alpha;
    nd.vx *= DAMPING;
    nd.vy *= DAMPING;
    nd.x += nd.vx;
    nd.y += nd.vy;
  }
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function drawEdge(
  ctx: CanvasRenderingContext2D,
  ax: number, ay: number,
  bx: number, by: number,
  style: VisualStyle,
  color: string,
  alpha: number,
  pulse: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;

  if (style === 'synaptic') {
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
  } else if (style === 'neural') {
    ctx.lineWidth = 1;
  } else {
    ctx.lineWidth = 0.8;
  }
  ctx.strokeStyle = color;

  ctx.beginPath();
  if (style === 'neural' || style === 'synaptic') {
    const cx = (ax + bx) / 2 + (ay - by) * 0.25;
    const cy = (ay + by) / 2 + (bx - ax) * 0.25;
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo(cx, cy, bx, by);
  } else if (style === 'circuit') {
    const mx = ax + (bx - ax) * 0.5;
    ctx.moveTo(ax, ay);
    ctx.lineTo(mx, ay);
    ctx.lineTo(mx, by);
    ctx.lineTo(bx, by);
  } else {
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  ctx.stroke();

  // pulse dot
  if (style === 'synaptic' || style === 'neural') {
    const t = (pulse % 1);
    let px: number, py: number;
    if (style === 'neural') {
      const cx = (ax + bx) / 2 + (ay - by) * 0.25;
      const cy = (ay + by) / 2 + (bx - ax) * 0.25;
      const u = t;
      px = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * cx + u * u * bx;
      py = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * cy + u * u * by;
    } else {
      px = ax + (bx - ax) * t;
      py = ay + (by - ay) * t;
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  nd: Node,
  style: VisualStyle,
  color: string,
  dimmed: boolean,
  hovered: boolean,
  tick: number,
) {
  const r = nd.radius;
  ctx.save();
  ctx.globalAlpha = dimmed ? 0.2 : 1;

  // outer glow for featured
  if (nd.featured || hovered) {
    ctx.shadowColor = color;
    ctx.shadowBlur = hovered ? 20 : 12;
  }

  // orbital ring for featured
  if (nd.featured) {
    const ringR = r + 6 + Math.sin(tick * 0.04) * 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = dimmed ? 0.1 : 0.4;
    ctx.beginPath();
    ctx.arc(nd.x, nd.y, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = dimmed ? 0.2 : 1;
  }

  // node fill
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
  ctx.fill();

  // inner dot
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.arc(nd.x, nd.y, r * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // label
  ctx.shadowBlur = 0;
  ctx.globalAlpha = dimmed ? 0.15 : 0.75;
  ctx.fillStyle = '#E8E6E3';
  ctx.font = `600 9px 'Fira Code', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(nd.labelCode.slice(0, 10), nd.x, nd.y + r + 10);

  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  posts: PostData[];
}

const STYLES: { id: VisualStyle; label: string }[] = [
  { id: 'neural',         label: 'Neural'        },
  { id: 'constellation',  label: 'Constellation' },
  { id: 'circuit',        label: 'Circuit'       },
  { id: 'synaptic',       label: 'Synaptic'      },
];

export default function ArchitectureMap({ posts }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const nodesRef     = useRef<Node[]>([]);
  const edgesRef     = useRef<Edge[]>([]);
  const alphaRef     = useRef(1);
  const rafRef       = useRef<number>(0);
  const tickRef      = useRef(0);
  const transformRef = useRef<Transform>({ tx: 0, ty: 0, scale: 1 });
  const sizeRef      = useRef({ w: 800, h: 600 });
  const dragRef      = useRef<{ nodeIdx: number | null; panStart: { x: number; y: number } | null }>({
    nodeIdx: null, panStart: null,
  });
  const pulseRef     = useRef(0);

  const [style,      setStyle]      = useState<VisualStyle>('neural');
  const [activeTag,  setActiveTag]  = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx,setSelectedIdx]= useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  // Collect all unique tags sorted by frequency
  const allTags = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach(p => p.tags.forEach(t => { freq[t] = (freq[t] ?? 0) + 1; }));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [posts]);

  // Init nodes + edges once
  useEffect(() => {
    nodesRef.current = initNodes(posts);
    edgesRef.current = buildEdges(nodesRef.current);
    alphaRef.current = 1;
  }, [posts]);

  // Observe canvas wrapper size
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setCanvasSize({ w: Math.floor(width), h: Math.floor(height) });
        sizeRef.current = { w: Math.floor(width), h: Math.floor(height) };
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // ─── Render loop ────────────────────────────────────────────────────────────
  const styleRef    = useRef(style);
  const activeTagRef= useRef(activeTag);
  const hoveredRef  = useRef(hoveredIdx);
  useEffect(() => { styleRef.current = style; },      [style]);
  useEffect(() => { activeTagRef.current = activeTag; }, [activeTag]);
  useEffect(() => { hoveredRef.current = hoveredIdx; },  [hoveredIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function frame() {
      rafRef.current = requestAnimationFrame(frame);
      tickRef.current++;
      pulseRef.current = (pulseRef.current + 0.004) % 1;

      const { w, h } = sizeRef.current;
      const tr       = transformRef.current;
      const curStyle = styleRef.current;
      const curTag   = activeTagRef.current;
      const curHov   = hoveredRef.current;
      const nodes    = nodesRef.current;
      const edges    = edgesRef.current;
      const alpha    = alphaRef.current;

      // step physics
      if (alpha > 0.001) {
        stepSim(nodes, edges, alpha);
        alphaRef.current = Math.max(0, alpha - ALPHA_DEC);
      }

      // clear
      ctx.clearRect(0, 0, w, h);

      // world transform
      ctx.save();
      ctx.translate(w / 2 + tr.tx, h / 2 + tr.ty);
      ctx.scale(tr.scale, tr.scale);

      // draw edges
      for (const e of edges) {
        const a = nodes[e.s], b = nodes[e.t];
        const tagMatch = !curTag || e.sharedTags.includes(curTag);
        const edgeAlpha = tagMatch ? (curStyle === 'synaptic' ? 0.6 : 0.35) : 0.04;
        const col = tagColor(e.sharedTags[0]);
        const edgePulse = (pulseRef.current + e.s * 0.07 + e.t * 0.03) % 1;
        drawEdge(ctx, a.x, a.y, b.x, b.y, curStyle, col, edgeAlpha, edgePulse);
      }

      // draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        const col = primaryTagColor(nd.tags);
        const tagMatch = !curTag || nd.tags.includes(curTag);
        const dimmed   = !!curTag && !tagMatch;
        const hovered  = i === curHov;
        drawNode(ctx, nd, curStyle, col, dimmed, hovered, tickRef.current);
      }

      ctx.restore();
    }

    frame();
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasSize]);  // restart loop when canvas resizes

  // ─── Pointer interactions ───────────────────────────────────────────────────

  function worldPos(clientX: number, clientY: number) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const { w, h } = sizeRef.current;
    const tr = transformRef.current;
    const cx = (clientX - rect.left - w / 2 - tr.tx) / tr.scale;
    const cy = (clientY - rect.top  - h / 2 - tr.ty) / tr.scale;
    return { x: cx, y: cy };
  }

  function hitTest(wx: number, wy: number): number | null {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const nd = nodes[i];
      const dx = wx - nd.x, dy = wy - nd.y;
      if (dx * dx + dy * dy <= (nd.radius + 4) ** 2) return i;
    }
    return null;
  }

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const { x, y } = worldPos(e.clientX, e.clientY);
    const idx = hitTest(x, y);
    if (idx !== null) {
      dragRef.current.nodeIdx = idx;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      dragRef.current.panStart = { x: e.clientX - transformRef.current.tx, y: e.clientY - transformRef.current.ty };
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const { x, y } = worldPos(e.clientX, e.clientY);
    const { nodeIdx, panStart } = dragRef.current;

    if (nodeIdx !== null) {
      nodesRef.current[nodeIdx].x = x;
      nodesRef.current[nodeIdx].y = y;
      nodesRef.current[nodeIdx].vx = 0;
      nodesRef.current[nodeIdx].vy = 0;
      alphaRef.current = Math.max(alphaRef.current, 0.1);
    } else if (panStart) {
      transformRef.current = {
        ...transformRef.current,
        tx: e.clientX - panStart.x,
        ty: e.clientY - panStart.y,
      };
    } else {
      const idx = hitTest(x, y);
      setHoveredIdx(idx);
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const { nodeIdx } = dragRef.current;
    if (nodeIdx === null && !dragRef.current.panStart) {
      const { x, y } = worldPos(e.clientX, e.clientY);
      const idx = hitTest(x, y);
      setSelectedIdx(prev => (prev === idx ? null : idx));
    }
    if (nodeIdx !== null) {
      // small movement = click to select
      const { x, y } = worldPos(e.clientX, e.clientY);
      const nd = nodesRef.current[nodeIdx];
      if (Math.abs(nd.x - x) < 5 && Math.abs(nd.y - y) < 5) {
        setSelectedIdx(prev => (prev === nodeIdx ? null : nodeIdx));
      }
    }
    dragRef.current = { nodeIdx: null, panStart: null };
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    transformRef.current = {
      ...transformRef.current,
      scale: Math.max(0.3, Math.min(3, transformRef.current.scale * factor)),
    };
  }, []);

  // ─── Tooltip position ───────────────────────────────────────────────────────

  function nodeScreenPos(idx: number) {
    const nd  = nodesRef.current[idx];
    const tr  = transformRef.current;
    const { w, h } = sizeRef.current;
    return {
      x: (nd.x * tr.scale) + w / 2 + tr.tx,
      y: (nd.y * tr.scale) + h / 2 + tr.ty,
    };
  }

  const selectedNode = selectedIdx !== null ? nodesRef.current[selectedIdx] : null;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Style picker */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(22,27,34,0.8)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'Fira Code',monospace", alignSelf: 'center', marginRight: 4 }}>
          render.style:
        </span>
        {STYLES.map(s => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            style={{
              padding: '3px 10px',
              fontSize: 11,
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: style === s.id ? 'var(--accent-color)' : 'transparent',
              color: style === s.id ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${style === s.id ? 'var(--accent-color)' : 'var(--border-color)'}`,
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-secondary)', alignSelf: 'center', fontFamily: "'Fira Code',monospace" }}>
          {posts.length} nodes · {edgesRef.current.length} edges
        </div>
      </div>

      {/* Main body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 0 }}>

        {/* Legend */}
        <div style={{
          borderRight: '1px solid var(--border-color)',
          padding: '16px 14px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          background: 'rgba(13,17,23,0.6)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: "'Fira Code',monospace", marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2 }}>
            Tags
          </div>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(prev => prev === tag ? null : tag)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: activeTag === tag ? `${tagColor(tag)}22` : 'transparent',
                border: `1px solid ${activeTag === tag ? tagColor(tag) : 'transparent'}`,
                borderRadius: 4,
                padding: '4px 8px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 150ms ease',
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: tagColor(tag),
                boxShadow: activeTag === tag ? `0 0 6px ${tagColor(tag)}` : 'none',
              }} />
              <span style={{ fontSize: 12, color: activeTag === tag ? tagColor(tag) : 'var(--text-secondary)', fontWeight: 600 }}>
                {tag}
              </span>
            </button>
          ))}
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              style={{
                marginTop: 8, padding: '4px 8px',
                fontSize: 10, fontFamily: "'Fira Code',monospace",
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 4, cursor: 'pointer',
              }}
            >
              clear filter
            </button>
          )}
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)', fontSize: 10, color: 'var(--text-secondary)', fontFamily: "'Fira Code',monospace", lineHeight: 1.6 }}>
            scroll: zoom<br />
            drag node: pin<br />
            drag bg: pan<br />
            click: open
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={wrapRef}
          style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            style={{ display: 'block', cursor: 'crosshair' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => setHoveredIdx(null)}
            onWheel={onWheel}
          />

          {/* Hover tooltip */}
          {hoveredIdx !== null && dragRef.current.nodeIdx === null && (() => {
            const nd = nodesRef.current[hoveredIdx];
            if (!nd) return null;
            const pos = nodeScreenPos(hoveredIdx);
            return (
              <div style={{
                position: 'absolute',
                left: Math.min(pos.x + 14, canvasSize.w - 220),
                top: Math.max(pos.y - 60, 8),
                background: 'rgba(22,27,34,0.95)',
                border: `1px solid ${primaryTagColor(nd.tags)}`,
                borderRadius: 8,
                padding: '8px 12px',
                maxWidth: 200,
                pointerEvents: 'none',
                boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
                zIndex: 10,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.3, marginBottom: 4 }}>
                  {nd.title}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {nd.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 10, padding: '1px 5px',
                      borderRadius: 3,
                      background: `${tagColor(t)}22`,
                      color: tagColor(t),
                      border: `1px solid ${tagColor(t)}44`,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Selected node drawer */}
          {selectedNode && (
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              width: 280,
              background: 'rgba(13,17,23,0.97)',
              borderLeft: `1px solid ${primaryTagColor(selectedNode.tags)}`,
              display: 'flex', flexDirection: 'column',
              zIndex: 20,
              boxShadow: `-8px 0 32px rgba(0,0,0,0.5)`,
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{
                  fontSize: 10, fontFamily: "'Fira Code',monospace",
                  color: primaryTagColor(selectedNode.tags),
                  letterSpacing: 2, textTransform: 'uppercase',
                }}>
                  {selectedNode.labelCode}
                </span>
                <button
                  onClick={() => setSelectedIdx(null)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4,
                  }}
                >✕</button>
              </div>
              <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif", fontSize: 14,
                  fontWeight: 700, color: 'var(--text-heading)',
                  lineHeight: 1.4, marginBottom: 12, margin: '0 0 12px',
                }}>
                  {selectedNode.title}
                </h3>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, fontFamily: "'Fira Code',monospace" }}>
                  {selectedNode.date}
                </div>
                {selectedNode.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {selectedNode.description}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 20 }}>
                  {selectedNode.tags.map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTag(prev => prev === t ? null : t)}
                      style={{
                        fontSize: 11, padding: '2px 7px',
                        borderRadius: 3,
                        background: `${tagColor(t)}22`,
                        color: tagColor(t),
                        border: `1px solid ${tagColor(t)}44`,
                        cursor: 'pointer',
                      }}
                    >{t}</button>
                  ))}
                </div>
                <a
                  href={selectedNode.url}
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '8px 16px',
                    background: primaryTagColor(selectedNode.tags),
                    color: '#000',
                    borderRadius: 6,
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: 2, textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'opacity 150ms ease',
                  }}
                >
                  Read Article →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
