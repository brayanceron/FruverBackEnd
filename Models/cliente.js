import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";


const Cliente = sequelize.define(
  "clientes",
  {
    // Definicion de Atributos
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user"
    },
  },
  {
    timestamps: false,
  },
  
);

export { Cliente };

