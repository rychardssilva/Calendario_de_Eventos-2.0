// src/frontend/components/Pagination.jsx
export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 border rounded ${page === 1 ? 'opacity-50' : 'hover:bg-gray-100'}`}
      >
        Anterior
      </button>
      <span className="px-4 py-1 border rounded bg-gray-100">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-3 py-1 border rounded ${page === totalPages ? 'opacity-50' : 'hover:bg-gray-100'}`}
      >
        Próxima
      </button>
    </div>
  );
}
