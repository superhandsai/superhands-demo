export function ResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading flights">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-line w-40" />
          <div className="skeleton skeleton-line w-70" />
          <div className="skeleton skeleton-line w-90" />
          <div className="skeleton skeleton-line w-40" />
        </div>
      ))}
    </div>
  )
}
