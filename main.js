// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // En desarrollo: cargar desde servidor Vue
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // Abre DevTools
    console.log('🔧 Modo desarrollo: cargando desde http://localhost:5173');
  } else {
    // En producción: cargar archivos compilados
    mainWindow.loadFile('dist/index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


// HANDLER PARA LOGIN
ipcMain.handle('api-login', async (event, { email, password }) => {
  console.log('📨 Recibiendo login para:', email);
  
  try {
    // Enviar solicitud a la api
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        contraseña: password
      })
    });
    
    const data = await response.json();
    
    console.log('📥 Respuesta de API:', {
      success: data.success,
      user: data.user ? 'Usuario recibido' : 'No user'
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Error conectando a la API:', error);
    return {
      success: false,
      message: 'No se pudo conectar al servidor'
    };
  }
});

// HANDLER PARA OBTENER USUARIOS
ipcMain.handle('api-get-usuarios', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/usuarios');
    const data = await response.json();
    return { success: true, usuarios: data };
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    return { success: false, message: 'Error obteniendo usuarios' };
  }
});

// HANDLER PARA CREAR USUARIO
ipcMain.handle('api-crear-usuario', async (event, usuarioData) => {
  try {
    const response = await fetch('http://localhost:3000/api/crearusuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarioData)
    });
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    return { error: 'Error creando usuario' };
  }
});


// INICIAR LA APLICACIÓN


app.whenReady().then(() => {
  createWindow();
  console.log('✅ Electron iniciado correctamente');
  console.log('🔗 Preload:', path.join(__dirname, 'preload.js'));
  console.log('🔌 Handlers cargados: api-login, api-get-usuarios, api-crear-usuario');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('🔥 Error no capturado:', error);
});

console.log('🚀 Electron main.js cargado - Esperando app.whenReady()');