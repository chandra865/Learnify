
const Loading = ({ small = false }) => {
  if (small) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

      {/* Pulsating Dots */}
      <div className="flex space-x-2 mt-4">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-400"></span>
      </div>

      <p className="mt-4 text-gray-600 text-lg font-medium">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
