export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
