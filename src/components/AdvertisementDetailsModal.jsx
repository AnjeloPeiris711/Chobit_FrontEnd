import { X } from 'lucide-react';

function AdvertisementDetailsModal({ isOpen, onClose, advertisement }) {
  if (!isOpen || !advertisement) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 70 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-modal-title"
    >
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border-l-4 border-indigo-500">
        <div className="flex justify-between items-center mb-4">
          <h3 id="view-modal-title" className="text-lg font-bold text-indigo-700">
            Advertisement Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">ID:</strong> {advertisement._id}
          </div>
          <div>
            <strong className="text-gray-700">Title:</strong> {advertisement.title}
          </div>
          <div>
            <strong className="text-gray-700">Image:</strong>
            {advertisement.image?.url ? (
              <img
                src={import.meta.env.VITE_API_BASE_URL+advertisement.image.url}
                alt={advertisement.title}
                className="mt-2 h-40 w-full object-cover rounded-md"
                onError={(e) => (e.target.src = '/fallback-image.jpg')}
              />
            ) : (
              ' No image'
            )}
          </div>
          <div>
            <strong className="text-gray-700">Status:</strong> {advertisement.status}
          </div>
          <div>
            <strong className="text-gray-700">Created At:</strong>{' '}
            {new Date(advertisement.createdAt).toLocaleString()}
          </div>
          <div>
            <strong className="text-gray-700">Updated At:</strong>{' '}
            {new Date(advertisement.updatedAt).toLocaleString()}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AdvertisementDetailsModal;