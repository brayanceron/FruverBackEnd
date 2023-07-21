import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";

const Pedido = sequelize.define(
  "pedidos",
  {
    // Definicion de Atributos
    idPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    procesado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
  },
  {
    timestamps: true,
  }
);

export { Pedido };


