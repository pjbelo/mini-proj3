const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

// read volunteers from conference x
function readConfVolunteer(req, res) {
  const idconference = req.sanitize("idconf").escape();
  const sqlquery =
    "SELECT * " +
    "FROM volunteers " +
    "LEFT JOIN conference_volunteers ON volunteers.volunteer_id = conference_volunteers.volunteer_id " +
    "WHERE conference_volunteers.idConference=? " +
    "ORDER BY volunteers.name ASC";
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

// read all volunteers from all conferences
function read(req, res) {
  //criar e executar a query de leitura na BD
  const query = connect.con.query(
    "SELECT volunteer_id, name, job, phone, email, photo FROM volunteers ORDER BY volunteer_id desc",
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

// read volunteer with id x
function readID(req, res) {
  //criar e executar a query de leitura na BD para um ID específico
  const idvolunteer = req.sanitize("id").escape();
  const query = connect.con.query(
    "SELECT volunteer_id, name, job, phone, email, photo FROM volunteers   where volunteer_id = ? ",
    idvolunteer,
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

// volunteer create
function create(req, res) {
  //receber os dados do formuário que são enviados por post
  const name = req.sanitize("name").escape();
  const job = req.sanitize("job").escape();
  const phone = req.sanitize("phone").escape();
  const email = req.sanitize("email").escape();
  const photo = req.sanitize("photo").escape();
  req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("job", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("email", "Insira um email válido.")
    .unescape()
    .isEmail();
  req
    .checkBody("photo", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (name != "NULL" && email != "NULL" && typeof name != "undefined") {
      const post = {
        name: name,
        job: job,
        phone: phone,
        email: email,
        photo: photo,
      };
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "INSERT INTO volunteers SET ?",
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

// associate volunteer x to conference y
function createConfVolunteer(req, res) {
  //receber os dados do formuário que são enviados por post
  const idVolunteer = req.sanitize("idvolunteer").escape();
  const idConf = req.sanitize("idconf");
  if (
    idVolunteer != "NULL" &&
    idConf != "NULL" &&
    typeof idVolunteer != "undefined" &&
    typeof idConf != "undefined"
  ) {
    const post = { volunteer_id: idVolunteer, idConference: idConf };
    //criar e executar a query de gravação na BD para inserir os dados presentes no post
    const query = connect.con.query(
      "INSERT INTO conference_volunteers SET ?",
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

// volunteer update
function update(req, res) {
  const idvolunteer = req.sanitize("id").escape();
  const name = req.sanitize("name").escape();
  const job = req.sanitize("job").escape();
  const phone = req.sanitize("phone").escape();
  const email = req.sanitize("email").escape();
  const photo = req.sanitize("photo").escape();
  req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("job", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("email", "Insira um email válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isEmail();
  req
    .checkBody("photo", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .unescape()
    .isURL();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      idvolunteer != "NULL" &&
      typeof name != "undefined" &&
      typeof idvolunteer != "undefined"
    ) {
      const sqlvalues = [name, job, phone, email, photo, idvolunteer];
      const query = connect.con.query(
        "UPDATE volunteers SET name=?, job=?, phone=?, email=?, photo=? WHERE volunteer_id=?",
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

// delete association volunteer - conference
function deleteConfVolunteer(req, res) {
  //criar e executar a query de leitura na BD
  const idVolunteer = req.sanitize("idvolunteer").escape();
  const idConf = req.sanitize("idconf").escape();
  const sqlvalues = [idConf, idVolunteer];
  const query = connect.con.query(
    "DELETE FROM conference_volunteers where idConference = ? and volunteer_id = ?",
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

//delete físico
function deleteF(req, res) {
  const idvolunteer = req.sanitize("id").escape();
  const query = connect.con.query(
    "DELETE FROM volunteers WHERE volunteer_id=?",
    idvolunteer,
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
  readConfVolunteer: readConfVolunteer,
  createConfVolunteer: createConfVolunteer,
  deleteConfVolunteer: deleteConfVolunteer,
  read: read,
  readID: readID,
  create: create,
  update: update,
  deleteF: deleteF,
};
