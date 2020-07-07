const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

function read(req, res) {
  const idconf = req.sanitize("idconf").escape();
  const sqlquery =
    "SELECT * " +
    "FROM ccmembers " +
    "LEFT JOIN conference_ccmembers ON ccmembers.ccmember_id = conference_ccmembers.ccmember_id " +
    "WHERE idConference=? " +
    "ORDER BY ccmembers.name ASC;";
  console.log(sqlquery); //////////////////////////////////////////
  connect.con.query(sqlquery, idconf, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if (rows.length == 0) {
        res
          .status(jsonMessages.db.noRecords.status)
          .send(jsonMessages.db.noRecords);
      } else {
        console.log(rows); /////////////////////////////////////////
        res.send(rows);
      }
    }
  });
}

function readID(req, res) {
  const idspeaker = req.sanitize("id").escape();
  const post = { idSponsor: idspeaker };
  connect.con.query(
    "SELECT ccmember_id, name, job, photo, facebook, twitter, linkedin, bio FROM ccmembers order by ccmember_id desc",
    post,
    function (err, rows, fields) {
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
  const name = req.sanitize("name").escape();
  const job = req.sanitize("job").escape();
  const photo = req.sanitize("photo").escape();
  const facebook = req.sanitize("facebook").escape();
  const twitter = req.sanitize("twitter").escape();
  const linkedin = req.sanitize("linkedin").escape();
  const bio = req.sanitize("bio").escape();
  req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req.checkBody("job", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("photo", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .isURL();
  req
    .checkBody("facebook", "Insira um url válido: https://facebook.com/name.")
    .optional({ checkFalsy: true })
    .matches("https://facebook.com/*");
  req
    .checkBody("twitter", "Insira um url válido: https://twitter.com/name.")
    .optional({ checkFalsy: true })
    .matches("https://twitter.com/*");    
  req
    .checkBody("linkedin", "Insira um url válido: https://linkedin.com/name.")
    .optional({ checkFalsy: true })
    .matches("https://linkedin.com/*");
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (name != "NULL" && job != "NULL" && typeof name != "undefined") {
      const post = {
        name: name,
        job: job,        
        photo: photo,
        facebook: facebook,
        linkedin: linkedin,
        twitter: twitter,
        bio: bio,
      };
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "INSERT INTO ccmembers SET ?",
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
        .end(jsonMessages.db.requiredData);
  }
}


// Associate member x to conference y
function createConfMember(req, res) {
  //receber os dados do formuário que são enviados por post
  const idconf = req.sanitize("idconf").escape();
  const idmember = req.sanitize("idccmember").escape();
  if (
    idmember != "NULL" &&
    idconf != "NULL" &&
    typeof idmember != "undefined" &&
    typeof idconf != "undefined"
  ) {
    const post = { ccmember_id: idmember, idConference: idconf };
    const query = connect.con.query(
      "INSERT INTO conference_ccmembers SET ?",
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




function update(req, res) {
  const idmember = req.sanitize("idccmember").escape();
  const name = req.sanitize("name").escape();
  const job = req.sanitize("job").escape();
  const photo = req.sanitize("photo").escape();
  const facebook = req.sanitize("facebook").escape();
  const twitter = req.sanitize("twitter").escape();
  const linkedin = req.sanitize("linkedin").escape();
  const bio = req.sanitize("bio").escape();
  req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req.checkBody("job", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("photo", "Insira um url válido.")
    .optional({ checkFalsy: true })
    .isURL();
  req
    .checkBody("facebook", "Insira um url válido: https://facebook.com/name.")
    .optional({ checkFalsy: true })
    .matches("https://facebook.com/*");
  req
    .checkBody("twitter", "Insira um url válido: https://twitter.com/name.")
    .optional({ checkFalsy: true })
    .matches("https://twitter.com/*");    
  req
    .checkBody("linkedin", "Insira um url válido: https://linkedin.com/name.")
    .optional({ checkFalsy: true })
    .matches("https://linkedin.com/*");
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      idmember != "NULL" &&
      typeof name != "undefined" &&
      typeof job != "undefined" &&
      typeof idmember != "undefined"
    ) {
      const sqlvalues = [
        name,
        job,
        photo,
        facebook,
        twitter,
        linkedin,
        bio,
        idmember,
      ];
      const query = connect.con.query(
        "UPDATE ccmembers SET name =?, job =?, photo=?, facebook=?, twitter=?, linkedin=?, bio=?  WHERE ccmember_id=?",
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

// set active to false
function deleteL(req, res) {
  const update = [0, req.sanitize("id").escape()];
  const query = connect.con.query(
    "UPDATE speaker SET active = ? WHERE idSpeaker=?",
    update,
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

// really delete record
function deleteF(req, res) {
  const update = req.sanitize("id").escape();
  const query = connect.con.query(
    "DELETE FROM speaker WHERE idSpeaker=?",
    update,
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
  read: read,
  readID: readID,
  create: create,
  createConfMember: createConfMember,
  update: update,
  deleteL: deleteL,
  deleteF: deleteF,
};
