const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

// Route to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ message: 'Image uploaded successfully!', imageUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
});

// Route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
