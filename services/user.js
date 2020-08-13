const DB = require("../database");
const QR = require("../queryReader");
const bcrypt = require("bcrypt");

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
    let usuarios = [];

    try {
      await database.conn();

      //Trae a todos los usuarios
      const { rows: lista_usuarios } = await database.execute(
        queryReader.read("Usuario", "Traer_Todos"),
        []
      );

      //Trae los modulos de los usuarios
      for (let usuario of lista_usuarios) {
        let { rows: modules } = await database.execute(
          queryReader.read("Usuario", "Traer_Modulos"),
          [usuario.id_usuario]
        );

        usuario.modules = [];
        for (let module of modules) {
          usuario.modules.push(module.id_modulo);
        }
      }

      await database.close();

      return {
        status: 200,
        msg: "Se buscaron los usuarios exitosamente",
        data: lista_usuarios,
      };
    } catch (e) {
      console.log(e);
      return { status: 400, msg: "Error al buscar los usuarios" };
    }
  },

  //Selecciona usuarios por id
  getUser: async (id) => {
    await database.conn();

    const { rows } = await database.execute(
      queryReader.read("Usuario", "Buscar"),
      [id]
    );

    rows[0].modules = await userService.getModules(rows[0].id_usuario);
    console.log("user", rows[0]);
    await database.close();

    return rows[0];
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
        return { status: 409, msg: "Ya existe una persona con este ci" };
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
        return {
          status: 409,
          msg: "Ya existe una persona con este nombre de usuario",
        };
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

      //Colocar datos en Modulos
      if (modules.length > 0) {
        await database.execute(
          queryReader.read("Usuario", "Agregar_Acceso") +
            ModulesToInsert(rows_usuario[0].id_usuario, modules),
          []
        );
      }

      await database.close();

      return { status: 200, msg: "Usuario creado exitosamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, msg: "Se produjo un error al crear el usuario" };
    }
  },

  //Actualiza un usuario
  updateUser: async (id_persona, values) => {
    const {
      nombre_persona,
      ci_persona,
      numero_persona,
      direccion_persona,
      nombre_usuario,
      contrasena_usuario,
      modules,
    } = values;

    try {
      await database.conn();

      //Verifica la cedula
      const { rowCount: personas } = await database.execute(
        queryReader.read("Verificar_Actualizar_CI"),
        [ci_persona, id_persona]
      );

      if (personas > 0) {
        await database.close();
        return { status: 409, msg: "Ya existe un usuario con esta cedula" };
      }

      //Verifica el nombre de usuario
      const { rowCount: usuarios } = await database.execute(
        queryReader.read("Usuario", "Verificar_Nombre"),
        [nombre_usuario, id_persona]
      );

      if (usuarios > 0) {
        await database.close();
        return { status: 409, msg: "Ya existe un usuario con este nombre" };
      }

      //Actualiza los datos del usuario en la tabla persona
      await database.execute(queryReader.read("Actualizar_Persona"), [
        id_persona,
        nombre_persona,
        direccion_persona,
        numero_persona,
        ci_persona,
      ]);

      let idUsuario = null;

      //Actualiza los datos del usuario en la tabla usuario
      if (!contrasena_usuario) {
        //Cambia el usuario pero no la clave
        const { rows } = await database.execute(
          queryReader.read("Usuario", "Actualizar"),
          [id_persona, nombre_usuario]
        );

        idUsuario = rows[0].id_usuario;
      } else {
        //Cambia usuario con clave
        const { rows } = await database.execute(
          queryReader.read("Usuario", "Actualizar_Clave"),
          [
            id_persona,
            nombre_usuario,
            await bcrypt.hash(contrasena_usuario, 10),
          ]
        );

        idUsuario = rows[0].id_usuario;
      }

      //Borra los modulos del usuario
      await database.execute(queryReader.read("Usuario", "Borrar_Acceso"), [
        idUsuario,
      ]);

      //Agrega los nuevos modulos del usuario
      await database.execute(
        queryReader.read("Usuario", "Agregar_Acceso") +
          ModulesToInsert(idUsuario, modules),
        []
      );

      await database.close();

      return { status: 200, msg: "Usuario actualizado exitosamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, msg: "Algo salio mal al actualizar el usuario" };
    }
  },

  //Borra un usuario
  deleteUser: async () => {},

  //Logeo de usuario
  login: async (values) => {
    const { username, password } = values;

    try {
      await database.conn();
      //Verificar que exista nombre de usuario
      const { rows } = await database.execute(
        queryReader.read("Usuario", "Buscar_Login"),
        [username]
      );

      if (rows.length > 0) {
        if (await bcrypt.compare(password, rows[0].contrasena_usuario)) {
          const { rows: userData } = await database.execute(
            queryReader.read("Usuario", "Buscar"),
            [rows[0].id_usuario]
          );

          const { rows: modules } = await database.execute(
            queryReader.read("Usuario", "Traer_Modulos"),
            [userData[0].id_usuario]
          );

          let arr = [];

          for (let i of modules) {
            arr.push(i.id_modulo);
          }

          userData[0].modules = arr;
          await database.close();
          return {
            status: 200,
            msg: "Usuario logeado exitosamente",
            data: userData[0],
          };
        } else {
          await database.close();
          return { status: 202, msg: "Verfique los datos ingresados" };
        }
      } else {
        await database.close();
        return { status: 202, msg: "Verfique los datos ingresados" };
      }
    } catch (e) {
      return { status: 500, msg: "Sucedio un error al iniciar sesion" };
    }
  },
};

module.exports = userService;
