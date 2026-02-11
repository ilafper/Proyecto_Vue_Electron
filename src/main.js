// src/main.js - PUNTO DE ENTRADA DE VUE
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import { Icon } from '@iconify/vue'

// 2. Crear aplicación Vue
const app = createApp(App);
app.component('Icon', Icon)
app.use(router);


app.mount('#app');

// 4. Log para confirmar
console.log('Vue montado correctamente');
console.log('Electron API disponible:', !!window.electronAPI);