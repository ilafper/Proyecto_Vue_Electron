<!-- src/views/Home.vue - VERSIÓN MÍNIMA -->
<template>
  <div class="home-container">
    <h2>Vista de Administrador</h2>
    <!-- Bienvenida simple -->
    
    <!-- Contenido principal -->
    <div class="content">
      
      
      <!-- Botón para salir -->
      <button @click="handleLogout" class="logout-button">
        Cerrar Sesión
      </button>
      
    </div>
    
  </div>
</template>

<script>




export default {
  name: 'Home',
  
  // Recibir usuario de App.vue
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  
  // Emitir evento para logout
  emits: ['logout'],
  
  data() {
    return {
      loading: false,
      data: []
    };
  },
  
  methods: {
    async getData() {
      this.loading = true;
      
      try {
        // Llamar a Electron para obtener datos
        const result = await window.electronAPI.getData();
        
        if (result.data) {
          this.data = result.data;
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        this.loading = false;
      }
    },
    
    handleLogout() {
      // Emitir evento para que App.vue maneje el logout
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
/* ESTILOS MÍNIMOS */

.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.welcome h1 {
  color: #333;
  margin-bottom: 10px;
}

.welcome p {
  color: #666;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.action-button {
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover:not(:disabled) {
  background-color: #218838;
}

.action-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.data-list {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.data-list h3 {
  margin-bottom: 15px;
  color: #333;
}

.data-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  color: #555;
}

.data-item:last-child {
  border-bottom: none;
}

.logout-button {
  padding: 12px 24px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>