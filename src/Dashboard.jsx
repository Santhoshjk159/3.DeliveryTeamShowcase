import React, { useState, useEffect } from 'react';
import {
    Upload,
    File,
    Folder,
    Search,
    Download,
    Eye,
    Trash2,
    Plus,
    X,
    FileText,
    Image,
    Video,
    Music,
    Archive,
    Grid,
    List,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    Clock,
    User,
    Calendar,
    FolderOpen,
    Monitor,
    Paperclip,
    Edit3,
    Sparkles,
    Zap
} from 'lucide-react';

const Dashboard = ({ onBack }) => {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadCategory, setUploadCategory] = useState('');
    const [fileName, setFileName] = useState('');
    const [notification, setNotification] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE = 'http://localhost:3001/api';

    const categories = [
        { name: 'All', icon: <Folder className="w-4 h-4" />, color: 'bg-gray-500' },
        { name: 'Documents', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-600' },
        { name: 'Images', icon: <Image className="w-4 h-4" />, color: 'bg-green-600' },
        { name: 'Videos', icon: <Video className="w-4 h-4" />, color: 'bg-red-600' },
        { name: 'Audio', icon: <Music className="w-4 h-4" />, color: 'bg-purple-600' },
        { name: 'Archives', icon: <Archive className="w-4 h-4" />, color: 'bg-yellow-600' },
        { name: 'Reports', icon: <FileText className="w-4 h-4" />, color: 'bg-indigo-600' },
        { name: 'Presentations', icon: <Monitor className="w-4 h-4" />, color: 'bg-pink-600' }
    ];

    // Load files from server on component mount
    useEffect(() => {
        fetchFiles();
    }, []);

    // Filter files based on category and search
    useEffect(() => {
        let filtered = files;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(file => file.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(file =>
                file.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFiles(filtered);
    }, [files, selectedCategory, searchTerm]);

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/files`);
            if (response.ok) {
                const files = await response.json();
                setFiles(files);
                setFilteredFiles(files);
            } else {
                throw new Error('Failed to fetch files');
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            showNotification('Failed to load files. Make sure the server is running.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFileSelection(file);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const handleFileSelection = (file) => {
        // Check file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            showNotification('File size must be less than 100MB', 'error');
            return;
        }
        setSelectedFile(file);
        setFileName(file.name); // Set initial filename
    };

    const submitUpload = async () => {
        if (selectedFile && uploadCategory && fileName.trim()) {
            try {
                setUploadProgress(10);

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('category', uploadCategory);
                formData.append('customName', fileName.trim());

                setUploadProgress(50);

                const response = await fetch(`${API_BASE}/upload`, {
                    method: 'POST',
                    body: formData
                });

                setUploadProgress(80);

                if (response.ok) {
                    const result = await response.json();
                    setUploadProgress(100);

                    setTimeout(() => {
                        fetchFiles(); // Refresh file list
                        setShowUploadModal(false);
                        setSelectedFile(null);
                        setUploadCategory('');
                        setFileName('');
                        setUploadProgress(0);
                        showNotification(`"${fileName}" uploaded successfully!`);
                    }, 500);
                } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
                }
            } catch (error) {
                setUploadProgress(0);
                showNotification(error.message || 'Upload failed. Please try again.', 'error');
                console.error('Upload error:', error);
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleDownload = async (file) => {
        try {
            const response = await fetch(`${API_BASE}/files/${file.filename}`);
            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showNotification(`"${file.name}" downloaded successfully`);
        } catch (error) {
            showNotification('Download failed', 'error');
            console.error('Download error:', error);
        }
    };

    const handlePreview = (file) => {
        setPreviewFile(file);
    };

    const handleDelete = async (fileId, fileName) => {
        if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
            try {
                const response = await fetch(`${API_BASE}/files/${fileId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchFiles(); // Refresh file list
                    showNotification('File deleted successfully');
                } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Delete failed');
                }
            } catch (error) {
                showNotification(error.message || 'Delete failed', 'error');
                console.error('Delete error:', error);
            }
        }
    };

    const getFileIcon = (type) => {
        const iconClass = "w-6 h-6";
        switch (type.toLowerCase()) {
            case 'pdf':
                return <FileText className={`${iconClass} text-red-600`} />;
            case 'doc':
            case 'docx':
                return <FileText className={`${iconClass} text-blue-600`} />;
            case 'ppt':
            case 'pptx':
                return <Monitor className={`${iconClass} text-orange-600`} />;
            case 'xls':
            case 'xlsx':
                return <FileText className={`${iconClass} text-green-600`} />;
            case 'txt':
                return <FileText className={`${iconClass} text-gray-600`} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return <Image className={`${iconClass} text-green-600`} />;
            case 'mp4':
            case 'avi':
            case 'mov':
            case 'wmv':
                return <Video className={`${iconClass} text-red-600`} />;
            case 'mp3':
            case 'wav':
            case 'flac':
                return <Music className={`${iconClass} text-purple-600`} />;
            case 'zip':
            case 'rar':
            case '7z':
                return <Archive className={`${iconClass} text-yellow-600`} />;
            default:
                return <File className={`${iconClass} text-gray-500`} />;
        }
    };

    const getCategoryStats = () => {
        return categories.map(category => ({
            ...category,
            count: category.name === 'All'
                ? files.length
                : files.filter(file => file.category === category.name).length
        }));
    };

    const clearAllFiles = async () => {
        if (window.confirm('⚠️ This will permanently delete ALL files. This action cannot be undone.\n\nAre you absolutely sure?')) {
            try {
                // Delete all files one by one
                const deletePromises = files.map(file =>
                    fetch(`${API_BASE}/files/${file.id}`, { method: 'DELETE' })
                );

                await Promise.all(deletePromises);
                fetchFiles(); // Refresh file list
                showNotification('All files have been deleted');
            } catch (error) {
                showNotification('Failed to delete all files', 'error');
                console.error('Clear all error:', error);
            }
        }
    };

    const renderPreview = (file) => {
        const fileUrl = `${API_BASE}/files/${file.filename}`;
        const fileType = file.type.toLowerCase();

        if (file.mimeType?.startsWith('image/')) {
            return (
                <div className="flex justify-center">
                    <img
                        src={fileUrl}
                        alt={file.name}
                        className="max-w-full max-h-96 object-contain shadow-lg"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div style={{ display: 'none' }} className="text-center py-8">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Unable to load image preview</p>
                    </div>
                </div>
            );
        }

        if (fileType === 'pdf') {
            return (
                <div className="w-full h-96">
                    <embed
                        src={fileUrl}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        className="border border-gray-300"
                    />
                </div>
            );
        }

        if (file.mimeType?.startsWith('video/')) {
            return (
                <div className="flex justify-center">
                    <video
                        controls
                        className="max-w-full max-h-96 shadow-lg"
                        preload="metadata"
                    >
                        <source src={fileUrl} type={file.mimeType} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        if (file.mimeType?.startsWith('audio/')) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <Music className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                        <audio controls className="mb-4">
                            <source src={fileUrl} type={file.mimeType} />
                            Your browser does not support the audio tag.
                        </audio>
                        <p className="text-gray-600 font-medium">{file.name}</p>
                    </div>
                </div>
            );
        }

        if (file.mimeType === 'text/plain') {
            return (
                <div className="bg-gray-50 p-4 max-h-96 overflow-auto">
                    <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Text file preview</p>
                        <p className="text-sm text-gray-500 mt-2">Download to view content</p>
                    </div>
                </div>
            );
        }

        // Default preview for unsupported file types
        return (
            <div className="text-center py-12">
                <div className="mb-6">
                    {getFileIcon(file.type)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{file.name}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-6">
                    <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                    <p><strong>Type:</strong> {file.type.toUpperCase()}</p>
                    <p><strong>Uploaded:</strong> {file.uploadDate} at {file.uploadTime}</p>
                </div>
                <div className="space-y-3">
                    <p className="text-gray-500">Preview not available for this file type</p>
                    <button
                        onClick={() => handleDownload(file)}
                        className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download File</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-montserrat">
            {/* Professional Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border flex items-center space-x-3 ${notification.type === 'success'
                        ? 'bg-white/90 border-green-200 text-green-800'
                        : 'bg-white/90 border-red-200 text-red-800'
                    } max-w-md transition-all duration-500 transform animate-slide-in`}>
                    {notification.type === 'success' ?
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> :
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    }
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Enhanced Header */}
            <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Back to Homepage</span>
                            </button>
                            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="w-6 h-6 text-indigo-600" />
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                        File Management Center
                                    </h1>
                                </div>
                                <p className="text-sm text-gray-600">Organize and manage your digital assets</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
                                <div className="text-sm font-bold text-gray-900">{files.length} Files</div>
                                <div className="text-xs text-gray-500">
                                    {files.reduce((total, file) => total + (file.size || 0), 0) > 0
                                        ? formatFileSize(files.reduce((total, file) => total + (file.size || 0), 0))
                                        : '0 Bytes'
                                    }
                                </div>
                            </div>
                            {files.length > 0 && (
                                <button
                                    onClick={clearAllFiles}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Clear All</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Upload Files</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Enhanced Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/70 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <FolderOpen className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                            </div>
                            <div className="space-y-2">
                                {getCategoryStats().map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 font-medium ${selectedCategory === category.name
                                                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 text-indigo-700 shadow-md'
                                                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`${category.color} p-2 rounded-lg text-white shadow-sm`}>
                                                {category.icon}
                                            </div>
                                            <span>{category.name}</span>
                                        </div>
                                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-4">
                        {/* Enhanced Search Bar */}
                        <div className="bg-white/70 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search files by name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium bg-white/50 backdrop-blur-sm"
                                        />
                                    </div>
                                    {searchTerm && (
                                        <span className="text-sm text-gray-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                                            {filteredFiles.length} result{filteredFiles.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600 mr-2">View:</span>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list'
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Files Display */}
                        <div className="bg-white/70 backdrop-blur-sm shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
                            {isLoading ? (
                                <div className="text-center py-16">
                                    <div className="relative">
                                        <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                                        <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading files...</h3>
                                    <p className="text-gray-500">Please wait while we fetch your documents</p>
                                </div>
                            ) : filteredFiles.length === 0 ? (
                                <div className="text-center py-16">
                                    {searchTerm ? (
                                        <>
                                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
                                            <p className="text-gray-500">Try adjusting your search terms or browse by category</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <Zap className="w-6 h-6 text-indigo-400 absolute top-0 right-1/2 transform translate-x-8 animate-bounce" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No files uploaded yet</h3>
                                            <p className="text-gray-500 mb-6">Start by uploading your first document</p>
                                            <button
                                                onClick={() => setShowUploadModal(true)}
                                                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                <Plus className="w-5 h-5" />
                                                <span>Upload Your First File</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                                            {filteredFiles.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="border border-gray-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:border-indigo-200 bg-white/50 backdrop-blur-sm group hover:-translate-y-1"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            {getFileIcon(file.type)}
                                                            <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                                                                {file.type.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <button
                                                                onClick={() => handlePreview(file)}
                                                                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                                                                title="Preview"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(file)}
                                                                className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200"
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(file.id, file.name)}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm break-words leading-tight">
                                                        {file.name.length > 35 ? `${file.name.substring(0, 35)}...` : file.name}
                                                    </h4>

                                                    <div className="space-y-2 text-xs text-gray-600">
                                                        <div className="flex justify-between">
                                                            <span>Size:</span>
                                                            <span className="font-medium">{formatFileSize(file.size)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Category:</span>
                                                            <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-2 py-1 rounded-full font-medium">{file.category}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Uploaded:</span>
                                                            <span className="font-medium">{file.uploadDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {filteredFiles.map((file) => (
                                                <div key={file.id} className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                            {getFileIcon(file.type)}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-gray-900 truncate">{file.name}</h4>
                                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                                    <span className="font-medium">{formatFileSize(file.size)}</span>
                                                                    <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-2 py-1 rounded-full font-medium text-xs">{file.category}</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        <span>{file.uploadDate}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1">
                                                                        <User className="w-3 h-3" />
                                                                        <span>{file.uploadedBy}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <button
                                                                onClick={() => handlePreview(file)}
                                                                className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                                                                title="Preview"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(file)}
                                                                className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200"
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(file.id, file.name)}
                                                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-lg w-full max-w-lg shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Upload File</h2>
                                        <p className="text-indigo-100 text-sm">Add a new file to your collection</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setSelectedFile(null);
                                        setUploadCategory('');
                                        setFileName('');
                                        setUploadProgress(0);
                                    }}
                                    className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* File Selection */}
                            <div>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${dragActive
                                            ? 'border-indigo-400 bg-indigo-50 scale-105'
                                            : selectedFile
                                                ? 'border-green-400 bg-green-50'
                                                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    {selectedFile ? (
                                        <div className="space-y-3">
                                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                                            <div>
                                                <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatFileSize(selectedFile.size)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                    setFileName('');
                                                }}
                                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                                            >
                                                Choose Different File
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                                                <Sparkles className="w-4 h-4 text-indigo-400 absolute -top-1 -right-1 animate-pulse" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-700">
                                                    Drop files here or click to browse
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Maximum file size: 100MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedFile && (
                                <>
                                    {/* File Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <Edit3 className="w-4 h-4 inline mr-1" />
                                            File Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            placeholder="Enter file name..."
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium bg-white/70 backdrop-blur-sm transition-all duration-300"
                                        />
                                    </div>

                                    {/* Category Selection */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Category
                                        </label>
                                        <select
                                            value={uploadCategory}
                                            onChange={(e) => setUploadCategory(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white/70 backdrop-blur-sm transition-all duration-300"
                                        >
                                            <option value="">Choose category...</option>
                                            {categories.slice(1).map((category) => (
                                                <option key={category.name} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Upload Progress */}
                            {uploadProgress > 0 && (
                                <div className="space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-gray-700">Uploading...</span>
                                        <span className="font-bold text-indigo-600">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 text-center">Please wait while your file is being uploaded...</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-t border-gray-100">
                            <div className="text-xs text-gray-600">
                                {selectedFile && uploadCategory && fileName.trim() ?
                                    <span className="text-green-600 font-semibold flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Ready to upload</span>
                                    </span> :
                                    "Select file, rename & choose category"
                                }
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setSelectedFile(null);
                                        setUploadCategory('');
                                        setFileName('');
                                        setUploadProgress(0);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-all duration-300"
                                    disabled={uploadProgress > 0}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitUpload}
                                    disabled={!selectedFile || !uploadCategory || !fileName.trim() || uploadProgress > 0}
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                                >
                                    {uploadProgress > 0 ? (
                                        <>
                                            <Clock className="w-4 h-4 animate-spin" />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span>Upload File</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl rounded-2xl border border-gray-100">
                        <div className="bg-gradient-to-r from-gray-800 to-indigo-900 text-white p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    {getFileIcon(previewFile.type)}
                                    <div>
                                        <h2 className="text-lg font-bold">{previewFile.name}</h2>
                                        <p className="text-blue-100 text-sm">
                                            {formatFileSize(previewFile.size)} • {previewFile.category} • {previewFile.uploadDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDownload(previewFile)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewFile(null)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
                            {renderPreview(previewFile)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;