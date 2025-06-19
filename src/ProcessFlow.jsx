import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Users, Mail, FileText, Database, BarChart3, Share2, Filter, RefreshCw, UserCheck, CheckCircle, Edit3, Save, GitBranch, User, Plus, X, Paperclip, ExternalLink, File, Link, ChevronUp, ChevronDown, ArrowRight, ArrowDown, Info, HelpCircle, Play, Home, Upload, Trash2, ChevronLeft, Settings, FolderOpen, Search, Bell, Download } from 'lucide-react';

// Modal component outside main component to prevent re-creation
const Modal = React.memo(({ isOpen, onClose, title, children, headerGradient = "from-blue-500 to-indigo-600", maxWidth = "max-w-4xl" }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.focus();
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-xl shadow-2xl ${maxWidth} w-full max-h-[90vh] flex flex-col`}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                <div className={`bg-gradient-to-r ${headerGradient} text-white p-6 rounded-t-xl flex-shrink-0`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {title}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                            type="button"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
});

// Add Step Modal - Separate component to prevent re-renders
const AddStepModal = React.memo(({ isOpen, onClose, onSubmit, handleFileUpload }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        team: '',
        responsible: '',
        contact: '',
        process: '',
        keyPoints: [''],
        attachments: []
    });

    const fileInputRef = useRef(null);

    // Only reset form when modal is first opened
    const resetForm = useCallback(() => {
        setFormData({
            title: '',
            description: '',
            team: '',
            responsible: '',
            contact: '',
            process: '',
            keyPoints: [''],
            attachments: []
        });
    }, []);

    // Reset form only when modal opens for the first time
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit(formData);
        resetForm();
    }, [formData, onSubmit, resetForm]);

    // Stable input handlers
    const handleInputChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const addKeyPoint = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            keyPoints: [...prev.keyPoints, '']
        }));
    }, []);

    const updateKeyPoint = useCallback((index) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            keyPoints: prev.keyPoints.map((point, i) => i === index ? value : point)
        }));
    }, []);

    const removeKeyPoint = useCallback((index) => () => {
        setFormData(prev => ({
            ...prev,
            keyPoints: prev.keyPoints.filter((_, i) => i !== index)
        }));
    }, []);

    const handleFileUploadModal = useCallback((e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files, (uploadedFiles) => {
                const newAttachments = uploadedFiles.map(file => ({
                    type: 'file',
                    name: file.name,
                    url: file.url,
                    icon: <File className="w-3 h-3" />
                }));
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, ...newAttachments]
                }));
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [handleFileUpload]);

    const addLinkAttachment = useCallback(() => {
        const newAttachment = {
            type: 'link',
            name: '',
            url: '',
            icon: <ExternalLink className="w-3 h-3" />
        };
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, newAttachment]
        }));
    }, []);

    const updateAttachment = useCallback((index, field) => (e) => {
        const value = e.target.value;
        setFormData(prev => {
            const newAttachments = [...prev.attachments];
            newAttachments[index] = { ...newAttachments[index], [field]: value };
            return {
                ...prev,
                attachments: newAttachments
            };
        });
    }, []);

    const removeAttachmentFromForm = useCallback((index) => () => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerGradient="from-green-500 to-emerald-600"
            title={
                <>
                    <div className="w-8 h-8 bg-white text-green-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">Add New Step</h2>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Step Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Enter step title"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Team *</label>
                        <input
                            type="text"
                            value={formData.team}
                            onChange={handleInputChange('team')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Team name"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Responsible Person *</label>
                        <input
                            type="text"
                            value={formData.responsible}
                            onChange={handleInputChange('responsible')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Person responsible"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email *</label>
                        <input
                            type="email"
                            value={formData.contact}
                            onChange={handleInputChange('contact')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="contact@vdart.com"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={handleInputChange('description')}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none transition-all"
                        placeholder="Brief description of the step"
                        autoComplete="off"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Process Details</label>
                    <textarea
                        value={formData.process}
                        onChange={handleInputChange('process')}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none transition-all"
                        placeholder="Detailed process steps and instructions"
                        autoComplete="off"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">Key Points</label>
                        <button
                            type="button"
                            onClick={addKeyPoint}
                            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                        >
                            <Plus className="w-3 h-3" />
                            Add Point
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.keyPoints.map((point, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={point}
                                    onChange={updateKeyPoint(index)}
                                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder={`Key point ${index + 1}`}
                                />
                                {formData.keyPoints.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={removeKeyPoint(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-slate-700">Attachments & Resources</label>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUploadModal}
                                multiple
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                <Upload className="w-3 h-3" />
                                Upload File
                            </button>
                            <button
                                type="button"
                                onClick={addLinkAttachment}
                                className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm"
                            >
                                <Link className="w-3 h-3" />
                                Add Link
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {formData.attachments.map((attachment, index) => (
                            <div key={index} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
                                        ${attachment.type === 'file'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-purple-100 text-purple-700'
                                        }
                                    `}>
                                        {attachment.icon}
                                        {attachment.type === 'file' ? 'File' : 'Link'}
                                    </div>
                                    <input
                                        type="text"
                                        value={attachment.name}
                                        onChange={updateAttachment(index, 'name')}
                                        className="flex-1 p-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all"
                                        placeholder={attachment.type === 'file' ? 'File name' : 'Link title'}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeAttachmentFromForm(index)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {attachment.type === 'link' && (
                                    <input
                                        type="url"
                                        value={attachment.url || ''}
                                        onChange={updateAttachment(index, 'url')}
                                        className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all"
                                        placeholder="https://example.com"
                                        autoComplete="off"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-md"
                    >
                        Add Step
                    </button>
                </div>
            </form>
        </Modal>
    );
});

