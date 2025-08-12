export default function SkeletonCard() {
  return (
    <div className="relative rounded-lg overflow-hidden animate-pulse">
      <div 
        className="bg-zinc-800"
        style={{ 
          paddingBottom: `${100 + Math.random() * 50}%` 
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  );
}
