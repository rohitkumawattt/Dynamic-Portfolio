import multer from "multer";

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        if (file.mimetype === "application/pdf") {
            cb(null, "./public/temp"); // Resume ke liye temp folder
        } else {
            cb(null, "./public/images/projectImages"); // Images ke liye purana folder
        }
    },
    filename : function(req,file,cb){
        cb(null,Date.now() + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .png, .jpg and .pdf formats are supported!"), false);
    }
};

export const upload = multer({storage:storage,fileFilter:fileFilter, limits:{fileSize: 5 * 1024 * 1024}}); // 5MB limit

