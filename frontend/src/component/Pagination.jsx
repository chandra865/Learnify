import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8 py-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`p-2 rounded-full transition-colors ${
          hasPrevPage 
            ? "text-blue-500 hover:bg-gray-800 cursor-pointer" 
            : "text-gray-600 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-600 self-center">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-gray-400 hover:bg-gray-800 cursor-pointer"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-600 self-center">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`p-2 rounded-full transition-colors ${
          hasNextPage 
            ? "text-blue-500 hover:bg-gray-800 cursor-pointer" 
            : "text-gray-600 cursor-not-allowed"
        }`}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Pagination;
