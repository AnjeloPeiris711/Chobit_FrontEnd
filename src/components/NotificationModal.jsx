import Lottie from 'lottie-react';
import loadingAnimation from '../assets/lottie/loading.json';
import errorAnimation from '../assets/lottie/error.json';
import successAnimation from '../assets/lottie/success.json';

const NotificationModal = ({ type, message, isOpen, onClose, progress, zIndex = 60 }) => {
  if (!isOpen) return null;

  const animations = {
    loading: loadingAnimation,
    error: errorAnimation,
    success: successAnimation,
    progress: loadingAnimation,
  };

  const modalStyles = {
    loading: 'bg-blue-100 border-blue-500 text-blue-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    progress: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  const buttonStyles = {
    loading: 'bg-blue-600 text-white hover:bg-blue-700',
    error: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    progress: 'bg-yellow-600 text-white hover:bg-yellow-700',
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`} style={{ zIndex }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`bg-white p-6 rounded-xl shadow-md w-full max-w-sm border-l-4 ${modalStyles[type]}`}>
        <div className="flex justify-center">
          <Lottie animationData={animations[type]} loop={type === 'loading' || type === 'progress'} style={{ width: 100, height: 100 }} />
        </div>
        <p id="modal-title" className="text-center text-sm font-medium mt-2">
          {message || (type === 'loading' ? 'Loading...' : type === 'error' ? 'An error occurred' : type === 'success' ? 'Operation successful' : 'Uploading media...')}
        </p>
        {type === 'progress' && progress && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-600 h-2.5 rounded-full"
                style={{ width: `${progress.total > 0 ? (progress.uploaded / progress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-center text-xs mt-2">
              {progress.uploaded}/{progress.total} files uploaded
            </p>
          </div>
        )}
        {(type !== 'loading' && type !== 'progress') && (
          <button
            onClick={onClose}
            className={`mt-4 w-full py-2 rounded-md ${buttonStyles[type]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;