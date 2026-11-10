import path from "path";
import multer from "multer";
import { v4 } from "uuid";

/** MULTER IMAGE UPLOADER **/
// multer diskStorage: yuklangan fayl qayerga va qanday nom bilan saqlanishini belgilaydi.
// address = papka nomi ("members" yoki "products").
function getTargetImageStorage(address: any) {
  return multer.diskStorage({
    // Fayl ./uploads/<address> papkasiga saqlanadi.
    destination: function (req, file, cb) {
      cb(null, `./uploads/${address}`);
    },
    // Fayl nomi: tasodifiy uuid + asl kengaytma (.jpg, .png). Bir xil nomli fayllar bir-birini bosib ketmasligi uchun.
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

// makeUploader("members") -> multer middleware qaytaradi. Routerda .single("nom") (1 fayl -> req.file)
// yoki .array("nom", 5) (ko'p fayl -> req.files) bilan ishlatiladi.
const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

export default makeUploader;

// Eski usul (faqat products uchun), hozir makeUploader bilan almashtirilgan.
// const product_storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/products");
//   },
//   filename: function (req, file, cb) {
//     console.log(file);
//     const extension = path.parse(file.originalname).ext;
//     const random_name = v4() + extension;
//     cb(null, random_name);
//   },
// });

// export const uploadProductImage = multer({ storage: product_storage });
