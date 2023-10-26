module.exports = class TipoUsuarioDAL {

    constructor(starlight) {
        this.starlight = starlight;
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.starlight.query('SELECT * FROM tipo_usu where status_tipo_usu = 1', function (error, elements) {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.starlight.query("select*from tipo_usuario where id_tipo_usuario = ? and status_tipo_usu = 1", [id], function (error, results){
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.starlight.query("insert into tipo_usu set ?",
            camposJson,
            function (error, elements) {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    }

    update(camposJson) {
        return new Promise((resolve, reject) => {
            this.starlight.query(
                "UPDATE tipo_usu SET tipo_usuario = ?, inscricao_usuario = ? WHERE id_tipo_usuario = ?",
                [camposJson.tipo_usuario, camposJson.descricao_usuario, camposJson.id_tipo_usuario],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.starlight.query("UPDATE tipo_usuario SET status_tipo_usuario = 0 WHERE id_tipo_usuario = ?", [id], function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }
}