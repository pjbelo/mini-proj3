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

//exportar as funções
module.exports = {
  readConference: readConference,
  readConferenceID: readConferenceID,
};
