const Database = require('../models/db');

exports.getAllMedia = async (req, res) => {
    try {
        const media = await Database.getAllMedia();
        res.json({ success: true, count: media.length, data: media });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};