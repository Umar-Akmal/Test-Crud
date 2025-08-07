const mongoose = require('mongoose');

const UploadDet = new mongoose.Schema({
    attachment: { type: String, required: true },
    attachmentName: { type: String, required: true, },
});

module.exports = mongoose.model('UploadDetail', UploadDet);