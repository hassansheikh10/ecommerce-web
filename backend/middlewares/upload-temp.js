const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpg, jpeg, png, webp)"));
    }
  },
});

const compressAndSave = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    await Promise.all(
      req.files.map(async (file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        let pipeline = sharp(file.buffer).resize(800);
        if (ext === '.png') {
          pipeline = pipeline.png();
        } else if (ext === '.webp') {
          pipeline = pipeline.webp();
        } else {
          pipeline = pipeline.jpeg({ quality: 70 });
        }
        await pipeline.toFile(path.join("./uploads", filename));
        file.savedFilename = filename;
      })
    );

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  compressAndSave,
};
