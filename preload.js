const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Login
  login: (email, password) => {
    return ipcRenderer.invoke('api-login', { email, password});
  },
  
  // Obtener usuarios
  getUsuarios: () => {
    return ipcRenderer.invoke('api-get-usuarios');
  },
  
  // Crear usuario
  crearUsuario: (usuarioData) => {
    return ipcRenderer.invoke('api-crear-usuario', usuarioData);
  }
});