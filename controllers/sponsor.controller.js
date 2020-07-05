const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

//função de leitura que retorna o resultado no callback
// read sponsors from conference x
function readConfSponsor(req, res) {
  const idconference = req.sanitize("idconf").escape();
  const sqlquery =
    "SELECT * " +
    "FROM sponsor " +
    "LEFT JOIN conf_sponsor ON sponsor.idSponsor = conf_sponsor.idSponsor " +
    "WHERE conf_sponsor.idConference=? " +
    "ORDER BY sponsor.nome ASC";
  const query = connect.con.query(sqlquery, idconference, function (
    err,
    rows,
    fields
  ) {
    console.log(query.sql);
    if (err) {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      console.log(err);
      if (rows.length == 0) {
        res
          .status(jsonMessages.db.noRecords.status)
          .send(jsonMessages.db.noRecords);
      } else {
        res.send(rows);
      }
    }
  });
}

// read all sponsors from all conferences
function read(req, res) {
  //criar e executar a query de leitura na BD
  const query = connect.con.query(
    "SELECT idSponsor, nome, logo,categoria, link, active FROM sponsor order by idSponsor desc",
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

// read sponsor with id x
function readID(req, res) {
  //criar e executar a query de leitura na BD para um ID específico
  const idsponsor = req.sanitize("id").escape();
  const query = connect.con.query(
    "SELECT idSponsor, nome, logo,categoria, link, active FROM sponsor where idSponsor = ? ",
    idsponsor,
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

// sponsor create
function create(req, res) {
  //receber os dados do formuário que são enviados por post
  const nome = req.sanitize("nome").escape();
  const logo = req.sanitize("logo").escape();
  const categoria = req.sanitize("categoria").escape();
  const link = req.sanitize("link").escape();
  const active = req.sanitize("active").escape();
  req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("categoria", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("logo", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  req
    .checkBody("link", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  req.checkBody("active", "O valor só pode ser 0 ou 1").matches(/[0-1]/);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (nome != "NULL" && categoria != "NULL" && typeof nome != "undefined") {
      const post = {
        nome: nome,
        logo: logo,
        categoria: categoria,
        link: link,
        active: active,
      };
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "INSERT INTO sponsor SET ?",
        post,
        function (err, rows, fields) {
          console.log(query.sql);
          if (!err) {
            res
              .status(jsonMessages.db.successInsert.status)
              .location(rows.insertId)
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
}

// associa o sponsor x à conferencia y
function createConfSponsor(req, res) {
  //receber os dados do formuário que são enviados por post
  const idSponsor = req.sanitize("idsponsor").escape();
  const idConf = req.sanitize("idconf");
  if (
    idSponsor != "NULL" &&
    idConf != "NULL" &&
    typeof idSponsor != "undefined" &&
    typeof idConf != "undefined"
  ) {
    const post = { idSponsor: idSponsor, idConference: idConf };
    //criar e executar a query de gravação na BD para inserir os dados presentes no post
    const query = connect.con.query(
      "INSERT INTO conf_sponsor SET ?",
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

// sponsor update
function update(req, res) {
  const idsponsor = req.sanitize("id").escape();
  const nome = req.sanitize("nome").escape();
  const logo = req.sanitize("logo").escape();
  const categoria = req.sanitize("categoria").escape();
  const link = req.sanitize("link").escape();
  const active = req.sanitize("active").escape();
  req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("categoria", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("logo", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  req
    .checkBody("link", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  req.checkBody("active", "O valor só pode ser 0 ou 1").matches(/[0-1]/);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      idsponsor != "NULL" &&
      typeof nome != "undefined" &&
      typeof categoria != "undefined" &&
      typeof idsponsor != "undefined"
    ) {
      const sqlvalues = [nome, categoria, logo, link, active, idsponsor];
      const query = connect.con.query(
        "UPDATE sponsor SET nome =?, categoria =?, logo=?, link=?, active=? WHERE idSponsor=?",
        sqlvalues,
        function (err, rows, fields) {
          console.log(query.sql);
          if (!err) {
            res
              .status(jsonMessages.db.successUpdate.status)
              .send(jsonMessages.db.successUpdate);
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
}

// delete association sponsor - conference
function deleteConfSponsor(req, res) {
  //criar e executar a query de leitura na BD
  const idSponsor = req.sanitize("idsponsor").escape();
  const idConf = req.sanitize("idconf").escape();
  const sqlvalues = [idConf, idSponsor];
  const query = connect.con.query(
    "DELETE FROM conf_sponsor where idConference = ? and idSponsor = ?",
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

//delete lógico - set active = 0
function deleteL(req, res) {
  const idsponsor = req.sanitize("id").escape();
  const query = connect.con.query(
    "UPDATE sponsor SET active = 0 WHERE idSponsor=?",
    idsponsor,
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

//delete físico
function deleteF(req, res) {
  const idsponsor = req.sanitize("id").escape();
  const query = connect.con.query(
    "DELETE FROM sponsor WHERE idSponsor=?",
    idsponsor,
    function (err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res
          .status(jsonMessages.db.successDeleteU.status)
          .send(jsonMessages.db.successDeleteU);
      } else {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      }
    }
  );
}

module.exports = {
  readConfSponsor: readConfSponsor,
  createConfSponsor: createConfSponsor,
  deleteConfSponsor: deleteConfSponsor,
  read: read,
  readID: readID,
  create: create,
  update: update,
  deleteL: deleteL,
  deleteF: deleteF,
};
