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

//Pour les BAR de Rechercher
router.get('/getAllStudentsActive', homeController.GetAllActif);
router.get('/getAllStudentsAncien', homeController.GestAllInactif);

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
router.post('/Inscription', PaimentController.Inscrire);
router.get('/getOBS', PaimentController.GetOBS);
router.get('/getMATR/:MATR', PaimentController.GetMatriculeInfo);
router.get('/getMATRInfo/:MATR', PaimentController.GetMatriculeInfoPaimentECO);
router.get('/getLastMATR', PaimentController.GetLastMatricule);
router.post('/getFraisPrix', PaimentController.GetFraisPrix);
router.post('/getJournalier', PaimentController.GetJournalierView);
router.post('/getFraisSco', PaimentController.GetFraisScoPrix);
router.get('/getAutreFS', PaimentController.GetAutrePrix);
router.get('/getMATR_FS/:MATR', PaimentController.GetMatriculeInfoPaimentFS);
router.post('/Ecolage', PaimentController.PayerEcolage);
router.post('/FraisSco', PaimentController.PayerFraisSco);

// Pour la liste des élèves Inscrits

const EleveInsController = require('../controllers/EleveInscriController');

router.get('/eleveInscris', EleveInsController.view);
router.post('/FiltreList', EleveInsController.GetListFiltre);

// Pour la liste des élèves Ont fait de l'avance

const DroitIncompletController = require('../controllers/DroitIncompletController');

router.get('/DroitIncommplet', DroitIncompletController.view);
router.post('/DroitFiltreList', DroitIncompletController.GetListFiltre);
router.post('/PayerResteDroit', DroitIncompletController.PayerResteDroit);
//Controller les Frais de Scoalrité
router.get('/controlerECO', DroitIncompletController.viewECO);
router.get('/ControlerFRAIS', DroitIncompletController.viewFraisSco);
router.get('/getMois', DroitIncompletController.GetMoisList);
router.post('/EcoFiltreList', DroitIncompletController.GetListECOFiltre);
router.get('/getLabelAutre', DroitIncompletController.GetFSList);
router.post('/FSFiltreList', DroitIncompletController.GetListFSFiltre);

//Repartition des élèves

const repartitionController = require('../controllers/RepartitionController');
router.get('/RepartirEleve', repartitionController.view);
router.get('/getClasse', repartitionController.GetClassList);
router.post('/getLastNum', repartitionController.GetLastNumClass);
router.post('/ChekNumMatr', repartitionController.CheckNumClass);
router.post('/EnregistrerNumEleve', repartitionController.SaveNumClass);
router.get('/ListeParClasse', repartitionController.viewLIST);
router.post('/FiltreListParClasse', repartitionController.GetListFiltre);


// Pour le Renseignement

const InfoController = require('../controllers/RenseignementController');
router.get('/renseignement', InfoController.view);
router.get('/parentListe', InfoController.viewParent);
router.post('/FiltreListParent', InfoController.GetListParent);

// Pour L'exportation en PDF

const ExportController = require('../controllers/ExportController');
router.get('/exporterPDF', ExportController.view);


  
module.exports = router;