const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");
//função de leitura que retorna o resultado no callback
function readConference(req, res) {
  const query = connect.con.query(
    "SELECT idConference, acronimo, nome, descricao, local, data FROM conference order by data desc",
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      } else {
        if (rows.length == 0) {
          res
            .status(jsonMessages.db.noRecords.status)
            .send(jsonMessages.db.noRecords);
        } else {
          res.send(rows);
        }
      }
    }
  );
}

function readConferenceID(req, res) {
  const idconf = req.sanitize("id").escape();
  const query = connect.con.query(
    "SELECT idConference, acronimo, nome,descricao,local,data FROM conference where idConference=? ",
    idconf,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      } else {
        if (rows.length == 0) {
          res
            .status(jsonMessages.db.noRecords.status)
            .send(jsonMessages.db.noRecords);
        } else {
          res.send(rows);
        }
      }
    }
  );
}

function readConfSpeaker(req, res) {
  //criar e executar a query de leitura na BD
  const idConf = req.sanitize("idconf").escape();
  const post = { idConference: idConf };
  const query = connect.con.query(
    "SELECT distinct a.idSpeaker, nome, foto, bio,link, filiacao, linkedin,twitter,facebook, cargo, active FROM speaker a, conf_speaker b where a.idSpeaker = b.idSpeaker  and ? order by idSpeaker desc",
    post,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      } else {
        if (rows.length == 0) {
          res
            .status(jsonMessages.db.noRecords.status)
            .send(jsonMessages.db.noRecords);
        } else {
          res.send(rows);
        }
      }
    }
  );
}

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

function deleteConfSpeaker(req, res) {
  //criar e executar a query de leitura na BD
  const idConf = req.sanitize("idconf").escape();
  const idSpeaker = req.sanitize("idspeaker").escape();
  const params = [idConf, idSpeaker];
  console.log(params);
  const query = connect.con.query(
    "DELETE FROM conf_speaker where idConference = ? and idSpeaker = ?",
    params,
    function (err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res
          .status(jsonMessages.db.successDelete.status)
          .send(jsonMessages.db.successDelete);
      } else {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      }
    }
  );
}

//exportar as funções
module.exports = {
  readConference: readConference,
  readConferenceID: readConferenceID,
  readSpeaker: readConfSpeaker,
  saveSpeaker: saveConfSpeaker,
  deleteSpeaker: deleteConfSpeaker,
};
