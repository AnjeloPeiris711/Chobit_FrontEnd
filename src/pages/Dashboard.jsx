import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, FileText, User, Bot, X, MessageCircle, Download } from 'lucide-react';

const Dashboard = () => {
  const [uploadedCV, setUploadedCV] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dummy API call to simulate CV analysis
  const analyzeCV = async (file) => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    
    // Add welcome message after CV upload
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Great! I've analyzed your CV "${file.name}". I can see you have experience in ${getRandomSkills()}. Feel free to ask me anything about your resume, career advice, or how to improve your profile!`,
      timestamp: new Date().toISOString()
    };
    
    setMessages([welcomeMessage]);
  };

  // Dummy function to generate random skills
  const getRandomSkills = () => {
    const skills = [
      'JavaScript, React, Node.js',
      'Python, Machine Learning, Data Analysis', 
      'Java, Spring Boot, Microservices',
      'UI/UX Design, Figma, Adobe Creative Suite',
      'Project Management, Agile, Scrum',
      'Digital Marketing, SEO, Content Strategy'
    ];
    return skills[Math.floor(Math.random() * skills.length)];
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setUploadedCV(file);
      analyzeCV(file);
    } else {
      alert('Please upload a PDF or DOC file');
    }
  };

  // Remove uploaded CV
  const removeCV = () => {
    setUploadedCV(null);
    setMessages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Dummy API call to simulate chat response
  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate dummy bot response
    const botResponse = generateBotResponse(userMessage.content);
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: botResponse,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  // Generate dummy bot responses
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('skill') || input.includes('experience')) {
      return "Based on your CV, your key skills include programming languages, frameworks, and soft skills. I'd recommend highlighting your most relevant experiences for the positions you're targeting. Would you like me to suggest specific improvements?";
    } else if (input.includes('improve') || input.includes('better')) {
      return "Here are some ways to improve your CV: 1) Add quantifiable achievements with numbers and percentages, 2) Use strong action verbs like 'implemented', 'optimized', 'led', 3) Tailor your summary for each application, 4) Include relevant keywords from job descriptions. What specific section would you like to focus on?";
    } else if (input.includes('job') || input.includes('career')) {
      return "Looking at your background, you seem well-suited for roles in your field. I'd suggest focusing on positions that match your core competencies. Consider roles that offer growth opportunities in areas you're passionate about. Are you looking for specific job recommendations?";
    } else if (input.includes('interview')) {
      return "Great question! Based on your CV, here are some common interview questions you should prepare for: 1) 'Tell me about your experience with [key skill]', 2) 'Describe a challenging project you worked on', 3) 'Where do you see yourself in 5 years?'. Would you like me to help you practice answers for any of these?";
    } else {
      return "That's an interesting question! Based on your CV analysis, I can help you with career advice, skill improvement suggestions, interview preparation, or CV optimization. What specific aspect would you like to explore further?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CV Chat Assistant</h1>
                <p className="text-purple-300 text-sm">Upload your CV and get personalized career advice</p>
              </div>
            </div>
            
            {uploadedCV && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 text-sm">{uploadedCV.name}</span>
                  <button
                    onClick={removeCV}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 h-full">
              <h3 className="text-white font-semibold mb-4">Upload Your CV</h3>
              
              {!uploadedCV ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400/80 transition-colors group"
                >
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:text-purple-300" />
                  <p className="text-purple-300 mb-2">Click to upload your CV</p>
                  <p className="text-purple-400 text-sm">PDF, DOC, DOCX files supported</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{uploadedCV.name}</p>
                        <p className="text-purple-300 text-sm">
                          {(uploadedCV.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {isAnalyzing && (
                      <div className="mt-3">
                        <div className="flex items-center space-x-2 text-purple-300">
                          <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                          <span className="text-sm">Analyzing CV...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={removeCV}
                    className="w-full bg-red-500/20 text-red-300 py-2 px-4 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Remove CV
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadedCV && (
                <div className="mt-6 pt-6 border-t border-purple-500/20">
                  <h4 className="text-white font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-purple-300 hover:text-white py-2 px-3 rounded-lg hover:bg-purple-500/20 transition-colors text-sm">
                      💡 Get CV improvement tips
                    </button>
                    <button className="w-full text-left text-purple-300 hover:text-white py-2 px-3 rounded-lg hover:bg-purple-500/20 transition-colors text-sm">
                      🎯 Find matching jobs
                    </button>
                    <button className="w-full text-left text-purple-300 hover:text-white py-2 px-3 rounded-lg hover:bg-purple-500/20 transition-colors text-sm">
                      📝 Practice interview questions
                    </button>
                    <button className="w-full text-left text-purple-300 hover:text-white py-2 px-3 rounded-lg hover:bg-purple-500/20 transition-colors text-sm">
                      📊 Skill gap analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">CV Assistant</h3>
                    <p className="text-purple-300 text-sm">
                      {uploadedCV ? 'Ready to help with your CV' : 'Upload your CV to start chatting'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!uploadedCV ? (
                  <div className="text-center py-20">
                    <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Welcome to CV Chat Assistant</h3>
                    <p className="text-purple-300">Upload your CV to start getting personalized career advice and insights</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-blue-500' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className={`px-4 py-2 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-gray-700 text-white rounded-bl-md'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              {uploadedCV && (
                <div className="p-4 border-t border-purple-500/20">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about your CV..."
                        className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                        rows="2"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-purple-400">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;