export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="spinner"></div>
      <p className="text-gray-400 mt-4 text-sm">{message}</p>
    </div>
  );
}
