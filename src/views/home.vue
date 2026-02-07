<template>
  <div class="home-container">
    <h2>Usuario normal</h2>
    <h2>Bieaasdvenido al sistema</h2>
    
    <!-- Con Options API, user es directamente this.user -->
    <div v-if="user">
      <p>{{ user.nombre }} {{ user.apellidos }}</p>
      <p>Email: {{ user.correo }}</p>
      <p>Rol: {{ user.rol }}</p>
    </div>
    
    <div class="content">
      <button @click="handleLogout" class="logout-button">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  
  mounted() {
    
    const usuarioDatos = localStorage.getItem('user')
    console.log('📋 Usuario en localStorage:', usuarioDatos)
    
    if (!usuarioDatos) {
      this.$router.push('/login')
    } else {
      try {
        this.user = JSON.parse(usuarioDatos)
        console.log('Usuario cargado:', this.user)
      } catch (error) {
        console.error('❌ Error parseando usuario:', error)
        this.$router.push('/login')
      }
    }
  },
  
  methods: {
    handleLogout() {
      console.log('🚪 Cerrando sesión...')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 40px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.logout-button {
  padding: 12px 24px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>