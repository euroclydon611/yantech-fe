import { useState, useEffect, useRef, useCallback } from "react";
import LeafletMap, { type MarkerData } from "../../components/LeafletMap";

const API_BASE = `${import.meta.env.VITE_MAIN_SERVER}/api/public-view`;
const HEADER_H = 56;

interface PublicPermit {
  permitNumber: string;
  permitType: string;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED" | "REVOKED";
  issueDate: string;
  expiryDate: string;
  latitude: number;
  longitude: number;
  companyName: string | null;
  issuingEntity: string | null;
}

interface PublicStats {
  total: number;
  active: number;
  expired: number;
  suspended: number;
}

const S: Record<string, { label: string; ring: string; dot: string; badge: string; text: string }> = {
  ACTIVE:    { label: "Active",    ring: "#1b5e20", dot: "#4caf50", badge: "#e8f5e9", text: "#1b5e20" },
  EXPIRED:   { label: "Expired",   ring: "#c62828", dot: "#ef5350", badge: "#ffebee", text: "#c62828" },
  SUSPENDED: { label: "Suspended", ring: "#e65100", dot: "#ff7043", badge: "#fff3e0", text: "#e65100" },
  REVOKED:   { label: "Revoked",   ring: "#4a148c", dot: "#9c27b0", badge: "#f3e5f5", text: "#6a1b9a" },
};

const STYLES = `
@keyframes mpulse {
  0%,100% { box-shadow:0 0 0 0 rgba(76,175,80,.5); }
  60%      { box-shadow:0 0 0 8px rgba(76,175,80,0); }
}
.m-pulse { animation: mpulse 2.2s ease-in-out infinite; }
@keyframes fadeup {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0); }
}
.m-up { animation: fadeup .4s ease-out forwards; }
@keyframes shimmer {
  0%   { background-position:-700px 0; }
  100% { background-position:700px 0; }
}
.m-shimmer {
  background:linear-gradient(90deg,#e8f5e9 25%,#c8e6c9 50%,#e8f5e9 75%);
  background-size:700px 100%;
  animation:shimmer 1.5s infinite;
  border-radius:10px;
}
.m-scroll::-webkit-scrollbar { height:4px; }
.m-scroll::-webkit-scrollbar-track { background:transparent; }
.m-scroll::-webkit-scrollbar-thumb { background:#c8e6c9; border-radius:4px; }
.m-pill:hover { opacity:.82; }
`;

