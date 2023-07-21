import multer from "multer";
import * as mimeTypes from "mime-types"

const storage = multer.diskStorage({
  destination: "public/productos/",
  filename: function (req, file, cb) {
    cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
  }
})
const upload = multer({ storage: storage })

export { upload}