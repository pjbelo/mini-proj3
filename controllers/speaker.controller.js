const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

// read all speakers from all conferences, active or not
function readAllSpeakers(req, res) {
  const sqlquery = "SELECT * FROM speaker ORDER BY idSpeaker DESC";
  connect.con.query(sqlquery, function (err, result, fields) {
    console.log(sqlquery, "\n", result);
    if (err) {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if (result.length == 0) {
        res
          .status(jsonMessages.db.noRecords.status)
          .send(jsonMessages.db.noRecords);
      } else {
        res.send(result);
      }
    }
  });
}

// read all active speakers from conference x
function read(req, res) {
  const idconf = req.sanitize("idconf").escape();
  const sqlquery =
    "SELECT speaker.*, conf_speaker.idConference " +
    "FROM speaker LEFT JOIN conf_speaker ON speaker.idSpeaker = conf_speaker.idSpeaker " +
    "WHERE conf_speaker.idConference=? AND speaker.active=1 " +
    "ORDER BY idSpeaker DESC";
  connect.con.query(sqlquery, idconf, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if (result.length == 0) {
        res
          .status(jsonMessages.db.noRecords.status)
          .send(jsonMessages.db.noRecords);
      } else {
        res.send(result);
      }
    }
  });
}

// read speaker with id x
function readID(req, res) {
  const idspeaker = req.sanitize("idspeaker").escape();
  const sqlquery =
    "SELECT DISTINCT idSpeaker, nome, foto, bio, link, filiacao, active, filiacao, linkedin, twitter, facebook, cargo FROM speaker WHERE idSpeaker = ? ";
  connect.con.query(sqlquery, idspeaker, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if (result.length == 0) {
        res
          .status(jsonMessages.db.noRecords.status)
          .send(jsonMessages.db.noRecords);
      } else {
        res.send(result);
      }
    }
  });
}

// Create speaker and set to active
function create(req, res) {
  const idconf = req.sanitize("idconf").escape();
  const nome = req.sanitize("nome").escape();
  const foto = req.sanitize("foto").escape();
  const bio = req.sanitize("bio").escape();
  const link = req.sanitize("link").escape();
  const cargo = req.sanitize("cargo").escape();
  const facebook = req.sanitize("facebook").escape();
  const linkedin = req.sanitize("linkedin").escape();
  const twitter = req.sanitize("twitter").escape();
  const active = req.sanitize("active").escape();
  req
    .checkBody("nome", "Nome é obrigatório. Insira apenas texto")
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("cargo", "Cargo é obrigatório. Insira apenas texto")
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("link", "Link: Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  req
    .checkBody("foto", "Foto: Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  req
    .checkBody(
      "facebook",
      "Facebook: Insira um url válido: https://facebook.com/name."
    )
    .optional({ checkFalsy: true })
    .unescape()
    .matches("https://facebook.com/*");
  req
    .checkBody(
      "linkedin",
      "Linkedin: Insira um url válido: https://linkedin.com/name."
    )
    .optional({ checkFalsy: true })
    .unescape()
    .matches("https://linkedin.com/*");
  req
    .checkBody(
      "twitter",
      "Twitter: Insira um url válido: https://twitter.com/name."
    )
    .optional({ checkFalsy: true })
    .unescape()
    .matches("https://twitter.com/*");
  req.checkBody("active", "O valor só pode ser 0 ou 1").matches(/[0-1]/);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (nome != "NULL" && cargo != "NULL" && typeof nome != "undefined") {
      const postdata = {
        nome: nome,
        foto: foto,
        bio: bio,
        link: link,
        facebook: facebook,
        linkedin: linkedin,
        twitter: twitter,
        cargo: cargo,
        active: active,
      };
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "INSERT INTO speaker SET ?",
        postdata,
        function (err, result, fields) {
          console.log(query.sql, "\n", result);
          if (!err) {
            res
              .status(jsonMessages.db.successInsert.status)
              .location(result.insertId)
              .send(jsonMessages.db.successInsert);
          } else {
            console.log(err);
            res
              .status(jsonMessages.db.dbError.status)
              .send(jsonMessages.db.dbError);
          }
        }
      );
    } else
      res
        .status(jsonMessages.db.requiredData.status)
        .end(jsonMessages.db.requiredData);
  }
}

