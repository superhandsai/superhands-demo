export function ResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading flights">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white border border-grey-200 rounded-[14px] p-5 mb-3">
          <div className="animate-[skeleton-shimmer_1.4s_ease_infinite] bg-[linear-gradient(90deg,#eee_25%,#f5f5f5_37%,#eee_63%)] bg-[length:400%_100%] rounded-lg h-3 mb-2 w-2/5" />
          <div className="animate-[skeleton-shimmer_1.4s_ease_infinite] bg-[linear-gradient(90deg,#eee_25%,#f5f5f5_37%,#eee_63%)] bg-[length:400%_100%] rounded-lg h-3 mb-2 w-[70%]" />
          <div className="animate-[skeleton-shimmer_1.4s_ease_infinite] bg-[linear-gradient(90deg,#eee_25%,#f5f5f5_37%,#eee_63%)] bg-[length:400%_100%] rounded-lg h-3 mb-2 w-[90%]" />
          <div className="animate-[skeleton-shimmer_1.4s_ease_infinite] bg-[linear-gradient(90deg,#eee_25%,#f5f5f5_37%,#eee_63%)] bg-[length:400%_100%] rounded-lg h-3 mb-2 w-2/5" />
        </div>
      ))}
    </div>
  )
}
