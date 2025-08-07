const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const UploadDetail = require('../models/UploadDetail'); // update path accordingly

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

// Multer instance
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "application/pdf" ||
            file.mimetype.startsWith('image/')
        ) {
            cb(null, true);
        } else {
            req.formaterror = "Only images, PDF files are allowed";
            cb(null, false);
        }
    },
});

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const attachment = req.file ? req.file.filename : "NA";
        const originalName = req.file ? req.file.originalname : "NA";

        const newRequest = new UploadDetail({
            attachment: attachment,        // saved file name
            attachmentName: originalName,  // original file name (add this field in schema)
        });

        await newRequest.save();

        return res.status(200).json({
            message: "Upload success",
            attachment,
            originalName,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Upload failed",
            error: err.message
        });
    }
});

router.get('/fetch-upload', async (req, res) => {
    try {
        const uploadData = await UploadDetail.find();
        return res.status(200).json(uploadData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Upload failed",
            error: err.message
        });
    }
});



module.exports = router;
