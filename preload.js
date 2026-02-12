const { contextBridge, ipcRenderer } = require('electron');
console.log("Preload sususus");

contextBridge.exposeInMainWorld('electronAPI', {
  // Login
  login: (email, password) => {
    return ipcRenderer.invoke('api-login', { email, password});
  },

  registro: (nombre,apellidos,correo, contraseña, contraseña2) => {
    return ipcRenderer.invoke('api-registro', { nombre,apellidos,correo, contraseña, contraseña2});
  },
  
  // Obtener usuarios
  getUsuarios: () => {
    return ipcRenderer.invoke('api-get-usuarios');
  },

  getEventos:()=>{
    return ipcRenderer.invoke('api-get-eventos');
  },
  // const {
  //     nombreEvento,
  //     descripcionEvento,
  //     plazasTotales,
  //     fechaInicio,
  //     fechaFin,
  //   } = req.body;


  crearEvento: (nombreEvento,descripcionEvento,plazasTotales, fecha, horaInicio, horaFin) => {
    return ipcRenderer.invoke('api-crear-evento', { nombreEvento,descripcionEvento,plazasTotales,fecha, horaInicio,horaFin});
  },



  //elimina reventos
  eliminarEvento:(codigoEliminar)=>{
    return ipcRenderer.invoke('api-eliminar-evento',codigoEliminar);
  }
  
});