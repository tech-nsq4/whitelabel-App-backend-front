const base = {
  borderRadius: 6,
  background: "var(--line)",
  animation: "skeletonPulse 1.4s ease-in-out infinite",
};

export function SkeletonBox({ width = "100%", height = 14, style = {} }) {
  return <div style={{ ...base, width, height, ...style }} />;
}

export function SkeletonList({ rows = 4 }) {
  return (
    <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            gap: 12,
            borderBottom: i < rows - 1 ? "1px solid var(--line)" : "none",
          }}
        >
          <SkeletonBox
            width={16}
            height={16}
            style={{ borderRadius: 4, flexShrink: 0 }}
          />
          <SkeletonBox width={140} height={13} />
          <div style={{ flex: 1 }} />
          <SkeletonBox width={54} height={22} style={{ borderRadius: 20 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "12px 20px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox
            key={i}
            width={80}
            height={11}
            style={{ opacity: 0.5 }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 16,
            padding: "14px 20px",
            borderBottom: i < rows - 1 ? "1px solid var(--line)" : "none",
            alignItems: "center",
          }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBox
              key={j}
              width={j === 0 ? 36 : `${60 + j * 20}px`}
              height={13}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }) {
  return (
    <div className="row c3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="panel"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <SkeletonBox
              width={40}
              height={40}
              style={{ borderRadius: 10, flexShrink: 0 }}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <SkeletonBox width="60%" height={13} />
              <SkeletonBox width="40%" height={11} />
            </div>
          </div>
          <SkeletonBox width="80%" height={11} />
          <SkeletonBox width="50%" height={11} />
        </div>
      ))}
    </div>
  );
}
