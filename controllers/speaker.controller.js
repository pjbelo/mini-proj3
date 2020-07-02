const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

// read all active=1 speakers from conference x
function read(req, res) {
    const idconf = req.sanitize('idconf').escape();
    const sqlquery =
    "SELECT speaker.*, conf_speaker.idConference " +
    "FROM speaker LEFT JOIN conf_speaker ON speaker.idSpeaker = conf_speaker.idSpeaker " +
//    "WHERE active=1 AND idConference=? " +
    //"ORDER BY nome ASC;";
    "ORDER BY idSpeaker DESC;";
    connect.con.query(sqlquery, idconf, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function readID(req, res) {
    const idspeaker = req.sanitize('idspeaker').escape();
    connect.con.query('SELECT DISTINCT idSpeaker, nome, foto, bio, link, filiacao, active, filiacao, linkedin, twitter, facebook, cargo FROM speaker WHERE idSpeaker = ? ', idspeaker, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function create(req, res) {
    const idconf = req.sanitize('idconf').escape();
    const nome = req.sanitize('nome').escape();
    const foto = req.sanitize('foto').escape();
    const bio = req.sanitize('bio').escape();
    const link = req.sanitize('link').escape();
    const filiacao = req.sanitize('filiacao').escape();
    const cargo = req.sanitize('cargo').escape();
    const facebook = req.sanitize('facebook').escape();
    const linkedin = req.sanitize('linkedin').escape();
    const twitter = req.sanitize('twitter').escape();
    req.checkBody("nome", "Nome é obrigatório. Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("cargo", "Cargo é obrigatório. Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("filiacao", "Filiação é obrigatório. Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("link", "Link: Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("foto", "Foto: Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("facebook", "Facebook: Insira um url válido: https://facebook.com/name.").optional({ checkFalsy: true }).matches("https://facebook.com/*");
    req.checkBody("linkedin", "Linkedin: Insira um url válido: https://linkedin.com/name.").optional({ checkFalsy: true }).matches("https://linkedin.com/*");
    req.checkBody("twitter", "Twitter: Insira um url válido: https://twitter.com/name.").optional({ checkFalsy: true }).matches("https://twitter.com/*");
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && filiacao != "NULL" && typeof(nome) != "undefined") {
            const postdata = { nome: nome, foto: foto, bio: bio, link: link, filiacao: filiacao, facebook: facebook, linkedin: linkedin, twitter: twitter, cargo: cargo };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO speaker SET ?', postdata, function(err, rows, fields) {
                console.log(query.sql);
                console.log("############### rows ###############");
                console.log(rows);
                if (!err) {
                    const newid = rows.insertId;
                    const postdata2 = { idConference: idconf, idSpeaker: newid};
                    const query2 = connect.con.query('INSERT INTO conf_speaker SET ?', postdata2, function(err2, rows2, fields2) {
                        if (error) throw error;
                        console.log(postdata2);
                    });
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
    // criar registo na tabela conf_speaker
    console.log("XXXXXXX");
    console.log(newid);

}




function update(req, res) {
    const idspeaker = parseInt(req.sanitize('idspeaker').escape());
    const nome = req.sanitize('nome').escape();
    const foto = req.sanitize('foto').escape();
    const bio = req.sanitize('bio').escape();
    const link = req.sanitize('link').escape();
    const filiacao = req.sanitize('filiacao').escape();
    const cargo = req.sanitize('cargo').escape();
    const facebook = req.sanitize('facebook').escape();
    const linkedin = req.sanitize('linkedin').escape();
    const twitter = req.sanitize('twitter').escape();
    req.checkBody("nome", "Nome é obrigatório. Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("cargo", "Cargo é obrigatório. Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("filiacao", "Filiação é obrigatório. Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("link", "Link: Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("foto", "Foto: Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("facebook", "Facebook: Insira um url válido: https://facebook.com/name.").optional({ checkFalsy: true }).matches("https://facebook.com/*");
    req.checkBody("linkedin", "Linkedin: Insira um url válido: https://linkedin.com/name.").optional({ checkFalsy: true }).matches("https://linkedin.com/*");
    req.checkBody("twitter", "Twitter: Insira um url válido: https://twitter.com/name.").optional({ checkFalsy: true }).matches("https://twitter.com/*");
    req.checkParams("idspeaker", "Insira um ID de speaker válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idspeaker != "NULL" && typeof(nome) != 'undefined' && typeof(cargo) != 'undefined' && typeof(idspeaker) != 'undefined') {
            const postdata = [nome, foto, bio, link, filiacao, cargo, facebook, linkedin, twitter, idspeaker];
            const query = connect.con.query('UPDATE speaker SET nome=?, foto=?, bio=?,link=?, filiacao=?, cargo=?, facebook=? , linkedin=?, twitter=?  WHERE idSpeaker=?', postdata, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                }
                else {
                    console.log(query.sql);
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function deleteL(req, res) {
    const idspeaker = req.sanitize('id').escape();
    const queryparams = [0, idspeaker]
    const query = connect.con.query('UPDATE speaker SET active = ? WHERE idSpeaker=?', queryparams, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function deleteF(req, res) {
    const idconf = req.sanitize('idconf').escape();
    const idspeaker = req.sanitize('idspeaker').escape();
    // delete record(s) from table conf_speaker




    // delete speaker record
    const query = connect.con.query('DELETE FROM speaker WHERE idSpeaker=?', idspeaker, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

module.exports = {
    read: read,
    readID: readID,
    create: create,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
};
