'use client'

import React from "react"

const Stickman: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes stickmanBob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes legSwingL {
          0%, 100% { transform: rotate(-32deg); }
          50%       { transform: rotate(32deg);  }
        }
        @keyframes legSwingR {
          0%, 100% { transform: rotate(32deg);  }
          50%       { transform: rotate(-32deg); }
        }
        @keyframes armSwingL {
          0%, 100% { transform: rotate(32deg);  }
          50%       { transform: rotate(-32deg); }
        }
        @keyframes armSwingR {
          0%, 100% { transform: rotate(-32deg); }
          50%       { transform: rotate(32deg);  }
        }
        @keyframes voicePulse {
          0%   { opacity: 0;   transform: scale(0.85); }
          12%  { opacity: 0.6; }
          100% { opacity: 0;   transform: scale(3.2);  }
        }
        @keyframes groundShadow {
          0%, 100% { transform: scaleX(1);    opacity: 0.28; }
          50%       { transform: scaleX(0.72); opacity: 0.12; }
        }
        @keyframes headNod {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(4deg);  }
        }
      `}</style>

      <div className="flex items-center justify-center h-screen">
        <svg
          viewBox="0 0 200 270"
          width="200"
          height="270"
          style={{
            animation: "stickmanBob 0.52s ease-in-out infinite",
            filter:
              "drop-shadow(0 0 14px rgba(110,86,207,0.75)) drop-shadow(0 0 40px rgba(110,86,207,0.25))",
          }}
        >
          {/* ── Voice rings ── */}
          <circle cx="100" cy="38" r="27" fill="none" stroke="#6E56CF" strokeWidth="1.6"
            style={{ transformOrigin: "100px 38px", animation: "voicePulse 2.4s ease-out infinite", animationDelay: "0s",   animationFillMode: "backwards" }} />
          <circle cx="100" cy="38" r="27" fill="none" stroke="#8b7cf8" strokeWidth="1.1"
            style={{ transformOrigin: "100px 38px", animation: "voicePulse 2.4s ease-out infinite", animationDelay: "0.8s", animationFillMode: "backwards" }} />
          <circle cx="100" cy="38" r="27" fill="none" stroke="#a78bfa" strokeWidth="0.7"
            style={{ transformOrigin: "100px 38px", animation: "voicePulse 2.4s ease-out infinite", animationDelay: "1.6s", animationFillMode: "backwards" }} />

          {/* ── Head (featureless = anonymous) ── */}
          <circle
            cx="100" cy="38" r="22"
            fill="none" stroke="#9070e0" strokeWidth="3.5"
            style={{ transformOrigin: "100px 38px", animation: "headNod 0.52s ease-in-out infinite" }}
          />

          {/* ── Body ── */}
          <line x1="100" y1="60" x2="100" y2="158"
            stroke="#6E56CF" strokeWidth="3.5" strokeLinecap="round" />

          {/* ── Left arm  (pivot at shoulder 100, 90) ── */}
          <line x1="100" y1="90" x2="63" y2="128"
            stroke="#6E56CF" strokeWidth="3.5" strokeLinecap="round"
            style={{ transformOrigin: "100px 90px", animation: "armSwingL 0.52s ease-in-out infinite" }} />

          {/* ── Right arm (pivot at shoulder 100, 90) ── */}
          <line x1="100" y1="90" x2="137" y2="128"
            stroke="#6E56CF" strokeWidth="3.5" strokeLinecap="round"
            style={{ transformOrigin: "100px 90px", animation: "armSwingR 0.52s ease-in-out infinite" }} />

          {/* ── Left leg  (pivot at hip 100, 158) ── */}
          <line x1="100" y1="158" x2="72" y2="234"
            stroke="#6E56CF" strokeWidth="3.5" strokeLinecap="round"
            style={{ transformOrigin: "100px 158px", animation: "legSwingL 0.52s ease-in-out infinite" }} />

          {/* ── Right leg (pivot at hip 100, 158) ── */}
          <line x1="100" y1="158" x2="128" y2="234"
            stroke="#6E56CF" strokeWidth="3.5" strokeLinecap="round"
            style={{ transformOrigin: "100px 158px", animation: "legSwingR 0.52s ease-in-out infinite" }} />

          {/* ── Ground shadow ── */}
          <ellipse cx="100" cy="248" rx="30" ry="5"
            fill="rgba(110,86,207,0.22)"
            style={{ transformOrigin: "100px 248px", animation: "groundShadow 0.52s ease-in-out infinite" }} />
        </svg>
      </div>
    </>
  )
}

export default Stickman
