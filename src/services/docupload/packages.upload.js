const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Package = require('../../models/admin/packages.model');

// Unique directory name for each upload
const allowedExtentions = ['.jpg' , '.jpeg' , '.png'];

const uploadDir = (_req) => {
    const UPLOAD_DIR = path.join(__dirname, '../../../public/uploads/packagesUploads', _req.dirUniqueId);
    if(!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, {recursive: true});
    }
    return UPLOAD_DIR;
} 

const storage =  multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir(_req));
    },
    filename: (_req, file, cb) => {
        const uniquesuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' +uniquesuffix+ path.extname(file.originalname));
    }
})

const fileFilter = async (_req, file, cb) => {
    try {
        if(_req.params?.id) {
            const package = await Package.findById(_req.params.id);
            _req.dirUniqueId = package ? package.dir_unique_id : _req.dirUniqueId; 
        }
        const extension = path.extname(file.originalname);
        // Validation for featured image
        if(!_req.files['featured_image'] && _req.params?.id == null) {
            return cb(new Error('Featured image is required'), false);
        }
        if(allowedExtentions.includes(extension)) {
            cb(null, true);
        } else {
            const UPLOAD_DIR = path.join(__dirname, '../../../public/uploads/packagesUploads', _req.dirUniqueId);
            if (fs.existsSync(UPLOAD_DIR) && !_req.params?.id) {
                try {
                    await fs.promises.rm(UPLOAD_DIR, { recursive: true, force: true })
                } catch(error) {
                    console.error('Failed to delete directory:', error);
                    throw new Error('Failed to delete directory');
                }
            }
            cb(new Error('Invalid file type'), false);
        }
    } catch (error) {
        console.error('Error in fileFilter:', error);
        cb(error, false);
    }
}

const packageUploads = multer({
    storage: storage,
    limits: {
        fileSize: 1000000  // Bytes = 1MB
    },
    fileFilter: fileFilter
});

module.exports = packageUploads;