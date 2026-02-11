<template >
  <header>
    <h2><RouterLink class="link" to="/admin">Home</RouterLink></H2>
    <h2><RouterLink class="link" to="/eventosAdmin">Eventos</RouterLink></H2>
  </header>
  <div class="home-container"  v-if="user">

    <h2>Usuario {{ user.rol }}</h2>
    <h2>Bienvenido al sistema</h2>
    
    <!-- Mostrar mensaje de carga mientras se verifica -->
    <div v-if="loading" class="loading">
      Cargando datos...
    </div>
    
    <!-- Mostrar datos del usuario cuando estén disponibles -->
    <div class="datosUser" v-if="user && !loading">
      <p>Nombre: {{ user.nombre }}</p>
    </div>
    
    <!-- Mostrar mensaje si no hay usuario -->
    <div v-if="!user && !loading" class="no-user">
      No se encontraron datos de usuario
    </div>
    
    <div class="content" v-if="user">
      <button @click="salir" class="logout-button">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  
  data() {
    return {
      user: null,  
      loading: true 
    }
  },
  
  mounted() {
    this.cargarDatos()
  },
  
  methods: {
    cargarDatos() {
      console.log('Cargando datos del usuario...')
      
      // Simular un pequeño delay para ver mejor el flujo
      setTimeout(() => {
        const usuarioDatos = localStorage.getItem('user')
        console.log('Usuario en localStorage:', usuarioDatos)
        
        this.loading = false
      }, 100) // Pequeño delay para evitar parpadeo
    },
    
    salir() {
      console.log('Cerrando sesión...')
      localStorage.removeItem('user')
      this.user = null
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

header{
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 2px solid grey;
  padding: 20px;
}
header .link{
  text-decoration: none;
  color: rgb(170, 166, 166);
  font-weight: bold;
  font-size: 20px;
}
.home-container {
  padding: 40px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  height: auto;
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
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c82333;
}

.datosUser {
  width: 300px;
  background-color: #4CAF50;
  color: white;
  height: auto;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.datosUser p {
  margin: 10px 0;
  font-size: 16px;
  text-align: left;
}

.loading {
  padding: 20px;
  color: #666;
  font-size: 18px;
}

.no-user {
  padding: 20px;
  color: #dc3545;
  font-size: 18px;
  background-color: #ffe6e6;
  border-radius: 8px;
  margin: 20px auto;
  width: 300px;
}
</style>