function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function normalizeType(t: string) {
  return (t || "").split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const EPA_OFFICES = [
  { name: "EPA Head Office",            region: "Greater Accra",  lat: 5.5572,  lng: -0.1969, hq: true  },
  { name: "Ashanti Regional Office",    region: "Ashanti",        lat: 6.6885,  lng: -1.6244, hq: false },
  { name: "Western Regional Office",    region: "Western",        lat: 4.8965,  lng: -1.7592, hq: false },
  { name: "Central Regional Office",    region: "Central",        lat: 5.1037,  lng: -1.2826, hq: false },
  { name: "Eastern Regional Office",    region: "Eastern",        lat: 6.0946,  lng: -0.2566, hq: false },
  { name: "Volta Regional Office",      region: "Volta",          lat: 6.6000,  lng:  0.4700, hq: false },
  { name: "Northern Regional Office",   region: "Northern",       lat: 9.4008,  lng: -0.8393, hq: false },
  { name: "Upper East Regional Office", region: "Upper East",     lat: 10.7855, lng: -0.8514, hq: false },
  { name: "Upper West Regional Office", region: "Upper West",     lat: 10.0607, lng: -2.5099, hq: false },
  { name: "Bono Regional Office",       region: "Bono",           lat: 7.3349,  lng: -2.3266, hq: false },
  { name: "Oti Regional Office",        region: "Oti",            lat: 7.7000,  lng:  0.0200, hq: false },
  { name: "Savannah Regional Office",   region: "Savannah",       lat: 9.0785,  lng: -1.6775, hq: false },
];

// account_balance (government building with columns) — Material Icons path
const BUILDING_PATH = "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm-7 8l-1 2h18l-1-2H3zm14-8v7h3v-7h-3zM11.5 1L2 6v2h19V6L11.5 1z";

function authorityMarkerHtml(hq: boolean) {
  const size    = hq ? 40 : 32;
  const border  = hq ? "3px solid #f59e0b" : "2px solid #d97706";
  const dot     = hq ? "#f59e0b" : "#d97706";
  const dotSize = hq ? 13 : 10;
  const iconW   = hq ? 20 : 15;
  return `
    <div style="position:relative;width:${size}px;height:${size}px">
      <div style="width:${size - 2}px;height:${size - 2}px;border-radius:50%;background:#0d3321;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 16px rgba(0,0,0,.5);border:${border}">
        <svg width="${iconW}" height="${iconW}" viewBox="0 0 24 24" fill="white">
          <path d="${BUILDING_PATH}"/>
        </svg>
      </div>
      <div style="position:absolute;bottom:0;right:0;width:${dotSize}px;height:${dotSize}px;
        border-radius:50%;background:${dot};border:2px solid #fff"></div>
    </div>`;
}

function epaMarkerHtml(status: string) {
  const meta = S[status?.toUpperCase()] ?? S.ACTIVE;
  const pulse = status === "ACTIVE" ? 'class="m-pulse"' : "";
  return `
    <div style="position:relative;width:38px;height:38px">
      <div style="width:36px;height:36px;border-radius:50%;background:#fff;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 3px 14px rgba(0,0,0,.28);border:2.5px solid ${meta.ring}">
        <img src="/images/epa-logo-no-bg.png"
          style="width:22px;height:22px;object-fit:contain;display:block" />
      </div>
      <div ${pulse} style="position:absolute;bottom:0;right:0;width:12px;height:12px;
        border-radius:50%;background:${meta.dot};border:2px solid #fff"></div>
    </div>`;
}

export default function PublicPermitMap() {
  const [permits, setPermits]     = useState<PublicPermit[]>([]);
  const [stats, setStats]         = useState<PublicStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("ALL");
  const [focused, setFocused]     = useState<number | null>(null);
  const [showOffices, setShowOffices] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const stripRef  = useRef<HTMLDivElement>(null);
  const width     = useWindowWidth();
  const isMobile  = width < 640;

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [pr, sr] = await Promise.all([
        fetch(`${API_BASE}/permits/map`,   { credentials: "omit" }),
        fetch(`${API_BASE}/permits/stats`, { credentials: "omit" }),
      ]);
      if (!pr.ok || !sr.ok) throw new Error("Service temporarily unavailable.");
      const [pd, sd] = await Promise.all([pr.json(), sr.json()]);
      setPermits(pd.data ?? []);
      setStats(sd.data ?? null);
      setLastFetch(new Date());
    } catch (e: any) {
      setError(e.message ?? "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const id = setInterval(() => fetchData(true), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchData]);

  const filtered = permits.filter(p => {
    const q = search.toLowerCase().trim();
    const ok =
      !q ||
      p.permitNumber.toLowerCase().includes(q) ||
      (p.companyName ?? "").toLowerCase().includes(q) ||
      normalizeType(p.permitType).toLowerCase().includes(q);
    return ok && (statusFilter === "ALL" || p.status === statusFilter);
  });

  const permitMarkers: MarkerData[] = filtered.map(p => ({
    lat: Number(p.latitude),
    lng: Number(p.longitude),
    status: p.status,
    iconHtml: epaMarkerHtml(p.status),
    iconSize: [38, 38] as [number, number],
    iconAnchor: [19, 19] as [number, number],
    popupHtml: `
      <div style="font-family:'Nunito',sans-serif;min-width:180px;padding:4px 2px">
        <div style="font-size:12px;font-weight:800;color:#0d1712;margin-bottom:4px;font-family:monospace">${p.permitNumber}</div>
        <div style="font-size:11.5px;font-weight:700;color:#1b5e20;margin-bottom:6px;line-height:1.3">${p.companyName ?? "—"}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <span style="font-size:10px;color:#0369a1;background:#e0f2fe;padding:2px 8px;border-radius:20px;font-weight:700">${normalizeType(p.permitType)}</span>
          <span style="font-size:10px;background:${S[p.status]?.badge ?? "#f5f5f5"};color:${S[p.status]?.text ?? "#333"};padding:2px 8px;border-radius:20px;font-weight:700">${S[p.status]?.label ?? p.status}</span>
        </div>
        <div style="margin-top:8px;padding-top:7px;border-top:1px solid #f0f0f0;display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div><div style="font-size:9px;color:#9e9e9e;font-weight:700;text-transform:uppercase;margin-bottom:1px">Issued</div><div style="font-size:11px;font-weight:700;color:#388e3c">${fmtDate(p.issueDate)}</div></div>
          <div><div style="font-size:9px;color:#9e9e9e;font-weight:700;text-transform:uppercase;margin-bottom:1px">Expires</div><div style="font-size:11px;font-weight:700;color:${new Date(p.expiryDate) < new Date() ? "#c62828" : "#388e3c"}">${fmtDate(p.expiryDate)}</div></div>
        </div>
      </div>`,
  }));

  const officeMarkers: MarkerData[] = EPA_OFFICES.map(o => ({
    lat: o.lat,
    lng: o.lng,
    iconHtml: authorityMarkerHtml(o.hq),
    iconSize: [o.hq ? 38 : 30, o.hq ? 38 : 30] as [number, number],
    iconAnchor: [o.hq ? 19 : 15, o.hq ? 19 : 15] as [number, number],
    popupHtml: `
      <div style="font-family:'Nunito',sans-serif;min-width:180px;padding:4px 2px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <div style="width:28px;height:28px;border-radius:50%;background:#0d3321;
            border:2px solid ${o.hq ? "#f59e0b" : "#d97706"};flex-shrink:0;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,.3)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="${BUILDING_PATH}"/>
            </svg>
          </div>
          <div>
            <div style="font-size:11.5px;font-weight:800;color:#0d1712;line-height:1.2">${o.name}</div>
            <div style="font-size:10px;color:#475569;font-weight:600;margin-top:1px">${o.region} Region</div>
          </div>
        </div>
        <div style="padding-top:6px;border-top:1px solid #f0f0f0;display:flex;align-items:center;gap:6px">
          <span style="font-size:9.5px;background:${o.hq ? "#fffbeb" : "#fef3c7"};color:${o.hq ? "#92400e" : "#b45309"};
            padding:2px 9px;border-radius:20px;font-weight:700;border:1px solid ${o.hq ? "#fde68a" : "#fcd34d"}">
            ${o.hq ? "★ Head Office" : "Regional Office"}
          </span>
          <span style="font-size:9px;color:#9e9e9e;font-weight:600">EPA Ghana</span>
        </div>
      </div>`,
  }));

  const markers: MarkerData[] = [
    ...permitMarkers,
    ...(showOffices ? officeMarkers : []),
  ];

  // Clicking a permit marker zooms + opens popup (via focusIndex in LeafletMap).
  // No card scroll — the map interaction is self-contained.
  const onMarkerClick = useCallback((_: MarkerData, idx: number) => {
    if (idx < filtered.length) {
      setFocused(prev => prev === idx ? null : idx);
    }
  }, [filtered.length]);

  const mapH = isMobile ? Math.round(window.innerHeight * 0.56) : Math.round(window.innerHeight - HEADER_H);

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: "#f3f6f4", color: "#0d1712" }}>

      {/* ══ STICKY HEADER ══ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 1000,
        height: HEADER_H, background: "#0d1712",
        borderBottom: "1px solid #1b5e2030",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: 1400, margin: "0 auto",
          padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Left: logo + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <img
              src="/images/epa-logo-no-bg.png"
              alt="EPA Ghana"
              style={{ width: isMobile ? 32 : 38, height: isMobile ? 32 : 38, objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: isMobile ? 11 : 13, letterSpacing: "0.04em", lineHeight: 1.2 }}>
                {isMobile ? "EPA Ghana" : "Environmental Protection Authority · Ghana"}
              </div>
              <div style={{ color: "#4caf50", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 1 }}>
                Public Permits Register
              </div>
            </div>
          </div>

          {/* Right: live badge + link */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "#1b5e2030", border: "1px solid #1b5e2060",
              borderRadius: 20, padding: "3px 11px",
              color: "#81c784", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              <span
                className="m-pulse"
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf50", display: "inline-block", flexShrink: 0 }}
              />
              Live
            </span>
            {!isMobile && (
              <a
                href="https://epa.gov.gh"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#546e5a", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textDecoration: "none", textTransform: "uppercase" }}
              >
                epa.gov.gh ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ══ MAP HERO — fills the viewport ══ */}
      <div style={{ position: "relative", height: mapH, background: "#0d1712" }}>

        {/* Map or shimmer */}
        {loading ? (
          <div className="m-shimmer" style={{ height: "100%", borderRadius: 0 }} />
        ) : (
          <LeafletMap
            center={[7.9465, -1.0232]}
            showGhanaOnly
            height={mapH}
            markers={markers}
            focusIndex={focused}
            onMarkerClick={onMarkerClick}
          />
        )}

        {/* EPA logo empty-state overlay (no markers yet) */}
        {!loading && permits.length === 0 && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 500,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <div style={{
              background: "rgba(13,23,18,0.82)", backdropFilter: "blur(8px)",
              borderRadius: 20, padding: isMobile ? "24px 28px" : "32px 44px",
              textAlign: "center", border: "1px solid #1b5e2040",
              maxWidth: 340,
            }}>
              <img
                src="/images/epa-logo-no-bg.png"
                alt="EPA Ghana"
                style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 14, opacity: 0.9 }}
              />
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 8, letterSpacing: "-0.01em" }}>
                Coordinates being added
              </div>
              <div style={{ color: "#81c784", fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>
                Geolocated permits will appear on the map as coordinates are progressively assigned to each facility.
              </div>
            </div>
          </div>
        )}

        {/* ── Stats overlay — bottom of map ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 600,
          background: "linear-gradient(to top, rgba(13,23,18,0.92) 0%, rgba(13,23,18,0.70) 70%, transparent 100%)",
          padding: isMobile ? "20px 16px 16px" : "36px 28px 20px",
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>

            {/* Title line */}
            <div style={{ marginBottom: isMobile ? 10 : 14 }}>
              <h1 style={{
                margin: 0, color: "#fff", fontWeight: 900,
                fontSize: isMobile ? 17 : 24,
                letterSpacing: "-0.02em", lineHeight: 1.2,
              }}>
                Environmental Permits — Public Register
              </h1>
              <p style={{ margin: "4px 0 0", color: "#a5d6a7", fontSize: isMobile ? 11 : 12.5, fontWeight: 500 }}>
                Issued under EP Act, 2025 (Act 1124) &amp; LI 2504 &nbsp;·&nbsp; Republic of Ghana
              </p>
            </div>

            {/* Stat pills */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: isMobile ? 8 : 12 }}>
              {(
                [
                  { label: "Total Issued",  val: stats?.total,     color: "#4caf50",  sub: "on register" },
                  { label: "Active",        val: stats?.active,    color: "#81c784",  sub: "currently valid" },
                  { label: "Expired",       val: stats?.expired,   color: "#ef9a9a",  sub: "past validity" },
                  { label: "Suspended",     val: stats?.suspended, color: "#ffb74d",  sub: "temporarily" },
                ] as const
              ).map(({ label, val, color, sub }) => (
                <div
                  key={label}
                  className="m-up"
                  style={{
                    background: "rgba(255,255,255,0.07)", border: `1px solid ${color}30`,
                    borderRadius: isMobile ? 10 : 14, padding: isMobile ? "8px 10px" : "12px 16px",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {loading || val === undefined ? (
                    <div className="m-shimmer" style={{ height: isMobile ? 18 : 24, width: "60%", marginBottom: 4 }} />
                  ) : (
                    <div style={{ color, fontWeight: 900, fontSize: isMobile ? 18 : 26, lineHeight: 1, letterSpacing: "-0.03em" }}>
                      {val.toLocaleString()}
                    </div>
                  )}
                  <div style={{ color, fontSize: isMobile ? 9 : 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 3 }}>
                    {label}
                  </div>
                  {!isMobile && (
                    <div style={{ color: "#546e5a", fontSize: 9.5, fontWeight: 500, marginTop: 2 }}>{sub}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Scroll cue */}
            <div style={{ textAlign: "center", marginTop: isMobile ? 10 : 14 }}>
              <span style={{ color: "#546e5a", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em" }}>
                ↓ &nbsp; scroll to explore permits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTENT BELOW THE MAP ══ */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "20px 14px 40px" : "28px 28px 60px" }}>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#ffebee", border: "1px solid #ef9a9a", borderRadius: 12,
            padding: "13px 18px", color: "#c62828", fontSize: 13, fontWeight: 600,
            marginBottom: 18, display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>⚠</span>
            <span>{error}</span>
            <button
              onClick={() => fetchData()}
              style={{
                marginLeft: "auto", background: "#c62828", color: "#fff", border: "none",
                borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── "Not your permit" notice ── */}
        <div style={{
          background: "linear-gradient(135deg,#e8f5e9,#f1f8e9)",
          border: "1.5px solid #a5d6a7",
          borderLeft: "4px solid #1b5e20",
          borderRadius: 12, padding: isMobile ? "14px 16px" : "16px 22px",
          marginBottom: 22, display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <img
            src="/images/epa-logo-no-bg.png"
            alt=""
            style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0, marginTop: 2 }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#1b5e20", marginBottom: 4 }}>
              Not seeing your permit here?
            </div>
            <div style={{ fontSize: 12.5, color: "#33691e", lineHeight: 1.65, fontWeight: 500 }}>
              This register is <strong>updated progressively</strong> as geolocation data is added to permit records.
              The absence of a permit from this map <strong>does not mean the permit has not been issued</strong>.
              All permits issued by EPA Ghana remain valid and are recorded in the official registry.
              To confirm the status of a specific permit, scan the <strong>QR code on your permit document</strong> or
              contact EPA Ghana directly.
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="https://epa.gov.gh"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#1b5e20", color: "#fff", borderRadius: 8,
                  padding: "6px 14px", fontSize: 11.5, fontWeight: 700, textDecoration: "none",
                }}
              >
                Visit EPA Ghana ↗
              </a>
              {lastFetch && (
                <span style={{ fontSize: 11, color: "#81c784", fontWeight: 600, display: "flex", alignItems: "center" }}>
                  ↻ Register last refreshed: {lastFetch.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Search + status filter ── */}
        <div style={{ marginBottom: 14 }}>
          {/* Search input */}
          <div style={{ position: "relative", marginBottom: 10 }}>
            <span style={{
              position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
              fontSize: 15, color: "#9e9e9e", pointerEvents: "none",
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by permit number, company or permit type…"
              value={search}
              onChange={e => { setSearch(e.target.value); setFocused(null); }}
              style={{
                width: "100%", boxSizing: "border-box",
                paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                border: "1.5px solid #c8e6c9", borderRadius: 12, fontSize: 13.5,
                fontFamily: "inherit", background: "#fff", color: "#0d1712", outline: "none",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#2e7d32"; e.currentTarget.style.boxShadow = "0 0 0 3px #1b5e2018"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#c8e6c9"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Status filter pills + EPA Offices toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between", flexWrap: isMobile ? "nowrap" : "wrap" }}>
            <div
              className="m-scroll"
              style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, flexShrink: 1, minWidth: 0 }}
            >
              {(["ALL", "ACTIVE", "EXPIRED", "SUSPENDED", "REVOKED"] as const).map(s => {
                const meta = s !== "ALL" ? S[s] : null;
                const on = statusFilter === s;
                return (
                  <button
                    key={s}
                    className="m-pill"
                    onClick={() => { setStatus(s); setFocused(null); }}
                    style={{
                      flexShrink: 0, whiteSpace: "nowrap",
                      padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      border: on ? `1.5px solid ${meta?.ring ?? "#1b5e20"}` : "1.5px solid #e0e0e0",
                      background: on ? (meta?.badge ?? "#e8f5e9") : "#fff",
                      color: on ? (meta?.text ?? "#1b5e20") : "#757575",
                      cursor: "pointer", fontFamily: "inherit",
                      letterSpacing: "0.06em", textTransform: "uppercase", transition: "all .15s",
                    }}
                  >
                    {s === "ALL" ? "All statuses" : meta?.label}
                  </button>
                );
              })}

              {/* EPA Offices layer toggle */}
              <button
                className="m-pill"
                onClick={() => setShowOffices(prev => !prev)}
                style={{
                  flexShrink: 0, whiteSpace: "nowrap",
                  padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  border: showOffices ? "1.5px solid #f59e0b" : "1.5px solid #e0e0e0",
                  background: showOffices ? "#fffbeb" : "#fff",
                  color: showOffices ? "#92400e" : "#9e9e9e",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "inline-flex", alignItems: "center", gap: 5,
                  letterSpacing: "0.06em", transition: "all .15s",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill={showOffices ? "#f59e0b" : "#bdbdbd"}>
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                EPA OFFICES
              </button>
            </div>
            <span style={{ flexShrink: 0, fontSize: 11, color: "#9e9e9e", fontWeight: 600, paddingLeft: 6 }}>
              {loading ? "—" : `${filtered.length} / ${permits.length} on map`}
            </span>
          </div>
        </div>

        {/* ── Permit cards ── */}
        {!loading && filtered.length === 0 && !error && (
          <div style={{
            textAlign: "center", padding: isMobile ? "40px 16px" : "56px 24px",
            background: "#fff", borderRadius: 16, border: "1.5px dashed #c8e6c9",
          }}>
            <img src="/images/epa-logo-no-bg.png" alt="" style={{ width: 52, height: 52, objectFit: "contain", opacity: 0.35, marginBottom: 14 }} />
            <div style={{ color: "#9e9e9e", fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>
              {permits.length === 0 ? "No geolocated permits yet" : "No results for this filter"}
            </div>
            <div style={{ color: "#bdbdbd", fontSize: 12, fontWeight: 500, lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
              {permits.length === 0
                ? "Coordinates are being progressively assigned. Check back soon."
                : "Try adjusting the search term or status filter above."}
            </div>
          </div>
        )}

        {/* Skeleton cards */}
        {loading && (
          <div
            ref={stripRef}
            style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}
          >
            {Array.from({ length: isMobile ? 2 : 5 }).map((_, i) => (
              <div key={i} className="m-shimmer" style={{ flexShrink: 0, width: isMobile ? "calc(100vw - 60px)" : 244, height: 172 }} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div
            ref={stripRef}
            className="m-scroll"
            style={{
              display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10,
              scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" as any,
            }}
          >
            {filtered.map((p, idx) => {
              const meta = S[p.status] ?? { label: p.status, ring: "#9e9e9e", dot: "#9e9e9e", badge: "#f5f5f5", text: "#616161" };
              const isFoc = focused === idx;
              const expired = p.expiryDate && new Date(p.expiryDate) < new Date();

              return (
                <div
                  key={p.permitNumber}
                  onClick={() => setFocused(isFoc ? null : idx)}
                  style={{
                    flexShrink: 0,
                    width: isMobile ? "calc(100vw - 60px)" : 244,
                    scrollSnapAlign: "start",
                    cursor: "pointer",
                    borderRadius: 14,
                    border: `2px solid ${isFoc ? "#1b5e20" : "#e8f5e9"}`,
                    background: isFoc ? "#f1f8e9" : "#fff",
                    padding: "14px 14px 12px",
                    boxShadow: isFoc
                      ? "0 4px 20px rgba(27,94,32,.18)"
                      : "0 1px 6px rgba(0,0,0,.06)",
                    transition: "all .2s ease",
                  }}
                >
                  {/* Row 1: permit number + status badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11.5, fontWeight: 800, color: "#0d1712", lineHeight: 1.3, wordBreak: "break-all" }}>
                      {p.permitNumber}
                    </span>
                    <span style={{
                      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 9.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                      background: meta.badge, color: meta.text, textTransform: "uppercase", letterSpacing: "0.07em",
                    }}>
                      <span
                        className={p.status === "ACTIVE" ? "m-pulse" : ""}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot, display: "inline-block", flexShrink: 0 }}
                      />
                      {meta.label}
                    </span>
                  </div>

                  {/* Company */}
                  <div style={{
                    fontSize: 12, color: "#1b5e20", fontWeight: 700, marginBottom: 6,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {p.companyName ?? "—"}
                  </div>

                  {/* Type */}
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: "#0369a1", background: "#e0f2fe", padding: "2px 9px", borderRadius: 20, fontWeight: 700 }}>
                      {normalizeType(p.permitType)}
                    </span>
                  </div>

                  {/* Dates */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <div style={{ background: "#f9fbe7", borderRadius: 8, padding: "6px 8px" }}>
                      <div style={{ fontSize: 8.5, color: "#827717", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Issued</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#33691e" }}>{fmtDate(p.issueDate)}</div>
                    </div>
                    <div style={{ background: expired ? "#ffebee" : "#f9fbe7", borderRadius: 8, padding: "6px 8px" }}>
                      <div style={{ fontSize: 8.5, color: expired ? "#b71c1c" : "#827717", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Expires</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: expired ? "#c62828" : "#33691e" }}>{fmtDate(p.expiryDate)}</div>
                    </div>
                  </div>

                  {/* Entity */}
                  {p.issuingEntity && (
                    <div style={{
                      marginTop: 9, paddingTop: 8, borderTop: "1px solid #f0f4f0",
                      fontSize: 10, color: "#9e9e9e", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 5, overflow: "hidden",
                    }}>
                      <span style={{ flexShrink: 0, fontSize: 12 }}>🏛</span>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.issuingEntity}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Map legend ── */}
        {!loading && (
          <div style={{
            marginTop: 28, background: "#fff", borderRadius: 14, border: "1px solid #e8f5e9",
            padding: isMobile ? "16px 16px" : "18px 24px",
          }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: "#1b5e20", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Map Legend
            </div>
            <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap", alignItems: "center" }}>
              {/* Permit status markers */}
              {Object.entries(S).map(([key, m]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", background: "#fff",
                      border: `2.5px solid ${m.ring}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,.14)",
                    }}>
                      <img src="/images/epa-logo-no-bg.png" alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
                    </div>
                    <div style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 9, height: 9, borderRadius: "50%",
                      background: m.dot, border: "1.5px solid #fff",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.text }}>{m.label}</span>
                </div>
              ))}

              {/* Divider */}
              <div style={{ width: 1, height: 28, background: "#e0e0e0", flexShrink: 0, margin: "0 4px" }} />

              {/* Authority markers */}
              {[
                { hq: true,  label: "Head Office",      border: "#f59e0b", dot: "#f59e0b", iconFill: "white", textColor: "#92400e" },
                { hq: false, label: "Regional Office",   border: "#d97706", dot: "#d97706", iconFill: "white", textColor: "#b45309" },
              ].map(({ hq, label, border, dot, iconFill, textColor }) => {
                const sz = hq ? 34 : 26;
                const iconW = hq ? 16 : 12;
                const dotSz = hq ? 11 : 9;
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ position: "relative", width: sz, height: sz, flexShrink: 0 }}>
                      <div style={{
                        width: sz - 2, height: sz - 2, borderRadius: "50%", background: "#0d3321",
                        border: `${hq ? "2.5px" : "2px"} solid ${border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,.28)",
                      }}>
                        <svg width={iconW} height={iconW} viewBox="0 0 24 24" fill={iconFill}>
                          <path d={BUILDING_PATH}/>
                        </svg>
                      </div>
                      <div style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: dotSz, height: dotSz, borderRadius: "50%",
                        background: dot, border: "1.5px solid #fff",
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: textColor }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "#0d1712", marginTop: 0 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "28px 16px" : "36px 28px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/images/epa-logo-no-bg.png" alt="EPA Ghana" style={{ width: 40, height: 40, objectFit: "contain", opacity: 0.85 }} />
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>Environmental Protection Authority</div>
                <div style={{ color: "#4caf50", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 2 }}>Republic of Ghana</div>
              </div>
            </div>
            <div style={{ maxWidth: 560, flex: 1, minWidth: 240 }}>
              <p style={{ color: "#546e5a", fontSize: 11.5, lineHeight: 1.75, margin: 0 }}>
                This register is published under the principles of environmental transparency in compliance with the{" "}
                <span style={{ color: "#81c784", fontWeight: 600 }}>EP Act, 2025 (Act 1124)</span>.
                Only information permissible for public disclosure is shown. Permit holders and validity
                dates are as declared in the approved permit schedules. Geolocation data is progressively updated —
                absence from this map does not indicate the absence of a valid permit.
              </p>
              <p style={{ color: "#374d39", fontSize: 10.5, marginTop: 10, lineHeight: 1.6 }}>
                © {new Date().getFullYear()} Environmental Protection Authority, Ghana &nbsp;·&nbsp;
                All rights reserved &nbsp;·&nbsp;{" "}
                <a href="https://epa.gov.gh" target="_blank" rel="noopener noreferrer" style={{ color: "#4caf50", textDecoration: "none" }}>
                  epa.gov.gh
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
