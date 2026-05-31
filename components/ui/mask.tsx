import React from 'react'

// Tile width = one full face pass. Inner SVG is 2× wide for seamless loop.
const W = 280
const H = 230

const Mask: React.FC = () => (
  <>
    <style>{`
      @keyframes maskRoll {
        from { transform: translateX(0); }
        to   { transform: translateX(-${W}px); }
      }
      @keyframes maskOuterGlow {
        0%,100% { box-shadow:
          -10px 0 28px #6E56CFcc inset,
           8px  0 20px #000000cc inset,
           0    0 50px #6E56CF33;
        }
        50% { box-shadow:
          -10px 0 40px #8b7cf8ee inset,
           8px  0 28px #000000ee inset,
           0    0 80px #6E56CF66;
        }
      }
    `}</style>

    <div className="flex items-center justify-center" style={{ width: W + 40, height: H + 40 }}>
      {/* Oval container — overflow:hidden clips the scrolling SVG */}
      <div
        style={{
          width: W,
          height: H,
          borderRadius: '48% 52% / 42% 58%',
          overflow: 'hidden',
          position: 'relative',
          animation: 'maskOuterGlow 3s ease-in-out infinite',
        }}
      >
        {/* Scrolling surface — 2× wide */}
        <svg
          viewBox={`0 0 ${W * 2} ${H}`}
          style={{
            width: W * 2,
            height: H,
            display: 'block',
            animation: `maskRoll 10s linear infinite`,
          }}
          aria-hidden="true"
        >
          <defs>
            {/* Single tile — all face features live here */}
            <g id="vface">
              {/* Base */}
              <rect width={W} height={H} fill="#07050e" />

              {/* Face surface: subtle lighter center */}
              <ellipse cx={W / 2} cy={H / 2} rx={108} ry={94}
                fill="#110820" opacity={0.9} />

              {/* Cheeks */}
              <ellipse cx={72}       cy={128} rx={26} ry={18} fill="#7a1a38" opacity={0.35} />
              <ellipse cx={W - 72}   cy={128} rx={26} ry={18} fill="#7a1a38" opacity={0.35} />

              {/* Left brow */}
              <path
                d="M50,82 C65,68 104,66 114,77"
                fill="none" stroke="#4a2d6e" strokeWidth="2.4" strokeLinecap="round"
              />
              {/* Right brow */}
              <path
                d={`M${W - 114},77 C${W - 104},66 ${W - 65},68 ${W - 50},82`}
                fill="none" stroke="#4a2d6e" strokeWidth="2.4" strokeLinecap="round"
              />

              {/* Left eye (V-mask almond: pointed inner corner) */}
              <path
                d="M52,98 C60,84 100,82 108,98 C100,112 60,112 52,98 Z"
                fill="#030208"
              />
              <path
                d="M52,98 C60,84 100,82 108,98 C100,112 60,112 52,98 Z"
                fill="none" stroke="#6E56CF" strokeWidth="1.6"
              />
              {/* Left iris glint */}
              <circle cx="78" cy="97" r="3" fill="#6E56CF" opacity="0.6" />
              <circle cx="80" cy="95" r="1.2" fill="white"  opacity="0.5" />

              {/* Right eye */}
              <path
                d={`M${W - 108},98 C${W - 100},82 ${W - 60},84 ${W - 52},98 C${W - 60},112 ${W - 100},112 ${W - 108},98 Z`}
                fill="#030208"
              />
              <path
                d={`M${W - 108},98 C${W - 100},82 ${W - 60},84 ${W - 52},98 C${W - 60},112 ${W - 100},112 ${W - 108},98 Z`}
                fill="none" stroke="#6E56CF" strokeWidth="1.6"
              />
              {/* Right iris glint */}
              <circle cx={W - 78} cy="97" r="3"   fill="#6E56CF" opacity="0.6" />
              <circle cx={W - 80} cy="95" r="1.2" fill="white"   opacity="0.5" />

              {/* Nose bridge */}
              <path
                d={`M${W / 2},112 L${W / 2 - 7},138 Q${W / 2},143 ${W / 2 + 7},138 Z`}
                fill="none" stroke="#3a1e55" strokeWidth="1.3" opacity={0.55}
              />

              {/* Mustache */}
              <path
                d={`M${W / 2 - 32},154 Q${W / 2 - 16},146 ${W / 2},150 Q${W / 2 + 16},146 ${W / 2 + 32},154`}
                fill="none" stroke="#3a1e55" strokeWidth="2" strokeLinecap="round"
              />
              {/* Left curl */}
              <path
                d={`M${W / 2 - 32},154 C${W / 2 - 38},147 ${W / 2 - 32},154 ${W / 2 - 32},154`}
                fill="none" stroke="#3a1e55" strokeWidth="1.5" strokeLinecap="round"
              />
              {/* Right curl */}
              <path
                d={`M${W / 2 + 32},154 C${W / 2 + 38},147 ${W / 2 + 32},154 ${W / 2 + 32},154`}
                fill="none" stroke="#3a1e55" strokeWidth="1.5" strokeLinecap="round"
              />

              {/* Smile */}
              <path
                d={`M${W / 2 - 28},166 Q${W / 2},184 ${W / 2 + 28},166`}
                fill="none" stroke="#3a1e55" strokeWidth="1.8" strokeLinecap="round"
              />

              {/* V-shaped chin beard */}
              <path
                d={`M${W / 2 - 14},196 Q${W / 2},212 ${W / 2 + 14},196`}
                fill="none" stroke="#3a1e55" strokeWidth="1.3" strokeLinecap="round" opacity={0.5}
              />

              {/* V mark on forehead */}
              <path
                d={`M${W / 2 - 12},42 L${W / 2},56 L${W / 2 + 12},42`}
                fill="none" stroke="#6E56CF" strokeWidth="1.8"
                strokeLinejoin="round" opacity={0.55}
              />
            </g>
          </defs>

          {/* Two tiles side by side for seamless loop */}
          <use href="#vface" x="0" />
          <use href="#vface" x={W} />
        </svg>

        {/* Depth gradient overlay — dark on edges, light in center (sphere illusion) */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right,
              rgba(0,0,0,0.82) 0%,
              rgba(0,0,0,0.15) 22%,
              rgba(0,0,0,0)    45%,
              rgba(0,0,0,0)    55%,
              rgba(0,0,0,0.25) 78%,
              rgba(0,0,0,0.65) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Purple rim light from the left (like the globe's cyan inset shadow) */}
        <div
          style={{
            position: 'absolute', inset: 0,
            boxShadow: '-6px 0 18px #6E56CF99 inset',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  </>
)

export default Mask
