/** Static one-point-perspective room, split into structure (left) and result (right). */
function RoomLines() {
  return (
    <g fill="none" stroke="#817b73" strokeOpacity={0.7} strokeWidth={1} vectorEffect="non-scaling-stroke">
      <path d="M0 0 L380 130 L380 430 L0 700 M1200 0 L900 130 L900 430 L1200 700 M380 130 H900 V430 H380 Z M380 430 L0 700 M900 430 L1200 700" />
      {/* sofa */}
      <path d="M430 340 H700 V430 H430 Z M430 296 H700 V340 H430 Z M412 318 H430 V430 H412 Z M700 318 H718 V430 H700 Z" />
      {/* coffee table, rug */}
      <ellipse cx={590} cy={512} rx={78} ry={18} />
      <path d="M470 486 H790 L850 610 H410 Z" />
      {/* lamp */}
      <path d="M810 212 V430 M780 172 H840 L852 212 H768 Z" />
      {/* window, art */}
      <path d="M736 168 H876 V292 H736 Z M736 230 H876 M806 168 V292 M452 190 H590 V256 H452 Z" />
      {/* plant */}
      <path d="M950 384 H990 L984 430 H956 Z" />
      <circle cx={970} cy={352} r={34} />
    </g>
  );
}

function RoomSurfaces() {
  return (
    <g>
      <path d="M0 700 L380 430 H900 L1200 700 Z" fill="#1d1b18" />
      <path d="M0 0 L380 130 V430 L0 700 Z" fill="#2a2723" />
      <path d="M380 130 H900 V430 H380 Z" fill="#34312c" />
      <path d="M900 130 L1200 0 V700 L900 430 Z" fill="#2a2723" />
      <path d="M470 486 H790 L850 610 H410 Z" fill="#24365f" />
      <path d="M430 340 H700 V430 H430 Z M430 296 H700 V340 H430 Z M412 318 H430 V430 H412 Z M700 318 H718 V430 H700 Z" fill="#f1ede5" />
      <ellipse cx={590} cy={512} rx={78} ry={18} fill="#b5b1aa" />
      <path d="M736 168 H876 V292 H736 Z" fill="#d8d2c5" />
      <path d="M452 190 H590 V256 H452 Z" fill="#5b564d" />
      <path d="M780 172 H840 L852 212 H768 Z" fill="#f1ede5" />
      <path d="M809 212 H811 V430 H809 Z" fill="#3c3934" />
      <path d="M950 384 H990 L984 430 H956 Z" fill="#3c3934" />
      <circle cx={970} cy={352} r={34} fill="#4a463f" />
    </g>
  );
}

export function RoomFallback({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="room-result">
          <rect x={600} y={0} width={600} height={700} />
        </clipPath>
        <clipPath id="room-structure">
          <rect x={0} y={0} width={600} height={700} />
        </clipPath>
      </defs>
      <g clipPath="url(#room-structure)">
        <RoomLines />
      </g>
      <g clipPath="url(#room-result)">
        <RoomSurfaces />
      </g>
      <path d="M600 0 V700" stroke="#5b7fc7" strokeOpacity={0.55} strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
