export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-hemp-green/30 border-t-hemp-green rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-hemp-leaf rounded-full opacity-20"></div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-hemp-green" style={{ fontFamily: 'var(--font-fredoka)' }}>
            Loading iHemp Dashboard
          </h3>
          <p className="text-gray-600 mt-1">Fetching real-time metrics and content...</p>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Connecting to OpenClaw API</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span>Loading WordPress content pipeline</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              <span>Pulling Amazon Associates data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}