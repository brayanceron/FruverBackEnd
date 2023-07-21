import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import { Pedido } from "./pedidos.js";
import { Producto } from "./productos.js";
import { Cliente } from "./cliente.js";

const detallePedido = sequelize.define(
  "detallePedido",
  {
    // Definicion de Atributos
    cantidadProducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalProducto: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  },
  {
    timestamps: false,
  }
);

//Relaciones 
Cliente.hasMany(Pedido,{foreignKey:"idCliente",sourceKey:"idCliente",onDelete:'restrict'});
Pedido.belongsTo(Cliente,{foreignKey:"idCliente",foreign:"idCliente",onDelete:'restrict'});

Pedido.hasMany(detallePedido,{foreignKey:"idPedido",sourceKey:"idPedido",onDelete:'cascade'});
detallePedido.belongsTo(Pedido,{foreignKey:"idPedido", foreign:"idPedido",onDelete:'cascade'});

Producto.hasMany(detallePedido,{foreignKey:"idProducto",sourceKey:"idProducto", onDelete:'restrict'});
detallePedido.belongsTo(Producto,{foreignKey:"idProducto",foreign:"idProducto", onDelete:'restrict'});

export { detallePedido };


//Producto.belongsToMany(Pedido,{through: "detallePedido"});
//Pedido.belongsToMany(Producto,{through: "detallePedido"});