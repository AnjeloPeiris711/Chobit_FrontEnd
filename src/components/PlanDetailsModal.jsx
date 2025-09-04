import { X } from 'lucide-react';

const PlanDetailsModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 60 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border-l-4 border-indigo-500">
        <div className="flex justify-between items-center mb-4">
          <h3 id="modal-title" className="text-lg font-bold text-indigo-700">
            Plan Details: {plan.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Price:</strong> LKR {plan.price}
          </p>
          <p>
            <strong>Duration:</strong> {plan.duration} days
          </p>
          <p>
            <strong>Description:</strong> {plan.description || 'N/A'}
          </p>
          <p>
            <strong>Languages:</strong>{' '}
            {plan.includedContent?.languages?.length
              ? plan.includedContent.languages
                  .map((l) => (l.name ? `${l.name} (${l.code})` : l._id || l))
                  .join(', ')
              : 'None'}
          </p>
          <p>
            <strong>Exam Types:</strong>{' '}
            {plan.includedContent?.examTypes?.length
              ? plan.includedContent.examTypes
                  .map((e) => e.name || e._id || e)
                  .join(', ')
              : 'None'}
          </p>
          <p>
            <strong>Exams:</strong>{' '}
            {plan.includedContent?.exams?.length
              ? plan.includedContent.exams
                  .map((e) => e.topic || e._id || e)
                  .join(', ')
              : 'None'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
