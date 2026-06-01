export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Skeleton Ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin [animation-duration:1s]" />
          <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 border-r-purple-500 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-4 rounded-full border-2 border-pink-500/20 border-b-pink-500 animate-spin [animation-duration:2s]" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading content...</p>
      </div>
    </div>
  );
}
