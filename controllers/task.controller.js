const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

// read tasks from conference x
function readConfTasks(req, res) {
  const idconference = req.sanitize("idconf").escape();
  const sqlquery =
    "SELECT task_id, task_name, status, volunteer_id, start_date, end_date, duration, description " +
    "FROM tasks " +
    "WHERE conference_id=? " +
    "ORDER BY start_date ASC";
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

// read all tasks from all conferences
function read(req, res) {
  const sqlquery =
    "SELECT task_id, conference_id, task_name, status, volunteer_id, start_date, end_date, duration, description " +
    "FROM tasks " +
    "ORDER BY start_date ASC";
  const query = connect.con.query(sqlquery, function (err, rows, fields) {
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

// read task with id x
function readID(req, res) {
  //criar e executar a query de leitura na BD para um ID específico
  const idvolunteer = req.sanitize("id").escape();
  const sqlquery =
    "SELECT task_id, conference_id, task_name, status, volunteer_id, start_date, end_date, duration, description " +
    "FROM tasks " +
    "WHERE task_id=? ";
  const query = connect.con.query(sqlquery, idvolunteer,
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

// task create 
// task_id, conference_id, task_name, status, volunteer_id, start_date, end_date, duration, description
function create(req, res) {
  //receber os dados do formuário que são enviados por post
  const conference_id = req.sanitize("idconf").escape();
  const task_name = req.sanitize("task_name").escape();
  const status = req.sanitize("status").escape();
  const volunteer_id = req.sanitize("volunteer_id").escape();
  const start_date = req.sanitize("start_date").escape();
  const end_date = req.sanitize("end_date").escape();
  const duration = req.sanitize("duration").escape();
  const description = req.sanitize("description").escape();
  req.checkBody("task_name", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("status", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("start_date", "Insira uma data válida")
    .optional({ checkFalsy: true })
    .unescape()
    .isISO8601();  // Data no formato YYYY-MM-DD
  req
    .checkBody("end_date", "Insira uma data válida")
    .optional({ checkFalsy: true })
    .unescape()
    .isISO8601();   // Data no formato YYYY-MM-DD
  req
    .checkBody("duration", "Insira apenas numeros")
    .optional({ checkFalsy: true })
    .matches(/[0-9]/);
  req
    .checkBody("description", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (task_name != "NULL" && conference_id != "NULL" && typeof task_name != "undefined") {
      const post = {
        conference_id: conference_id,
        task_name: task_name, 
        status: status,
        volunteer_id: volunteer_id,
        start_date: start_date,
        end_date: end_date,
        duration: duration,
        description: description,
      };
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "INSERT INTO tasks SET ?",
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

// update task
// task_id, conference_id, task_name, status, volunteer_id, start_date, end_date, duration, description
function update(req, res) {
  //receber os dados do formuário que são enviados por post
  const task_id = req.sanitize("id").escape();
  const task_name = req.sanitize("task_name").escape();
  const status = req.sanitize("status").escape();
  const volunteer_id = req.sanitize("volunteer_id").escape();
  const start_date = req.sanitize("start_date").escape();
  const end_date = req.sanitize("end_date").escape();
  const duration = req.sanitize("duration").escape();
  const description = req.sanitize("description").escape();
  req.checkBody("task_name", "Insira apenas texto").matches(/^[a-z ]+$/i);
  req
    .checkBody("status", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  req
    .checkBody("start_date", "Insira uma data válida")
    .optional({ checkFalsy: true })
    .unescape()
    .isISO8601();  // Data no formato YYYY-MM-DD
  req
    .checkBody("end_date", "Insira uma data válida")
    .optional({ checkFalsy: true })
    .unescape()
    .isISO8601();   // Data no formato YYYY-MM-DD
  req
    .checkBody("duration", "Insira apenas numeros")
    .optional({ checkFalsy: true })
    .matches(/[0-9]/);
  req
    .checkBody("description", "Insira apenas texto")
    .optional({ checkFalsy: true })
    .matches(/^[a-z ]+$/i);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (task_name != "NULL" && typeof task_name != "undefined") {
      const sqlvalues = [task_name, status, volunteer_id, start_date, end_date, duration, description, task_id];
      //criar e executar a query de gravação na BD para inserir os dados presentes no post
      const query = connect.con.query(
        "UPDATE tasks SET task_name=?, status=?, volunteer_id=?, start_date=?, end_date=?, duration=?, description=?  WHERE task_id=?",
        sqlvalues,
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

//delete físico
function deleteF(req, res) {
  const idtask = req.sanitize("id").escape();
  const query = connect.con.query(
    "DELETE FROM tasks WHERE task_id=?",
    idtask,
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
  readConfTasks: readConfTasks,
  read: read,
  readID: readID,
  create: create,
  update: update,
  deleteF: deleteF,
};
