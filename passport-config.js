// const LocalStrategy = require("passport-local").Strategy;
// const userService = require("./services/user");

// function initializePassport(passport) {
//   const authenticateUser = async (username, password, done) => {
//     const { rows } = await userService.getUser({ username, password });
//     if (rows < 1) {
//       return done(null, false, {
//         msg:
//           "El inicio de sesion a fallado, verifique los datos  que se colocaron",
//       });
//     }
//   };

//   passport.use(
//     new LocalStrategy({ usernameField: "username" }, authenticateUser)
//   );

//   passport.serializeUser((user,done)=> done(null,user.id))
//   passport.deserializeUser((user,done)=>)
// }
