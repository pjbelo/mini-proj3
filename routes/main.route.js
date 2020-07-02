const router = require("express").Router();
const controllerSpeaker = require("../controllers/speaker.controller.js");
const controllerSponsor = require("../controllers/sponsor.controller.js");
const controllerConference = require("../controllers/conference.controller.js");
const controllerCcmember = require("../controllers/ccmember.controller.js");
const controllerMail = require("../controllers/mail.controller.js");
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
router.get("/", function (req, res) {
  res.send("Conference Project, by Paulo Belo");
  res.end();
});

router.get("/speakers/", controllerSpeaker.read);
router.get("/speakers/:id", controllerSpeaker.readID);
router.post("/speakers/", isLoggedIn, controllerSpeaker.create);
router.put("/speakers/:id", isLoggedIn, isLoggedIn, controllerSpeaker.update);
router.put("/speakers/del/:id", isLoggedIn, controllerSpeaker.deleteL);
router.delete("/speakers/:id", isLoggedIn, controllerSpeaker.deleteF);

router.get("/sponsors/", controllerSponsor.read);
router.get("/sponsors/:id", controllerSponsor.readID);
router.post("/sponsors/", isLoggedIn, controllerSponsor.save);
router.put("/sponsors/:id", isLoggedIn, controllerSponsor.update);
router.put("/sponsors/del/:id", isLoggedIn, controllerSponsor.deleteL);
router.delete("/sponsors/:id", isLoggedIn, controllerSponsor.deleteF);

router.get("/conferences", controllerConference.readConference);
router.get("/conferences/:id", controllerConference.readConferenceID);

router.get(
  "/conferences/:idconf/participants",
  controllerConference.readParticipant
);
router.post(
  "/conferences/:idconf/participants/:idparticipant/",
  controllerConference.saveParticipant
);
router.delete(
  "/conferences/:idconf/participants/:idparticipant",
  controllerConference.deleteParticipant
);

router.get("/conferences/:idconf/sponsors/", controllerConference.readSponsor);
router.post(
  "/conferences/:idconf/sponsors/:idsponsor",
  isLoggedIn,
  controllerConference.saveSponsor
);
router.delete(
  "/conferences/:idconf/sponsors/:idsponsor",
  isLoggedIn,
  controllerConference.deleteSponsor
);


// ----------------------------  Speakers ----------------------------
router.get("/conferences/:idconf/speakers/", controllerSpeaker.read);
router.get("/conferences/:idconf/speakers/:idspeaker", controllerSpeaker.readID);
router.post(
  "/conferences/:idconf/speakers",
  isLoggedIn,
  controllerSpeaker.create
);
router.put("/conferences/:idconf/speakers/:idspeaker", isLoggedIn, controllerSpeaker.update);
router.delete(
  "/conferences/:idconf/speakers/:idspeaker",
  controllerSpeaker.deleteF
);

// ----------------------------  CC Members ----------------------------
router.get("/conferences/:idconf/ccmembers/", controllerCcmember.read);
router.post(
  "/conferences/:idconf/ccmembers/:idccmember",
  isLoggedIn,
  controllerCcmember.save
);
router.put(
  "/conferences/:idconf/ccmembers/:idccmember",
  isLoggedIn,
  controllerCcmember.update
);
router.delete(
  "/conferences/:idconf/ccmembers/:idccmember",
  isLoggedIn,
  controllerCcmember.deleteL
);

router.post("/contacts/emails", controllerMail.send);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
    return next();
  }
}
