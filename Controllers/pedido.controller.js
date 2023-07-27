import { Pedido } from "../Models/pedidos.js";
import { Producto } from "../Models/productos.js";
import { detallePedido } from "../Models/detallePedido.js";
import { Cliente } from "../Models/cliente.js";
import { enviarCorreoElectronico, generarReporte } from "../helpers/mailer.js";


const postPedidos = async (req, res) => {
  const { total, idCliente, productos } = req.body;

  try {
    let totalCompra = 0;

    const newPedido = await Pedido.create({
      total: 0,
      idCliente: idCliente,
    });
    let idPedido = newPedido.idPedido;

    let itemsProcesado = 0;
    productos.forEach(async producto => {
      const productoEncontrado = await Producto.findByPk(producto.idProducto);
      let cantidadProducto = producto.cantidadProducto;
      let totalProducto = productoEncontrado.valor * cantidadProducto;
      totalCompra = totalCompra + totalProducto;
      
      const newProducto = await detallePedido.create({
        idProducto: producto.idProducto,
        idPedido: idPedido,
        cantidadProducto: cantidadProducto,
        totalProducto: totalProducto
      });
      itemsProcesado++;
      if(itemsProcesado === productos.length) {callback();}
    });

    async function callback () {      
      const newPedido2 = await Pedido.findByPk(idPedido);
      newPedido2.total = totalCompra;
      const modPedido = await newPedido2.save();
      res.status(200).json(modPedido);
    }
  } catch (error) {
    res.status(400).json({ err: error, mensaje: error.message });
  }
};

const getPedido = async (req, res) => {
  const { idPedido } = req.params;

  try {
    const pedidos = await Pedido.findByPk(idPedido, {
      include: [{
        model: detallePedido,
        include: { model: Producto }
      }]
    });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }

};

const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{
        model: detallePedido,
        include: { model: Producto,/*include: { model: Cliente }*/ }
      },
      {
        model: Cliente
      }
      ],
      order: [["procesado", "ASC"], ["createdAt", "DESC"]]
    });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const getPedidosCliente = async (req, res) => {
  const { idCliente } = req.params;

  try {
    const pedidos = await Pedido.findAll({
      where: {
        idCliente: idCliente
      },
      include: [{
        model: detallePedido,
        include: { model: Producto }
      },
      {
        model: Cliente
      }],
      order: [["procesado", "ASC"], ["createdAt", "DESC"]]
    });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const deletePedido = async (req, res) => {
  const { idPedido } = req.params;
  try {
    const respuesta = await Pedido.destroy({
      where: {
        idPedido,
      },
    });
    res.status(200).json({ mensaje: "Registro Eliminado" });
  } catch (error) {
    res.status(400).json({ mensaje: "Registro No Eliminado: " + error });
  }
};

const procesarPedido = async (req, res) => {
  const { idPedido } = req.params;

  try {
    const pedido = await Pedido.findByPk(idPedido, {
      include: [{
          model: detallePedido,
          include: { model: Producto,}
        },
        {
          model: Cliente
        }
      ]
    });
    if(pedido.procesado==true){return res.status(409).json({ mensaje: "El pedido no puede ser modificado porque ya fue procesado" });}
    pedido.procesado = true;
    const modPedido = await pedido.save();
    //console.log("Si");
    let correoCliente = pedido.cliente.correo;
    let asunto = "Pedido Fruver";

    enviarCorreoElectronico(correoCliente, asunto, generarReporte(pedido));

    res.status(200).json(modPedido);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const putPedidos = async (req, res) => {
  const { idPedido } = req.params;
  const { productos,procesado } = req.body;

  try {
    const newPedido = await Pedido.findByPk(idPedido);
    if(newPedido.procesado==true){return res.status(409).json({ mensaje: "El pedido no puede ser modificado porque ya fue procesado" });}

    let totalCompra = 0;
    await detallePedido.destroy({
      where: {idPedido},
    });

    let itemsProcesado = 0;
    productos.forEach(async (producto,index) => {
      const productoEncontrado = await Producto.findByPk(producto.idProducto);
      let cantidadProducto =  producto.cantidadProducto;
      let totalProducto =  productoEncontrado.valor * cantidadProducto;
      totalCompra =  totalCompra + totalProducto;
      
      const newProducto = await detallePedido.create({
        idProducto: producto.idProducto,
        idPedido: idPedido,
        cantidadProducto: cantidadProducto,
        totalProducto: totalProducto
      });
      itemsProcesado++;
      if(itemsProcesado === productos.length) {callback();}
    });

    async function callback () {      
      newPedido.total= totalCompra;
      newPedido.procesado=procesado;
      const modPedido = await newPedido.save();
      res.status(200).json(modPedido);
    }    
  } catch (error) {
    res.status(400).json({ err: error, mensaje: error.message });
  }
};

export { postPedidos,putPedidos, getPedido, getPedidos, deletePedido, procesarPedido, getPedidosCliente };
