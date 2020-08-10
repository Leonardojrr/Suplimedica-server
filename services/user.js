const DB = require("../database");
const QR = require("../queryReader");
const bcrypt = require("bcrypt");
const { query } = require("express");

const database = new DB();
const queryReader = new QR();
queryReader.addPath("Persona");

function ModulesToInsert(user_id, modules) {
  let string = "";

  for (let i in modules) {
    if (i == modules.length - 1) string += `(${modules[i]},${user_id});`;
    else string += `(${modules[i]},${user_id}),`;
  }
  return string;
}

const userService = {
  //Selecciona todos los usuarios
  getAllUsers: async () => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Usuario", "Seleccionar_Todos"),
      []
    );

    await database.close();

    return res;
  },

  //Selecciona usuarios por nombre y ci
  getUser: async (values) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Usuario", "Buscar"),
      values
    );

    await database.close();

    return res;
  },

  //Selecciona usuarios por nombre
  getUserByName: async (values) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Usuario", "Buscar_Nombre"),
      values
    );

    await database.close();

    return res;
  },

  //Selecciona usuarios por ci
  getUserByCi: async (values) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Usuario", "Buscar_CI"),
      values
    );

    await database.close();

    return res;
  },

  //Crea un Usuario
  createUser: async (values) => {
    const { name, address, number, ci, username, password, modules } = values;

    try {
      await database.conn();

      //Verificar ci
      const { rowCount: ci_rows } = await database.execute(
        queryReader.read("Verificar_CI"),
        [ci]
      );

      if (ci_rows > 0) {
        await database.close();
        return "Ya existe una persona con este ci";
      }

      //Verificar nombre de usuario
      const {
        rowCount: username_rows,
      } = await database.execute(
        queryReader.read("Usuario", "Verificar_Nombre"),
        [username]
      );

      if (username_rows > 0) {
        await database.close();
        return "Ya existe una persona con este nombre de usuario";
      }

      //Crear el usuario

      //Colocar datos en persona
      const { rows: rows_persona } = await database.execute(
        queryReader.read("Usuario", "Crear_Persona"),
        [name, address, number, ci]
      );

      //Colocar datos en Usuario
      const { rows: rows_usuario } = await database.execute(
        queryReader.read("Usuario", "Crear_Usuario"),
        [username, await bcrypt.hash(password, 10), rows_persona[0].id_persona]
      );

      console.log(rows_usuario);

      //Colocar datos en Modulos
      if (modules.length > 0) {
        console.log(
          queryReader.read("Usuario", "Agregar_Acceso") +
            ModulesToInsert(rows_usuario[0].id_usuario, modules)
        );
        const asd = await database.execute(
          queryReader.read("Usuario", "Agregar_Acceso") +
            ModulesToInsert(rows_usuario[0].id_usuario, modules),
          []
        );
        console.log(asd);
      }

      await database.close();

      return "usuario creado exitosamente";
    } catch (e) {
      console.log(e);
    }
  },

  //Actualiza un usuario
  updateUser: async () => {},

  //Borra un usuario
  deleteUser: async () => {},
};

module.exports = userService;
