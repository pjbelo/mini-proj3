const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

//função de leitura que retorna o resultado no callback
function read(req, res) {
  const idconference = req.sanitize("idconf").escape();
  const query = connect.con.query(
    "SELECT distinct idParticipant, nomeParticipante FROM conf_participant WHERE idConference=? ORDER BY idParticipant desc",
    idconference,
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

function create(req, res) {
  //receber os dados do formulário que são enviados por post
  req.sanitize("idparticipant").escape();
  req.sanitize("idconf").escape();
  req.sanitize("nomeparticipant").escape();
  req.checkParams("idparticipant", "Insira um email válido.").isEmail();
  req.checkBody("nomeparticipant", "Insira apenas texto").isAlpha();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    const idParticipant = req.params.idparticipant;
    const idConf = req.params.idconf;
    const nome = req.body.nomeparticipant;
    if (
      idParticipant != "NULL" &&
      idConf != "NULL" &&
      typeof idParticipant != "undefined" &&
      typeof idConf != "undefined"
    ) {
      const post = {
        idParticipant: idParticipant,
        idConference: idConf,
        nomeParticipante: nome,
      };
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "INSERT INTO conf_participant SET ?",
        post,
        function (err, rows, fields) {
          console.log(query.sql);
          if (!err) {
            res
              .status(jsonMessages.db.successInsert.status)
              .send(jsonMessages.db.successInsert);
          } else {
            console.log(err);
            if (err.code == "ER_DUP_ENTRY") {
              res
                .status(jsonMessages.db.duplicateEmail.status)
                .send(jsonMessages.db.duplicateEmail);
            } else
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
}

function deleteP(req, res) {
  //criar e executar a query de leitura na BD
  req.sanitize("idparticipant").escape();
  req.sanitize("idconf").escape();
  req.checkParams("idparticipant", "Insira um email válido.").isEmail();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    const idconference = req.params.idconf;
    const idparticipant = req.params.idparticipant;
    const sqlvalues = [idconference, idparticipant];
    const query = connect.con.query(
      "DELETE FROM conf_participant where idConference = ? and idParticipant = ?",
      sqlvalues,
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
}

//exportar as funções
module.exports = {
  read: read,
  create: create,
  deleteP: deleteP,
};
