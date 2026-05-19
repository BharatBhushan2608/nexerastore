import multer from "multer";

const storage = multer.memoryStorage();

// for single file upload
export const singleUpload = multer({ storage }).single("file");

// for multiple file upload (up to 5 files)
export const multipleUpload = multer({ storage }).array("files", 5); // Adjust the limit as needed  
