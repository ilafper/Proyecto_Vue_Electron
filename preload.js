const { contextBridge, ipcRenderer } = require('electron');

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
  
});