// Edit Step Modal - Separate component
const EditStepModal = React.memo(({ isOpen, onClose, onSubmit, editingStepData, handleFileUpload }) => {
    const [formData, setFormData] = useState({});
    const editFileInputRef = useRef(null);

    // Initialize form data when editing step data changes
    useEffect(() => {
        if (editingStepData && isOpen) {
            setFormData({ ...editingStepData });
        }
    }, [editingStepData, isOpen]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit(formData);
    }, [formData, onSubmit]);

    const handleInputChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const addKeyPoint = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            keyPoints: [...(prev.keyPoints || []), '']
        }));
    }, []);

    const updateKeyPoint = useCallback((index) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            keyPoints: (prev.keyPoints || []).map((point, i) => i === index ? value : point)
        }));
    }, []);

    const removeKeyPoint = useCallback((index) => () => {
        setFormData(prev => ({
            ...prev,
            keyPoints: (prev.keyPoints || []).filter((_, i) => i !== index)
        }));
    }, []);

    const handleFileUploadModal = useCallback((e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files, (uploadedFiles) => {
                const newAttachments = uploadedFiles.map(file => ({
                    type: 'file',
                    name: file.name,
                    url: file.url,
                    icon: <File className="w-3 h-3" />
                }));
                setFormData(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), ...newAttachments]
                }));
            });
            if (editFileInputRef.current) {
                editFileInputRef.current.value = '';
            }
        }
    }, [handleFileUpload]);

    const addLinkAttachment = useCallback(() => {
        const newAttachment = {
            type: 'link',
            name: '',
            url: '',
            icon: <ExternalLink className="w-3 h-3" />
        };
        setFormData(prev => ({
            ...prev,
            attachments: [...(prev.attachments || []), newAttachment]
        }));
    }, []);

    const updateAttachment = useCallback((index, field) => (e) => {
        const value = e.target.value;
        setFormData(prev => {
            const newAttachments = [...(prev.attachments || [])];
            newAttachments[index] = { ...newAttachments[index], [field]: value };
            return {
                ...prev,
                attachments: newAttachments
            };
        });
    }, []);

    const removeAttachmentFromForm = useCallback((index) => () => {
        setFormData(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter((_, i) => i !== index)
        }));
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerGradient="from-blue-500 to-indigo-600"
            title={
                <>
                    <div className="w-8 h-8 bg-white text-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Edit3 className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">Edit Step</h2>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Step Title *</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={handleInputChange('title')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Team *</label>
                        <input
                            type="text"
                            value={formData.team || ''}
                            onChange={handleInputChange('team')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Responsible Person *</label>
                        <input
                            type="text"
                            value={formData.responsible || ''}
                            onChange={handleInputChange('responsible')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email *</label>
                        <input
                            type="email"
                            value={formData.contact || ''}
                            onChange={handleInputChange('contact')}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                    <textarea
                        value={formData.description || ''}
                        onChange={handleInputChange('description')}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none transition-all"
                        autoComplete="off"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Process Details</label>
                    <textarea
                        value={formData.process || ''}
                        onChange={handleInputChange('process')}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none transition-all"
                        autoComplete="off"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">Key Points</label>
                        <button
                            type="button"
                            onClick={addKeyPoint}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                            <Plus className="w-3 h-3" />
                            Add Point
                        </button>
                    </div>
                    <div className="space-y-2">
                        {(formData.keyPoints || []).map((point, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={point}
                                    onChange={updateKeyPoint(index)}
                                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder={`Key point ${index + 1}`}
                                />
                                {(formData.keyPoints || []).length > 1 && (
                                    <button
                                        type="button"
                                        onClick={removeKeyPoint(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-slate-700">Attachments & Resources</label>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={editFileInputRef}
                                onChange={handleFileUploadModal}
                                multiple
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                            />
                            <button
                                type="button"
                                onClick={() => editFileInputRef.current?.click()}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                <Upload className="w-3 h-3" />
                                Upload File
                            </button>
                            <button
                                type="button"
                                onClick={addLinkAttachment}
                                className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm"
                            >
                                <Link className="w-3 h-3" />
                                Add Link
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {(formData.attachments || []).map((attachment, index) => (
                            <div key={index} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
                                        ${attachment.type === 'file'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-purple-100 text-purple-700'
                                        }
                                    `}>
                                        {attachment.icon}
                                        {attachment.type === 'file' ? 'File' : 'Link'}
                                    </div>
                                    <input
                                        type="text"
                                        value={attachment.name || ''}
                                        onChange={updateAttachment(index, 'name')}
                                        className="flex-1 p-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                                        placeholder={attachment.type === 'file' ? 'File name' : 'Link title'}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeAttachmentFromForm(index)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {attachment.type === 'link' && (
                                    <input
                                        type="url"
                                        value={attachment.url || ''}
                                        onChange={updateAttachment(index, 'url')}
                                        className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                                        placeholder="https://example.com"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-md"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
});

// Step Details Modal
const StepDetails = React.memo(({ step, onClose, downloadTemplate }) => (
    <Modal
        isOpen={!!step}
        onClose={onClose}
        headerGradient="from-slate-700 to-slate-800"
        title={
            <>
                <div className="w-8 h-8 bg-white text-slate-800 bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
                    {step?.id}
                </div>
                <h2 className="text-xl font-bold">{step?.title}</h2>
            </>
        }
    >
        <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Overview
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">{step?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        Team
                    </h4>
                    <p className="text-slate-700 text-sm">{step?.team}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        Responsible
                    </h4>
                    <p className="text-slate-700 text-sm">{step?.responsible}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-600" />
                        Contact
                    </h4>
                    <p className="text-blue-700 text-sm font-medium">{step?.contact}</p>
                </div>
            </div>

            {step?.process && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        How to Execute
                    </h3>
                    <div className="bg-white p-4 rounded border border-green-200">
                        <p className="text-green-800 text-sm leading-relaxed whitespace-pre-line">{step.process}</p>
                    </div>
                </div>
            )}

            {step?.keyPoints && step.keyPoints.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Key Points
                    </h3>
                    <div className="space-y-2">
                        {step.keyPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded border border-amber-200">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-amber-800 text-sm leading-relaxed">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step?.attachments && step.attachments.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Resources & Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded border border-purple-200 hover:shadow-md transition-shadow">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                    ${attachment.type === 'file' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                                `}>
                                    {attachment.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{attachment.name}</p>
                                    <p className="text-xs text-slate-600">{attachment.type === 'file' ? 'File' : 'External Link'}</p>
                                </div>
                                <button
                                    onClick={() => attachment.type === 'link' ? window.open(attachment.url, '_blank') : downloadTemplate('contract')}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    {attachment.type === 'file' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </Modal>
));

// Step Card component with memo
const StepCard = React.memo(({ step, isConditional = false, isProcess = true, stepIndex, showAddButton = false, onEditClick, onDeleteClick, onAddClick, setSelectedStep, selectedStep, isAdminMode }) => (
    <div className="flex items-center w-full">
        <div
            className={`relative bg-white rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer w-full transform hover:-translate-y-1
                ${selectedStep === step.id ? 'border-blue-500 shadow-blue-200 scale-105' : 'border-slate-200 hover:border-slate-300'}
                ${isConditional ? 'border-orange-300 hover:border-orange-400' : ''}
            `}
            onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
        >
            <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg text-white
                ${isConditional ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-slate-700 to-slate-800'}
            `}>
                {step.id}
            </div>

            {isAdminMode && !isConditional && (
                <div className="absolute -top-2 -right-2 flex gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(step, isProcess);
                        }}
                        className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    >
                        <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(step.id, isProcess);
                        }}
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            {isConditional && (
                <div className="absolute -top-2 right-4">
                    <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-full border border-orange-300 shadow-sm">
                        {step.condition}
                    </span>
                </div>
            )}

            <div className="p-5">
                <div className="flex gap-3 mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-white flex-shrink-0 shadow-md
                        ${isConditional ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}
                    `}>
                        {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                            {step.title}
                        </h3>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-xs border border-blue-200">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">{step.team}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 rounded-lg text-xs border border-slate-200">
                        <User className="w-3 h-3" />
                        <span className="font-medium">{step.responsible}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {step.description}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs mb-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    <span className="text-blue-700 font-medium">{step.contact}</span>
                </div>

                {step.attachments && step.attachments.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-1 mb-2">
                            <Paperclip className="w-3 h-3 text-slate-500" />
                            <span className="text-xs text-slate-600">{step.attachments.length} resource(s)</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full hover:bg-slate-100 transition-colors">
                        <Info className="w-3 h-3" />
                        Click for details
                    </span>
                </div>
            </div>
        </div>

        {isAdminMode && showAddButton && !isConditional && (
            <div className="flex items-center ml-4">
                <button
                    onClick={() => onAddClick(isProcess ? 'initial' : 'final', stepIndex)}
                    className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
                    title="Add new step after this one"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>
));

// Decision Branch component
const DecisionBranch = React.memo(({ conditionalSteps, onEditClick, onDeleteClick, setSelectedStep, selectedStep, isAdminMode }) => (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                <GitBranch className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-semibold text-orange-900 text-lg">Decision Point</h3>
                <p className="text-orange-700 text-sm">Review results and choose the appropriate path</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {conditionalSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                    <StepCard
                        step={step}
                        isConditional={true}
                        showConnector={false}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                        setSelectedStep={setSelectedStep}
                        selectedStep={selectedStep}
                        isAdminMode={isAdminMode}
                    />
                </div>
            ))}
        </div>

        <div className="text-center mt-6 p-4 bg-white rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 leading-relaxed">
                <strong>Decision Criteria:</strong> If team leads request changes to the data, follow the correction path.
                If all data is approved as-is, proceed directly to integration.
            </p>
        </div>
    </div>
));

const ProcessFlow = () => {
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [showGuidance, setShowGuidance] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStepData, setEditingStepData] = useState(null);
    const [addStepType, setAddStepType] = useState('initial');
    const [addStepPosition, setAddStepPosition] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState('sales-reporting');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const processTypes = useMemo(() => [
        { id: 'sales-reporting', name: 'Sales Reporting Process', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'hr-onboarding', name: 'HR Onboarding Process', icon: <Users className="w-4 h-4" /> },
        { id: 'project-management', name: 'Project Management Process', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'quality-assurance', name: 'Quality Assurance Process', icon: <CheckCircle className="w-4 h-4" /> }
    ], []);

    const [processData, setProcessData] = useState([
        {
            id: 1,
            title: "Contracts Data Collection",
            description: "Collect comprehensive start data from the contracts team, capturing all active contracts, new joiner information, and employment details.",
            icon: <Users className="w-4 h-4" />,
            team: "Contracts Team",
            responsible: "Shan",
            contact: "contracts@vdart.com",
            process: "Access the contract management portal and download the latest contract data using the provided template. Ensure all new joiners and contract updates are included.",
            keyPoints: [
                "Use official contract template for consistency",
                "Verify all employment types are correctly categorized",
                "Include both active and pending contracts",
                "Coordinate with Shan for any data clarifications"
            ],
            attachments: [
                { type: 'file', name: 'Contract_Template.xlsx', url: '#', icon: <File className="w-3 h-3" /> },
                { type: 'link', name: 'Contract Management Portal', url: 'https://contracts.vdart.com', icon: <ExternalLink className="w-3 h-3" /> }
            ]
        },
        {
            id: 2,
            title: "Non-IT Data Collection",
            description: "Gather detailed non-IT start data through structured communication with department heads across all non-technical divisions.",
            icon: <Mail className="w-4 h-4" />,
            team: "Operations Team",
            responsible: "Priya",
            contact: "operations@vdart.com",
            process: "Send structured data requests to all department heads using the standard email template. Follow up systematically and compile responses.",
            keyPoints: [
                "Use standardized email template for consistency",
                "Send requests to all relevant department heads",
                "Maintain communication log for tracking",
                "Escalate through Priya for delayed responses"
            ],
            attachments: [
                { type: 'file', name: 'Non_IT_Data_Form.pdf', url: '#', icon: <File className="w-3 h-3" /> }
            ]
        },
        {
            id: 3,
            title: "Data Consolidation & Integration",
            description: "Merge and organize all collected data from multiple sources into a unified, structured format for processing.",
            icon: <FileText className="w-4 h-4" />,
            team: "Data Management",
            responsible: "Process Owner",
            contact: "datamanagement@vdart.com",
            process: "Import data from both contracts and non-IT sources into the master consolidation sheet. Standardize formats and resolve any structural inconsistencies.",
            keyPoints: [
                "Use master consolidation template",
                "Standardize all data formats before merging",
                "Document any format changes made",
                "Maintain original source file backups"
            ],
            attachments: []
        },
        {
            id: 4,
            title: "Comprehensive Data Validation",
            description: "Perform thorough validation of all entries, cross-referencing with existing records and verifying completeness.",
            icon: <CheckCircle className="w-4 h-4" />,
            team: "Quality Assurance",
            responsible: "QA Team",
            contact: "qa@vdart.com",
            process: "Run validation checks against the consolidated data using established QA protocols. Identify discrepancies and flag incomplete records.",
            keyPoints: [
                "Follow standard QA validation protocols",
                "Cross-reference with previous period data",
                "Flag all discrepancies for review",
                "Document validation results thoroughly"
            ],
            attachments: [
                { type: 'link', name: 'QA Checklist Portal', url: 'https://qa.vdart.com', icon: <ExternalLink className="w-3 h-3" /> }
            ]
        },
        {
            id: 5,
            title: "Team Lead Verification & Sign-off",
            description: "Distribute data to respective team leads for verification and obtain formal approval before proceeding to final processing.",
            icon: <UserCheck className="w-4 h-4" />,
            team: "Team Leadership",
            responsible: "All Team Leads",
            contact: "teamleads@vdart.com",
            process: "Send verification emails to each team lead with their team's data. Collect formal approvals and document any requested changes.",
            keyPoints: [
                "Send personalized verification emails to each lead",
                "Provide clear data summaries for review",
                "Set reasonable response timeframes",
                "Document all approvals and change requests"
            ],
            attachments: []
        }
    ]);

    const conditionalSteps = useMemo(() => [
        {
            id: '6a',
            title: "Data Correction & Re-validation",
            description: "Process identified corrections, implement changes, and return to teams for final confirmation.",
            icon: <RefreshCw className="w-4 h-4" />,
            team: "Revision Process",
            responsible: "Data Team",
            contact: "datarevision@vdart.com",
            condition: "If Changes Required",
            process: "Implement all requested corrections in the consolidated dataset and send back to respective teams for final confirmation.",
            attachments: []
        },
        {
            id: '6b',
            title: "Direct Data Integration",
            description: "Integrate approved data directly into the processing pipeline without modifications.",
            icon: <Database className="w-4 h-4" />,
            team: "Data Integration",
            responsible: "Data Team",
            contact: "dataintegration@vdart.com",
            condition: "If No Changes Required",
            process: "Move validated data directly to the processing phase, maintaining all integrity checks throughout integration.",
            attachments: []
        }
    ], []);

    const [finalSteps, setFinalSteps] = useState([
        {
            id: 7,
            title: "Final Data Confirmation",
            description: "Conduct final review to ensure complete accuracy and stakeholder alignment before processing phase.",
            icon: <CheckCircle className="w-4 h-4" />,
            team: "Final Review",
            responsible: "Process Owner",
            contact: "finalreview@vdart.com",
            process: "Perform comprehensive final review of all data elements and obtain sign-off from key stakeholders.",
            keyPoints: [
                "Review all data elements systematically",
                "Verify stakeholder approvals are documented",
                "Confirm no outstanding issues remain",
                "Authorize progression to processing phase"
            ],
            attachments: []
        },
        {
            id: 8,
            title: "Duplicate Detection & Removal",
            description: "Execute systematic duplicate detection and removal processes to ensure data integrity.",
            icon: <Filter className="w-4 h-4" />,
            team: "Data Cleaning",
            responsible: "Data Team",
            contact: "datacleaning@vdart.com",
            process: "Run automated duplicate detection algorithms followed by manual verification of flagged records.",
            keyPoints: [
                "Use established duplicate detection criteria",
                "Manually verify all flagged potential duplicates",
                "Document all removals with justification",
                "Maintain audit trail of cleaning actions"
            ],
            attachments: []
        },
        {
            id: 9,
            title: "Dashboard Data Preparation",
            description: "Apply filtering and categorization logic to prepare data for dashboard visualization.",
            icon: <BarChart3 className="w-4 h-4" />,
            team: "Analytics Team",
            responsible: "Analytics Specialist",
            contact: "analytics@vdart.com",
            process: "Apply business logic to categorize Deal, PT, and PTR counts according to dashboard requirements.",
            keyPoints: [
                "Follow established categorization rules",
                "Validate count totals against source data",
                "Prepare data in dashboard-ready format",
                "Test data load into dashboard environment"
            ],
            attachments: []
        },
        {
            id: 10,
            title: "PowerBI Dashboard Update",
            description: "Refresh PowerBI dashboard with processed data and verify all visualizations display correctly.",
            icon: <RefreshCw className="w-4 h-4" />,
            team: "Business Intelligence",
            responsible: "BI Specialist",
            contact: "bi@vdart.com",
            process: "Load processed data into PowerBI environment, refresh all data connections, and validate dashboard functionality.",
            keyPoints: [
                "Backup current dashboard before updates",
                "Verify all data connections refresh properly",
                "Test all interactive dashboard elements",
                "Validate calculated measures and totals"
            ],
            attachments: []
        },
        {
            id: 11,
            title: "Dashboard Distribution",
            description: "Distribute updated dashboard access to stakeholders and provide usage guidelines.",
            icon: <Share2 className="w-4 h-4" />,
            team: "Distribution",
            responsible: "Process Owner",
            contact: "distribution@vdart.com",
            process: "Send dashboard links to authorized stakeholders with access instructions and usage guidelines.",
            keyPoints: [
                "Verify stakeholder access permissions",
                "Include usage guidelines in distribution",
                "Provide contact information for support",
                "Document distribution completion"
            ],
            attachments: []
        }
    ]);

    // Prevent body scroll when modals are open
    useEffect(() => {
        if (showAddModal || showEditModal || selectedStep) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showAddModal, showEditModal, selectedStep]);

    // Stable callbacks
    const handleFileUpload = useCallback((files, callback) => {
        const newFiles = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadDate: new Date().toISOString()
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        callback(newFiles);
    }, []);

    const downloadTemplate = useCallback((templateType) => {
        const templates = {
            'contract': 'Contract_Template.xlsx',
            'data-form': 'Data_Collection_Form.pdf',
            'checklist': 'QA_Checklist.pdf'
        };

        alert(`Downloading ${templates[templateType]}...`);
    }, []);

    const openEditModal = useCallback((step, isProcess = true) => {
        setEditingStepData({ ...step, isProcess });
        setShowEditModal(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setEditingStepData(null);
        setShowEditModal(false);
    }, []);

    const handleEditSubmit = useCallback((formData) => {
        if (formData.isProcess) {
            setProcessData(prev => prev.map(step =>
                step.id === formData.id ? formData : step
            ));
        } else {
            setFinalSteps(prev => prev.map(step =>
                step.id === formData.id ? formData : step
            ));
        }
        closeEditModal();
    }, [closeEditModal]);

    const openAddModal = useCallback((type = 'initial', position = null) => {
        setAddStepType(type);
        setAddStepPosition(position);
        setShowAddModal(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setShowAddModal(false);
        setAddStepType('initial');
        setAddStepPosition(null);
    }, []);

    const handleAddSubmit = useCallback((stepData) => {
        const newStep = {
            id: Date.now(),
            title: stepData.title || 'New Step',
            description: stepData.description || 'Step description',
            icon: <FileText className="w-4 h-4" />,
            team: stepData.team || 'Team Name',
            responsible: stepData.responsible || 'Responsible Person',
            contact: stepData.contact || 'contact@vdart.com',
            process: stepData.process || 'Process details',
            keyPoints: stepData.keyPoints || [],
            attachments: stepData.attachments || []
        };

        if (addStepType === 'initial') {
            if (addStepPosition !== null) {
                setProcessData(prev => {
                    const newArray = [...prev];
                    newArray.splice(addStepPosition + 1, 0, newStep);
                    return newArray.map((step, index) => ({ ...step, id: index + 1 }));
                });
            } else {
                setProcessData(prev => [...prev, { ...newStep, id: prev.length + 1 }]);
            }
        } else if (addStepType === 'final') {
            if (addStepPosition !== null) {
                setFinalSteps(prev => {
                    const newArray = [...prev];
                    newArray.splice(addStepPosition + 1, 0, newStep);
                    return newArray.map((step, index) => ({ ...step, id: index + 7 }));
                });
            } else {
                setFinalSteps(prev => [...prev, { ...newStep, id: prev.length + 7 }]);
            }
        }
        closeAddModal();
    }, [addStepType, addStepPosition, closeAddModal]);

    const deleteStep = useCallback((stepId, isProcess = true) => {
        if (window.confirm('Are you sure you want to delete this step?')) {
            if (isProcess) {
                setProcessData(prev => prev.filter(step => step.id !== stepId)
                    .map((step, index) => ({ ...step, id: index + 1 })));
            } else {
                setFinalSteps(prev => prev.filter(step => step.id !== stepId)
                    .map((step, index) => ({ ...step, id: index + 7 })));
            }
        }
    }, []);

    const handleSetSelectedStep = useCallback((stepId) => {
        setSelectedStep(stepId);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
            {/* Enhanced Sidebar */}
            <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 shadow-lg flex flex-col min-h-screen">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white flex-shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold">Process Guide</h2>
                    </div>
                    <p className="text-slate-300 text-sm">Everything you need to know</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Process Overview
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm font-bold">{processData.length}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Collection Steps</p>
                                    <p className="text-xs text-slate-600">Data gathering phase</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm font-bold">2</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Decision Paths</p>
                                    <p className="text-xs text-slate-600">Review outcomes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm font-bold">{finalSteps.length}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Processing Steps</p>
                                    <p className="text-xs text-slate-600">Final phase</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Process Summary
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                                    <Database className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1 text-sm">Data Collection</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">Systematic gathering from multiple sources</p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1 text-sm">Quality Assurance</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">Multi-stage validation and approval</p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                                    <Share2 className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1 text-sm">Distribution</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">Dashboard creation and access</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Key Contacts
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Shan</p>
                                    <p className="text-xs text-blue-700 font-medium">Contracts Team Lead</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Priya</p>
                                    <p className="text-xs text-green-700 font-medium">Operations Lead</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">QA Team</p>
                                    <p className="text-xs text-purple-700 font-medium">Quality Assurance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg border border-amber-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                Pro Tips
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex gap-3 p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
                                <div className="w-2 h-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-amber-900 leading-relaxed">Always verify data completeness before moving to the next step</p>
                            </div>
                            <div className="flex gap-3 p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
                                <div className="w-2 h-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-amber-900 leading-relaxed">Keep backup copies of original data files</p>
                            </div>
                            <div className="flex gap-3 p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
                                <div className="w-2 h-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-amber-900 leading-relaxed">Document all changes and decisions</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Current Status
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">Active Process</span>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Running</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">Team Alerts</span>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">3 Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Quick Actions
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200">
                                <Download className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-800">Download Templates</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200">
                                <Search className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-800">Search Process</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200">
                                <Bell className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-800">Set Notifications</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <div className="bg-white shadow-lg border-b border-slate-200 p-6 flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Main
                            </button>

                            <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                {processTypes.find(p => p.id === selectedProcess)?.icon || <BarChart3 className="w-6 h-6 text-white" />}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">VDart Process Flow Manager</h1>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-slate-600">Current Process:</label>
                                    <select
                                        value={selectedProcess}
                                        onChange={(e) => setSelectedProcess(e.target.value)}
                                        className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {processTypes.map(process => (
                                            <option key={process.id} value={process.id}>
                                                {process.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                                <Bell className="w-4 h-4 text-slate-600" />
                                <span className="text-sm text-slate-700">3 notifications</span>
                            </div>

                            {isAdminMode && (
                                <button
                                    onClick={() => openAddModal('initial')}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Step
                                </button>
                            )}

                            <button
                                onClick={() => setIsAdminMode(!isAdminMode)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                                    ${isAdminMode
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-red-200'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-slate-200'
                                    }
                                `}
                            >
                                <Settings className="w-4 h-4" />
                                {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
                            </button>
                        </div>
                    </div>

                    {showGuidance && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Info className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-blue-900 mb-1">Welcome to Process Flow Manager</h3>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        Navigate through the process steps, click on cards for detailed information, and use the sidebar for quick reference.
                                        Switch between different process types using the dropdown above.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowGuidance(false)}
                                    className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">1</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Data Collection Phase</h2>
                                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                            </div>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {processData.map((step, index) => (
                                    <div key={step.id} className="flex items-center gap-4">
                                        <StepCard
                                            step={step}
                                            stepIndex={index}
                                            showAddButton={isAdminMode && index < processData.length - 1}
                                            onEditClick={openEditModal}
                                            onDeleteClick={deleteStep}
                                            onAddClick={openAddModal}
                                            setSelectedStep={handleSetSelectedStep}
                                            selectedStep={selectedStep}
                                            isAdminMode={isAdminMode}
                                        />
                                        {isAdminMode && index < processData.length - 1 && (
                                            <ArrowRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="flex items-center gap-4">
                                <ArrowDown className="w-6 h-6 text-slate-400" />
                                <span className="text-sm text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm font-medium">Review Phase</span>
                                <ArrowDown className="w-6 h-6 text-slate-400" />
                            </div>
                        </div>

                        <div>
                            <DecisionBranch
                                conditionalSteps={conditionalSteps}
                                onEditClick={openEditModal}
                                onDeleteClick={deleteStep}
                                setSelectedStep={handleSetSelectedStep}
                                selectedStep={selectedStep}
                                isAdminMode={isAdminMode}
                            />
                        </div>

                        <div className="flex justify-center">
                            <div className="flex items-center gap-4">
                                <ArrowDown className="w-6 h-6 text-slate-400" />
                                <span className="text-sm text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm font-medium">Final Phase</span>
                                <ArrowDown className="w-6 h-6 text-slate-400" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">3</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Processing & Distribution Phase</h2>
                                <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
                            </div>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {finalSteps.map((step, index) => (
                                    <div key={step.id} className="flex items-center gap-4">
                                        <StepCard
                                            step={step}
                                            isProcess={false}
                                            stepIndex={index}
                                            showAddButton={isAdminMode && index < finalSteps.length - 1}
                                            onEditClick={openEditModal}
                                            onDeleteClick={deleteStep}
                                            onAddClick={openAddModal}
                                            setSelectedStep={handleSetSelectedStep}
                                            selectedStep={selectedStep}
                                            isAdminMode={isAdminMode}
                                        />
                                        {isAdminMode && index < finalSteps.length - 1 && (
                                            <ArrowRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedStep && (
                <StepDetails
                    step={[...processData, ...finalSteps].find(s => s.id === selectedStep)}
                    onClose={() => setSelectedStep(null)}
                    downloadTemplate={downloadTemplate}
                />
            )}

            <AddStepModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                onSubmit={handleAddSubmit}
                handleFileUpload={handleFileUpload}
            />

            <EditStepModal
                isOpen={showEditModal}
                onClose={closeEditModal}
                onSubmit={handleEditSubmit}
                editingStepData={editingStepData}
                handleFileUpload={handleFileUpload}
            />
        </div>
    );
};

export default ProcessFlow;