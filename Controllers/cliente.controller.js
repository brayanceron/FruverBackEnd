import { Cliente } from "../Models/cliente.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


let SECRET = process.env.SECRET


const getCliente = async (req, res) => {
    const { idCliente } = req.params;
    try {
        const cliente = await Cliente.findByPk(idCliente);
        res.status(200).json([cliente]);
    } catch (error) {
        res.status(400).json({ mensaje: error });
    }

};

const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const postClientes = async (req, res) => {
    req.body.contrasena = bcrypt.hashSync(req.body.contrasena, 8);
    const { nombres, apellidos, correo, contrasena } = req.body;
    try {
        const newCliente = await Cliente.create({
            nombres,
            apellidos,
            correo,
            contrasena
        });
        res.status(200).json(newCliente);
    } catch (error) {
        if (error.name == "SequelizeUniqueConstraintError") {
            res.status(400).json({ mensaje: "Ya existe una cuenta registrada con esos datos" });
            return;
        }
        res.status(400).json({ mensaje: error });
    }
};

const putClientes = async (req, res) => {
    const { idCliente } = req.params;
    const { nombres, apellidos } = req.body;
    try {
        const oldCliente = await Cliente.findByPk(idCliente);
        oldCliente.nombres = nombres;
        oldCliente.apellidos = apellidos;
        const modCliente = await oldCliente.save();
        res.status(200).json(modCliente);
    } catch (error) {
        res.status(400).json({ mensaje: error });
    }
};

const deleteClientes = async (req, res) => {
    const { idCliente } = req.params;
    try {
        const respuesta = await Cliente.destroy({
            where: {
                idCliente,
            },
        });
        res.status(200).json({ mensaje: "Registro Eliminado" });
    } catch (error) {
        if (error.name == "SequelizeForeignKeyConstraintError") {
            res.status(500).json({ mensaje: "Este usuario no se puede eliminar porque tiene pedidos registrados, elimine su historial de pedidos y vuelvelo a intentar" });
            return;
        }
        res.status(400).json({ mensaje: "Registro No Eliminado" + error });
    }
};

const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    const user = await Cliente.findOne({
        where: { correo: correo }
    });

    if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (!bcrypt.compareSync(contrasena, user.contrasena)) {
        return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    res.status(200).json({ token: crearToken(user), msg: "Login exitoso" },);
}

const verificarTokenSesion = (req, res) => {
    const token = req.headers['authorization'];
    //console.log("VERIFICAR ROKEN")
    if (!token) {
        return res.status(401).json({ msg: "No se encontro el token" });
    }
    else {
        try {
            let payload = jwt.verify(token, SECRET);
            //comprobacion de si el token expiro o no
            if (Date.now() > payload.exp) {
                return res.status(401).json({ msg: "Token expirado" });
            }
            return res.status(200).json({ msg: "Token valido" });

        } catch (error) {
            return res.status(401).json({ msg: error.message });
        }
    }
}

const getRol = async (req, res) => {
    const token = req.headers['authorization'];

    try {
        let payload = jwt.verify(token, SECRET);
        let correo = payload.correo;
        const user = await Cliente.findOne({ where: { correo: correo } });
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        return res.status(200).json({ rol: user.rol, idCliente: user.idCliente });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }

}

function crearToken(user) {
    const payload = {
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        //rol: user.rol,
        exp: (Date.now() + (20 * 60 * 1000))
    };
    return jwt.sign(payload, SECRET)
}


export { postClientes, getClientes, getCliente, putClientes, deleteClientes, login, verificarTokenSesion, getRol };
