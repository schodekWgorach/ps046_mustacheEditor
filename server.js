const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracja multer do obsługi przesyłania plików
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Dozwolone są tylko pliki JPG'), false);
        }
    }
});

// Serwowanie plików statycznych
app.use(express.static(path.join(__dirname)));

// Endpoint do przesyłania zdjęć (opcjonalny, dla przyszłej rozbudowy)
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nie przesłano pliku' });
    }
    
    res.json({ 
        message: 'Plik został przesłany pomyślnie',
        filename: req.file.originalname,
        size: req.file.size
    });
});

// Główna trasa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Obsługa błędów
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Wystąpił błąd serwera' });
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer Zdobywca działa na porcie ${PORT}`);
    console.log(`Otwórz przeglądarkę i wejdź na http://localhost:${PORT}`);
});