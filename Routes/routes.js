import { Router } from 'express';
import { postClientes, getClientes, getCliente, deleteClientes, putClientes, login, verificarTokenSesion, getRol } from '../Controllers/cliente.controller.js';
import { getProducto, getProductos, postProductos, putProductos, deleteProductos } from '../Controllers/producto.controller.js';
import { getPedido, getPedidos, postPedidos,putPedidos, deletePedido, procesarPedido, getPedidosCliente } from '../Controllers/pedido.controller.js';
import { verificarToken } from '../Middleware/autenticacion.js';
import { upload } from '../Middleware/multer.js';
const router = Router();


// Rutas
//------------------------------------
router.get("/productos", verificarToken, getProductos);
router.get("/producto/:idProducto", verificarToken, getProducto);
router.post("/productos", verificarToken, upload.single('file'), postProductos);
router.put("/productos/:idProducto", verificarToken, upload.single('file'), putProductos);
router.delete("/productos/:idProducto", verificarToken, deleteProductos);
//------------------------------------
router.get("/pedidos", verificarToken, getPedidos);
router.get("/pedido/:idPedido", verificarToken, getPedido);
router.get("/pedidos/cliente/:idCliente", verificarToken, getPedidosCliente);
router.post("/pedidos", verificarToken, postPedidos);
router.put("/pedidos/procesar/:idPedido",verificarToken,procesarPedido);
router.put("/pedidos/:idPedido",verificarToken, putPedidos);
router.delete("/pedidos/:idPedido",verificarToken, deletePedido);
//------------------------------------
router.get("/clientes", verificarToken, getClientes);
router.get("/cliente/:idCliente", verificarToken, getCliente);
router.post("/clientes", postClientes);
router.post("/login", login);
router.get("/verificarToken", verificarTokenSesion);
router.get("/getRol", verificarToken, getRol);
router.put("/clientes/:idCliente", verificarToken, putClientes);
router.delete("/clientes/:idCliente", verificarToken, deleteClientes);


export default router;

