import { Producto } from "../Models/productos.js";

const getProducto = async (req, res) => {
  const { idProducto } = req.params;
  try {
    const producto = await Producto.findByPk(idProducto);
    res.status(200).json([producto]);
  } catch (error) {
    res.status(400).json({ mensaje: error });
  }

};

const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ mensaje: error });
  }
};

const postProductos = async (req, res) => {
  const { nombre, detalle, valor } = req.body;
  console.log(req.body);
  console.log(req.file);
  console.log(req.file.filename);

  try {
    const newProducto = await Producto.create({
      nombre,
      detalle,
      valor,
      imagen: req.file.filename
    });
    res.status(200).json(newProducto);
  } catch (error) {
    res.status(400).json({ mensaje: error });
  }

};

const putProductos = async (req, res) => {
  const { idProducto } = req.params;
  const { nombre, detalle, valor } = req.body;
  try {
    const oldProducto = await Producto.findByPk(idProducto);
    oldProducto.nombre = nombre;
    oldProducto.detalle = detalle;
    oldProducto.valor = valor;
    oldProducto.imagen = req.file.filename;
    const modProducto = await oldProducto.save();
    res.status(200).json(modProducto);
  } catch (error) {
    res.status(400).json({ mensaje: error });
  }
};

const deleteProductos = async (req, res) => {
  const { idProducto } = req.params;
  try {
    const respuesta = await Producto.destroy({
      where: {
        idProducto,
      },
    });
    res.status(200).json({ mensaje: "Registro Eliminado" });
  } catch (error) {
    if (error.name == "SequelizeForeignKeyConstraintError") {
      res.status(500).json({ mensaje: "Este producto no se puede eliminar porque tiene pedidos registrados, elimine su historial de pedidos y vuelvelo a intentar" });
      return
    }
    res.status(400).json({ mensaje: "Registro No Eliminado" + error });
  }
};

export { getProducto, getProductos, postProductos, putProductos, deleteProductos };


