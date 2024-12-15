const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Prevent file name collisions
    }
});

const upload = multer({ storage });

// Serve static files (e.g., images)
app.use('/uploads', express.static('uploads'));

// Serve the static HTML form
app.use(express.static('public'));

// Array to store image URLs (In a real app, this would be stored in a database)
let imageUrls = [];

// Endpoint to upload the image
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        imageUrls.push({ url: imageUrl });
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'No file uploaded' });
    }
});
app.get('/gallery', (req, res) => {
    res.json(imageUrls);
});
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, './public/post.html'))
});
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, './public/upload.html'))
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, './public/about.html'))
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, './public/contact.html'))
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});