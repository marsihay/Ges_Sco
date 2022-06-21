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

// Routes pour HOME
router.get('/', homeController.HomeRedirect);
router.get('/home', homeController.view);
router.get('/profile', homeController.userProfile);
router.get('/profileEdit', homeController.EditProfile);
router.post('/profileEdit', upload.fields([{name: "profile"}, {name: "uploadcover"}]), homeController.SaveEditProfile);
router.post('/profileEditInfo', homeController.SaveEditProfileInfo);
router.post('/profileEditPassW', homeController.SaveEditProfilePassW);

// Routes pour Setting
const SettingController = require('../controllers/SettingController');

router.get('/setting', SettingController.view);
router.post('/AddDroit', SettingController.AddDroit);
router.get('/editdroit/:ID', SettingController.edit);
router.post('/editdroit/:ID', SettingController.update);
router.get('/getMoisID', SettingController.GetIDMois);
router.post('/AddMois', SettingController.addMois);
router.post('/editMois', SettingController.updateMois);
router.post('/editNiveau', SettingController.updateNIV);
router.post('/addNiveau', SettingController.addNIV);
router.post('/DeleteNiveau', SettingController.delNIV);
router.get('/getNiveau', SettingController.GetNiveau);
router.get('/getNiveauDroit', SettingController.GetNiveauDroit);
router.get('/getAS', SettingController.GetAS);
router.post('/setActiveAS', SettingController.SetAS);
router.post('/AddAS', SettingController.AddAS);
router.post('/ModAS', SettingController.updateAS);
router.post('/DelAS', SettingController.delAS);
router.post('/AddClasse', SettingController.AddClasse);
router.post('/ModClasse', SettingController.updateClasse);
router.post('/DelClasse', SettingController.delClasse);
router.post('/AddFrais', SettingController.AddFrais);
router.post('/ModFrais', SettingController.updateFrais);
router.post('/DelFrais', SettingController.delFrais);

// Pour le Cahier Journalier

const PaimentController = require('../controllers/PaimentController');

router.get('/cahierJr', PaimentController.view);

function buttonAction1(res){
    res.send('ok');
}
router.get("/test1", function (req, res) {
    buttonAction1(res);
});
  
module.exports = router;