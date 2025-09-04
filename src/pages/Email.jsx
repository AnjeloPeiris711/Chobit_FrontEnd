import React, { useState, useContext } from 'react';
import { Send, Mail, Clock, CheckCircle, AlertCircle, Plus, Trash2, Edit } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EmailPage = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('compose');
    const [emailData, setEmailData] = useState({
        to: '',
        subject: '',
        body: ''
    });
    const [emailHistory, setEmailHistory] = useState([
        {
            id: 1,
            to: 'john.doe@company.com',
            subject: 'CV Discussion Follow-up',
            body: 'Hi John, Following up on our conversation about my experience in React development...',
            status: 'sent',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 2,
            to: 'hr@techcorp.com',
            subject: 'Resume Submission - Frontend Developer',
            body: 'Dear HR Team, I am submitting my resume for the Frontend Developer position...',
            status: 'pending',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
    ]);
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: 'CV Follow-up',
            subject: 'Following up on our conversation',
            body: 'Hi [Name],\n\nI wanted to follow up on our recent conversation about my experience and qualifications. Please let me know if you need any additional information about my background.\n\nBest regards,\n[Your Name]'
        },
        {
            id: 2,
            name: 'Resume Submission',
            subject: 'Resume for [Position] - [Your Name]',
            body: 'Dear Hiring Manager,\n\nI am writing to express my interest in the [Position] role at your company. Please find my resume attached for your review.\n\nI look forward to hearing from you.\n\nBest regards,\n[Your Name]'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmailData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendEmail = async () => {
        if (!emailData.to || !emailData.subject || !emailData.body) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // This is where you'd call your backend API
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken || 'your-jwt-token'}`
                },
                body: JSON.stringify({
                    to: emailData.to,
                    subject: emailData.subject,
                    body: emailData.body,
                    from: user?.email
                })
            });

            if (response.ok) {
                // Add to email history
                const newEmail = {
                    id: Date.now(),
                    ...emailData,
                    status: 'sent',
                    timestamp: new Date().toISOString()
                };
                setEmailHistory(prev => [newEmail, ...prev]);

                // Reset form
                setEmailData({ to: '', subject: '', body: '' });

                // Switch to history tab
                setActiveTab('history');

                alert('Email sent successfully!');
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const useTemplate = (template) => {
        setEmailData({
            to: emailData.to,
            subject: template.subject,
            body: template.body
        });
        setActiveTab('compose');
    };

    const saveTemplate = () => {
        if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
            alert('Please fill in all template fields');
            return;
        }

        const template = {
            id: Date.now(),
            ...newTemplate
        };

        setTemplates(prev => [...prev, template]);
        setNewTemplate({ name: '', subject: '', body: '' });
        setShowTemplateModal(false);
    };

    const deleteTemplate = (id) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Mail className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Notifications</h1>
                <p className="text-gray-600">Send emails and manage your communication history</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                {[
                    { id: 'compose', label: 'Compose', icon: Send },
                    { id: 'history', label: 'History', icon: Mail },
                    { id: 'templates', label: 'Templates', icon: Edit }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Compose Email */}
            {activeTab === 'compose' && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To
                            </label>
                            <input
                                type="email"
                                name="to"
                                value={emailData.to}
                                onChange={handleInputChange}
                                placeholder="recipient@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={emailData.subject}
                                onChange={handleInputChange}
                                placeholder="Email subject"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                name="body"
                                value={emailData.body}
                                onChange={handleInputChange}
                                placeholder="Write your message here..."
                                rows={8}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <button
                            onClick={handleSendEmail}
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Send Email</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Email History */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Email History</h2>
                        <p className="text-gray-600">View your sent and pending emails</p>
                    </div>
                    <div className="divide-y">
                        {emailHistory.length > 0 ? (
                            emailHistory.map(email => (
                                <div key={email.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                {getStatusIcon(email.status)}
                                                <span className="font-medium text-gray-900">To: {email.to}</span>
                                                <span className="text-sm text-gray-500">{formatTimestamp(email.timestamp)}</span>
                                            </div>
                                            <h3 className="font-medium text-gray-900 mb-2">{email.subject}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">{email.body}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${email.status === 'sent' ? 'bg-green-100 text-green-800' :
                                            email.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {email.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p>No emails sent yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Templates */}
            {activeTab === 'templates' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Email Templates</h2>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Template</span>
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white rounded-lg border p-4">
                                <h3 className="font-semibold">{template.title}</h3>
                                <p className="text-gray-600">{template.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Modal (show only when creating/editing) */}
                    {showTemplateModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h2 className="text-lg font-semibold mb-4">New Template</h2>
                                {/* form inputs here */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowTemplateModal(false)}
                                        className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveTemplate}
                                        className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                                    >
                                        Save Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default EmailPage;