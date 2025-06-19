import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, uniqueSuffix + '-' + sanitizedName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 1 // Only allow single file upload
    },
    fileFilter: (req, file, cb) => {
        // Allow all file types but check for malicious extensions
        const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.com', '.pif'];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (dangerousExtensions.includes(fileExtension)) {
            return cb(new Error('File type not allowed for security reasons'));
        }

        cb(null, true);
    }
});

// File metadata storage (using JSON file as simple database)
const metadataFile = path.join(__dirname, 'files-metadata.json');

const getFilesMetadata = () => {
    try {
        if (fs.existsSync(metadataFile)) {
            const data = fs.readFileSync(metadataFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading metadata:', error);
    }
    return [];
};

const saveFilesMetadata = (files) => {
    try {
        fs.writeFileSync(metadataFile, JSON.stringify(files, null, 2));
    } catch (error) {
        console.error('Error saving metadata:', error);
    }
};

// Utility function to get file type from extension
const getFileType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return ext.substring(1) || 'unknown';
};

// Utility function to determine file category based on extension
const determineCategory = (filename, providedCategory) => {
    if (providedCategory && providedCategory !== 'Auto-detect') {
        return providedCategory;
    }

    const ext = path.extname(filename).toLowerCase();

    // Image files
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].includes(ext)) {
        return 'Images';
    }

    // Video files
    if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'].includes(ext)) {
        return 'Videos';
    }

    // Audio files
    if (['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma'].includes(ext)) {
        return 'Audio';
    }

    // Archive files
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
        return 'Archives';
    }

    // Document files
    if (['.pdf', '.doc', '.docx', '.txt', '.rtf'].includes(ext)) {
        return 'Documents';
    }

    // Presentation files
    if (['.ppt', '.pptx'].includes(ext)) {
        return 'Presentations';
    }

    // Spreadsheet files
    if (['.xls', '.xlsx', '.csv'].includes(ext)) {
        return 'Documents';
    }

    // Default to Documents
    return 'Documents';
};

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'File Management Server is running',
        timestamp: new Date().toISOString()
    });
});

// Get all files
app.get('/api/files', (req, res) => {
    try {
        const files = getFilesMetadata();

        // Verify files still exist on disk and clean up metadata if needed
        const validFiles = files.filter(file => {
            const filePath = path.join(uploadsDir, file.filename);
            const exists = fs.existsSync(filePath);
            if (!exists) {
                console.log(`File ${file.filename} no longer exists, removing from metadata`);
            }
            return exists;
        });

        // Save cleaned metadata if files were removed
        if (validFiles.length !== files.length) {
            saveFilesMetadata(validFiles);
        }

        res.json(validFiles);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Upload file
app.post('/api/upload', (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);

            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large. Maximum size is 100MB.' });
            }

            return res.status(400).json({ error: err.message || 'Upload failed' });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const category = determineCategory(req.file.originalname, req.body.category);
            const customName = req.body.customName || req.file.originalname;


            const fileMetadata = {
                id: Date.now() + Math.floor(Math.random() * 1000), // Ensure unique ID
                name: customName,
                filename: req.file.filename,
                category: category,
                size: req.file.size,
                uploadDate: new Date().toLocaleDateString(),
                uploadTime: new Date().toLocaleTimeString(),
                uploadedBy: 'Manager', // You can make this dynamic based on authentication
                type: getFileType(req.file.originalname),
                mimeType: req.file.mimetype,
                path: req.file.path
            };

            const files = getFilesMetadata();
            files.unshift(fileMetadata); // Add to beginning of array (newest first)
            saveFilesMetadata(files);

            console.log(`File uploaded successfully: ${req.file.originalname}`);
            res.json({
                message: 'File uploaded successfully',
                file: fileMetadata
            });
        } catch (error) {
            console.error('Upload processing error:', error);

            // Clean up uploaded file if processing failed
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({ error: 'Upload processing failed' });
        }
    });
});

// Download/serve file
app.get('/api/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);

        // Security check: ensure filename doesn't contain path traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }

        if (fs.existsSync(filePath)) {
            // Get file metadata to set proper headers
            const files = getFilesMetadata();
            const fileMetadata = files.find(f => f.filename === filename);

            if (fileMetadata) {
                res.setHeader('Content-Disposition', `inline; filename="${fileMetadata.name}"`);
                res.setHeader('Content-Type', fileMetadata.mimeType || 'application/octet-stream');
            }

            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error('File serving error:', error);
        res.status(500).json({ error: 'Failed to serve file' });
    }
});

// Delete file
app.delete('/api/files/:id', (req, res) => {
    try {
        const fileId = parseInt(req.params.id);

        if (isNaN(fileId)) {
            return res.status(400).json({ error: 'Invalid file ID' });
        }

        const files = getFilesMetadata();
        const fileIndex = files.findIndex(file => file.id === fileId);

        if (fileIndex === -1) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = files[fileIndex];
        const filePath = path.join(uploadsDir, file.filename);

        // Delete physical file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${file.name}`);
        }

        // Remove from metadata
        files.splice(fileIndex, 1);
        saveFilesMetadata(files);

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Delete failed' });
    }
});

// Get file statistics
app.get('/api/stats', (req, res) => {
    try {
        const files = getFilesMetadata();

        const stats = {
            totalFiles: files.length,
            totalSize: files.reduce((total, file) => total + (file.size || 0), 0),
            categories: {},
            recentUploads: files.slice(0, 5) // Last 5 uploads
        };

        // Count files by category
        files.forEach(file => {
            stats.categories[file.category] = (stats.categories[file.category] || 0) + 1;
        });

        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 File Management Server running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`📊 Metadata file: ${metadataFile}`);
    console.log(`🌐 API endpoints available at http://localhost:${PORT}/api/`);

    // Log current file count
    const files = getFilesMetadata();
    console.log(`📋 Currently managing ${files.length} files`);
});