// associate speaker x to conference y
function confSpeakerCreate(req, res) {
  const idconf = req.sanitize("idconf").escape();
  const idspeaker = req.sanitize("idspeaker").escape();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (idconf != "NULL" && idspeaker != "NULL") {
      const postdata = {
        idConference: idconf,
        idSpeaker: idspeaker,
      };
      const query = connect.con.query(
        "INSERT INTO conf_speaker SET ?",
        postdata,
        function (err, result, fields) {
          console.log(query.sql, "\n", result);
          if (!err) {
            res
              .status(jsonMessages.db.successInsert.status)
              .location(result.insertId)
              .send(jsonMessages.db.successInsert);
          } else {
            console.log(err);
            res
              .status(jsonMessages.db.dbError.status)
              .send(jsonMessages.db.dbError);
          }
        }
      );
    } else
      res
        .status(jsonMessages.db.requiredData.status)
        .end(jsonMessages.db.requiredData);
  }
}

// Associate speaker x to conference y
function saveConfSpeaker(req, res) {
  //receber os dados do formuário que são enviados por post
  const idConf = req.sanitize("idconf").escape();
  const idSpeaker = req.sanitize("idspeaker").escape();
  if (
    idSpeaker != "NULL" &&
    idConf != "NULL" &&
    typeof idSpeaker != "undefined" &&
    typeof idConf != "undefined"
  ) {
    const post = { idSpeaker: idSpeaker, idConference: idConf };
    //criar e executar a query de gravação na BD para inserir os dados presentes no post
    const query = connect.con.query(
      "INSERT INTO conf_speaker SET ?",
      post,
      function (err, rows, fields) {
        console.log(query.sql);
        if (!err) {
          res
            .status(jsonMessages.db.successInsert.status)
            .send(jsonMessages.db.successInsert);
        } else {
          console.log(err);
          res
            .status(jsonMessages.db.dbError.status)
            .send(jsonMessages.db.dbError);
        }
      }
    );
  } else
    res
      .status(jsonMessages.db.requiredData.status)
      .send(jsonMessages.db.requiredData);
}

// update speaker x
function update(req, res) {
  const idspeaker = parseInt(req.sanitize("idspeaker").escape());
  const nome = req.sanitize("nome").escape();
  const foto = req.sanitize("foto").escape();
  const bio = req.sanitize("bio").escape();
  const link = req.sanitize("link").escape();
  const filiacao = req.sanitize("filiacao").escape();
  const cargo = req.sanitize("cargo").escape();
  const facebook = req.sanitize("facebook").escape();
  const linkedin = req.sanitize("linkedin").escape();
  const twitter = req.sanitize("twitter").escape();
  const active = req.sanitize("active").escape();
  req
    .checkBody("nome", "Nome é obrigatório. Insira apenas texto")
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("cargo", "Cargo é obrigatório. Insira apenas texto")
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("link", "Link: Insira um url válido.")
    .optional({ checkFalsy: true })
    .isURL();
  req
    .checkBody("foto", "Foto: Insira um url válido.")
    .optional({ checkFalsy: true })
    .isURL();
  req
    .checkBody(
      "facebook",
      "Facebook: Insira um url válido: https://facebook.com/name."
    )
    .optional({ checkFalsy: true })
    .matches("https://facebook.com/*");
  req
    .checkBody(
      "linkedin",
      "Linkedin: Insira um url válido: https://linkedin.com/name."
    )
    .optional({ checkFalsy: true })
    .matches("https://linkedin.com/*");
  req
    .checkBody(
      "twitter",
      "Twitter: Insira um url válido: https://twitter.com/name."
    )
    .optional({ checkFalsy: true })
    .matches("https://twitter.com/*");
  req.checkBody("active", "O valor só pode ser 0 ou 1").matches(/[0-1]/);
  req.checkParams("idspeaker", "Insira um ID de speaker válido").isNumeric();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      idspeaker != "NULL" &&
      typeof nome != "undefined" &&
      typeof cargo != "undefined" &&
      typeof idspeaker != "undefined"
    ) {
      const sqlquery =
        "UPDATE speaker SET nome=?, foto=?, bio=?,link=?, filiacao=?, cargo=?, facebook=? , linkedin=?, twitter=?, active=?  WHERE idSpeaker=?";
      const sqlvalues = [
        nome,
        foto,
        bio,
        link,
        filiacao,
        cargo,
        facebook,
        linkedin,
        twitter,
        active,
        idspeaker,
      ];
      const query = connect.con.query(sqlquery, sqlvalues, function (
        err,
        result,
        fields
      ) {
        console.log(query.sql, "\n", result);
        if (!err) {
          res
            .status(jsonMessages.db.successUpdate.status)
            .send(jsonMessages.db.successUpdate);
        } else {
          console.log(query.sql);
          console.log(err);
          res
            .status(jsonMessages.db.dbError.status)
            .send(jsonMessages.db.dbError);
        }
      });
    } else
      res
        .status(jsonMessages.db.requiredData.status)
        .send(jsonMessages.db.requiredData);
  }
}

