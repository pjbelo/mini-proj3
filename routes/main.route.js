const router = require("express").Router();
const controllerParticipant = require("../controllers/participant.controller.js");
const controllerSpeaker = require("../controllers/speaker.controller.js");
const controllerSponsor = require("../controllers/sponsor.controller.js");
const controllerVolunteer = require("../controllers/volunteer.controller.js");
const controllerTask = require("../controllers/task.controller.js");
const controllerConference = require("../controllers/conference.controller.js");
const controllerCcmember = require("../controllers/ccmember.controller.js");
const controllerMail = require("../controllers/mail.controller.js");
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");

// ----------------------------  Home ----------------------------
router.get("/", function (req, res) {
  res.send(
    "mini-proj3\nPaulo Belo \nProgração Web Avançada \nUniversidade Aberta"
  );
  res.end();
});

// ----------------------------  Conferences ----------------------------
router.get("/conferences", controllerConference.readConference);
router.get("/conferences/:id", controllerConference.readConferenceID);

// ----------------------------  Participants ----------------------------
router.get("/conferences/:idconf/participants", controllerParticipant.read);
router.post(
  "/conferences/:idconf/participants/:idparticipant/",
  controllerParticipant.create
);
router.delete(
  "/conferences/:idconf/participants/:idparticipant",
  controllerParticipant.deleteP
);

// ----------------------------  Speakers ----------------------------
router.get("/speakers", controllerSpeaker.readAllSpeakers);
router.get("/speakers/:idspeaker", controllerSpeaker.readID);
router.get("/conferences/:idconf/speakers/", controllerSpeaker.read);
router.post("/speakers/", isLoggedIn, controllerSpeaker.create);
router.post(
  "/conferences/:idconf/speakers/:idspeaker",
  isLoggedIn,
  controllerSpeaker.confSpeakerCreate
);
router.put("/speakers/:idspeaker", isLoggedIn, controllerSpeaker.update);
router.put("/speakers/del/:idspeaker", isLoggedIn, controllerSpeaker.deleteL);
router.delete("/speakers/:idspeaker", isLoggedIn, controllerSpeaker.deleteF);
router.delete(
  "/conferences/:idconf/speakers/:idspeaker",
  controllerSpeaker.deleteC
);

// ----------------------------  Sponsors ----------------------------
router.get("/sponsors/", controllerSponsor.read);
router.get("/conferences/:idconf/sponsors/", controllerSponsor.readConfSponsor);
router.get("/sponsors/:id", controllerSponsor.readID);
router.post("/sponsors/", isLoggedIn, controllerSponsor.create);
router.put("/sponsors/:id", isLoggedIn, controllerSponsor.update);
router.put("/sponsors/del/:id", isLoggedIn, controllerSponsor.deleteL);
router.delete("/sponsors/:id", isLoggedIn, controllerSponsor.deleteF);
router.post(
  "/conferences/:idconf/sponsors/:idsponsor",
  isLoggedIn,
  controllerSponsor.createConfSponsor
);
router.delete(
  "/conferences/:idconf/sponsors/:idsponsor",
  isLoggedIn,
  controllerSponsor.deleteConfSponsor
);

// ----------------------------  Volunteers ----------------------------
router.get("/volunteers/", controllerVolunteer.read);
router.get(
  "/conferences/:idconf/volunteers/",
  controllerVolunteer.readConfVolunteer
);
router.get("/volunteers/:id", controllerVolunteer.readID);
router.post("/volunteers/", isLoggedIn, controllerVolunteer.create);
router.post(
  "/conferences/:idconf/volunteers/:idvolunteer",
  isLoggedIn,
  controllerVolunteer.createConfVolunteer
);
router.put("/volunteers/:id", isLoggedIn, controllerVolunteer.update);
router.delete("/volunteers/:id", isLoggedIn, controllerVolunteer.deleteF);
router.delete(
  "/conferences/:idconf/volunteers/:idvolunteer",
  isLoggedIn,
  controllerVolunteer.deleteConfVolunteer
);

// ----------------------------  Tasks ----------------------------
router.get("/tasks/", controllerTask.read);
router.get("/conferences/:idconf/tasks/", controllerTask.readConfTasks);
router.get("/tasks/:id", controllerTask.readID);
router.post("/conferences/:idconf/tasks/", isLoggedIn, controllerTask.create);
//router.post("/conferences/:idconf/volunteers/", isLoggedIn,controllerVolunteer.createConfVolunteer);
router.put("/tasks/:id", isLoggedIn, controllerTask.update);
router.delete("/tasks/:id", isLoggedIn, controllerTask.deleteF);

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
