// src/pages/home.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import cahbit from '../assets/logo/chobit.png';

const ChatAILanding = () => {
  const { loginWithGoogle } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center space-x-2">
          <img
            src={cahbit} 
            alt="logo image"
            className="w-10 h-10 md:w-15 md:h-15 flex items-center justify-center" 
          />
          <span className="text-xl font-bold">Chabit</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12 lg:py-20">
        {/* Left Content */}
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Your Intelligent
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Conversation
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          <p className="text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
            We believe in the power of intelligent conversation. Our cutting-edge AI
            chatbot is designed to revolutionize the way you interact with technology.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="bg-transparent border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-full hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google Sign In</span>
              </>
            )}
          </button>
        </div>

        {/* Right Content - Mobile Mockup */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden flex items-center justify-center">
                <img
                  src={cahbit} 
                  alt="logo image"
                  className="w-20 h-20 opacity-50" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAILanding;