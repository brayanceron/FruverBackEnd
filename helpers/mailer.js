import nodemailer from "nodemailer"

let EMAIL= process.env.EMAIL_USER;
let PASS= process.env.EMAIL_PASS

const transporter= nodemailer.createTransport({
    host:"smtp.office365.com",
    port: 587,
    secure: false,
    auth:{
        user:EMAIL,
        pass:PASS
    }
});

const enviarCorreoElectronico =async (destinatario,asunto,cuerpo)=>{
    try{
    const result= await transporter.sendMail({
      from:`Fruver ${EMAIL}`,
      to:destinatario,
      subject:asunto,
      text:cuerpo
    });
    console.log(result);
    return true;
   }
   catch(error){
    console.log(error);
    return false;
   }
  }

const generarReporte=(pedido)=>{
    let nombresCliente=pedido.cliente.nombres;
    
    let cuerpoCorreo="Hola "+nombresCliente+", hemos procesado y enviado tu pedido \n\n";
    cuerpoCorreo+="Descripción del pedido:\n\n";
  
    pedido.detallePedidos.forEach(element => {
      //cuerpoCorreo+=""+element.producto.nombre+"\t\t"+(element.cantidadProducto+" X "+element.producto.valor+"$").padEnd(15)+"\t\t= "+element.totalProducto+"$\n";
      cuerpoCorreo+=""+element.producto.nombre+" = "+element.cantidadProducto+" X "+element.producto.valor+"$"+" = "+element.totalProducto+"$\n";

    });
    cuerpoCorreo+="------------------------------------------------------------\n";
    cuerpoCorreo+="Total: "+pedido.total+"$\n\n";
    cuerpoCorreo+="Gracias por tu compra!";
    console.log(cuerpoCorreo);
    return cuerpoCorreo;
  }

export {enviarCorreoElectronico,generarReporte}
