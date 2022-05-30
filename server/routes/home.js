const express = require('express');
const router = express.Router();
const path = require('path');
const homeController = require('../controllers/HomeController');
const multer = require('multer');
const storage = multer.diskStorage({
      destination: (req, file, callBack) => {
          callBack(null, 'uploads')
      },
      filename: (req, file, callBack) => {
          //callBack(null, `User_${file.originalname}`)
          callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    })
const upload = multer({ storage: storage })

// Routes
router.get('/', homeController.view);
router.get('/profile', homeController.userProfile);
router.get('/profileEdit', homeController.EditProfile);
router.post('/profileEdit', upload.fields([{name: "profile"}, {name: "uploadcover"}]), homeController.SaveEditProfile);
router.post('/profileEditInfo', homeController.SaveEditProfileInfo);
router.post('/profileEditPassW', homeController.SaveEditProfilePassW);
  
module.exports = router;