// set speaker to not active
function deleteL(req, res) {
  const idspeaker = req.sanitize("idspeaker").escape();
  const sqlquery = "UPDATE speaker SET active = ? WHERE idSpeaker=?";
  const sqlvalues = [0, idspeaker];
  const query = connect.con.query(sqlquery, sqlvalues, function (
    err,
    result,
    fields
  ) {
    console.log(query.sql, "\n", result);
    if (!err) {
      res
        .status(jsonMessages.db.successDeleteU.status)
        .send(jsonMessages.db.successDeleteU);
    } else {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    }
  });
}

// delete the association of speaker x to conference y
function deleteC(req, res) {
  const idspeaker = req.sanitize("idspeaker").escape();
  const idconf = req.sanitize("idconf").escape();
  const sqlquery =
    "DELETE FROM conf_speaker WHERE idConference=? AND idSpeaker=?";
  const sqlvalues = [idconf, idspeaker];
  const query = connect.con.query(sqlquery, sqlvalues, function (
    err,
    result,
    fields
  ) {
    console.log(query.sql, "\n", result);
    if (!err) {
      res
        .status(jsonMessages.db.successDeleteU.status)
        .send(jsonMessages.db.successDeleteU);
    } else {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    }
  });
}

// delete speaker and all associations to conferences
async function deleteF(req, res) {
  const idspeaker = req.sanitize("idspeaker").escape();
  // delete associations and await
  const sqlquery = "DELETE FROM conf_speaker WHERE idSpeaker=?";
  const query = await connect.con.query(sqlquery, idspeaker, function (
    err,
    result,
    fields
  ) {
    console.log(query.sql, "\n", result);
    if (!err) {
      res
        .status(jsonMessages.db.successDelete.status)
        .send(jsonMessages.db.successDelete);
    } else {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    }
  });
  // delete speaker record
  const sqlquery2 = "DELETE FROM speaker WHERE idSpeaker=?";
  const query2 = await connect.con.query(sqlquery2, idspeaker, function (
    err,
    result,
    fields
  ) {
    console.log(query2.sql, "\n", result);
    if (err) throw err;
  });
}

module.exports = {
  readAllSpeakers: readAllSpeakers,
  read: read,
  readID: readID,
  create: create,
  confSpeakerCreate: confSpeakerCreate,
  update: update,
  deleteL: deleteL,
  deleteC: deleteC,
  deleteF: deleteF,
  saveConfSpeaker: saveConfSpeaker,
};
