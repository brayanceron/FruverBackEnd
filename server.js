import express from "express";
import router from "./Routes/routes.js";
import { sequelize } from "./Database/database.js";
import { Cliente } from "./Models/cliente.js";
import bcrypt from "bcrypt";
import cors from "cors";




const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(router);
app.set("port", process.env.PORT);

//Test a Base de datos
const testDb = async () => {
  try {
    //await sequelize.sync(/*{force: true}*/);
    await sequelize.authenticate();
    console.log(`Conexion realizada con éxito`);
    
    await crearAdmin();
    app.listen(app.get("port"), () => {
      console.log(`Servidor Escuchando por puerto ${app.get("port")}`);
    });
    
  } catch (error) {
    console.log(`Error al realizar conexión ${error}`);
  }
};
//Creando Rol Admin
const crearAdmin= async ()=>{
  try {
    const newCliente = await Cliente.create({
      idCliente: 1,
      nombres: "admin",
      apellidos: "admin",
      correo: "admin",
      contrasena: bcrypt.hashSync("admin", 8),
      rol:"admin"
    });
    console.log("Admin creado");
  } catch (error) {
    if(error.name=="SequelizeUniqueConstraintError") {console.log("Ya existe el rol admin");return;};
    console.log(error.message);    
  }
}
testDb();

