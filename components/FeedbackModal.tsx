import React, { useState, useEffect } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'feedback' | 'support';
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, mode }) => {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const modalTitle = mode === 'feedback' ? 'Submit Feedback' : 'Contact Support';
  const modalDescription = mode === 'feedback' 
    ? "Have a suggestion or an issue? We'd love to hear from you." 
    : "Need help? Describe the problem you're facing and we'll get back to you.";
  const inputLabel = mode === 'feedback' ? 'Your Feedback' : 'Your Support Query';
  const buttonText = 'Prepare Email';
  
  // Reset state when the modal is opened or mode changes
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setIsSubmitted(false);
      setError('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message before sending.');
      return;
    }
    setError('');
    try {
      const subject = mode === 'feedback' ? 'Feedback for SahayakAI' : 'Support Request for SahayakAI';
      const mailtoLink = `mailto:laggalarakesh8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error creating mailto link:", err);
      setError('Could not open your email client. Please copy your message and send it manually.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-black/70 backdrop-blur-xl border border-purple-500/50 rounded-xl shadow-[0_0_30px_theme(colors.purple.700)] w-full max-w-lg mx-4 p-8 transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 id="modal-title" className="text-2xl font-orbitron text-cyan-400 mb-2">{modalTitle}</h2>
        <p className="text-purple-300/80 mb-6 font-mono">{modalDescription}</p>

        {isSubmitted ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-cyan-400 font-orbitron mb-2">Thank You!</h3>
            <p className="text-gray-300 mb-6 font-mono">Your email application is opening. Please click 'Send' in your email client to complete the process.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/30"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="feedback-message" className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">{inputLabel}</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                placeholder="Type your message here..."
                required
              />
            </div>
            {error && <p className="text-pink-400 text-sm font-mono">{error}</p>}
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-purple-900/80 text-white font-bold rounded-full hover:bg-purple-800/90 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/30"
              >
                {buttonText}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;