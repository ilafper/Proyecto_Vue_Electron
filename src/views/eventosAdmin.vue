<template>
  <div class="dashboard-container">
    <!-- Menú lateral -->
    <div class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <h3 v-if="!sidebarCollapsed">Eventos admin</h3>
        <button class="toggle-btn" @click="toggleSidebar">
          {{ sidebarCollapsed ? '>' : '<' }} </button>
      </div>

      <nav class="sidebar-menu">
        <ul>
          <li>
            <router-link to="/admin" class="menu-item">
              <Icon icon="mdi:home-outline" width="28" />
              <span v-if="!sidebarCollapsed" class="menu-text">Panel admin</span>
            </router-link>
          </li>

          <li>
            <router-link to="/usersAdmin" class="menu-item">
              <Icon icon="mdi:user" width="28" />
              <span v-if="!sidebarCollapsed" class="menu-text">Administrar Usuarios</span>
            </router-link>
          </li>



          <li>
            <router-link to="/eventosAdmin" class="menu-item">
              <Icon icon="mdi:calendar-text" width="28" />
              <span v-if="!sidebarCollapsed" class="menu-text">Administrar Eventos</span>
            </router-link>
          </li>
        </ul>
      </nav>





      <!-- info user menu lateral inferior-->
      <div class="sidebar-footer" v-if="!sidebarCollapsed && user">
        <div class="user-info">
          <div class="user-avatar">{{ getInitials(user.nombre, user.apellidos) }}</div>
          <div class="user-details">
            <p class="user-name">{{ user.nombre }} {{ user.apellidos }}</p>
            <p class="user-role">{{ user.rol }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <header class="main-header">
        <div class="header-left">
          <h1>Gestion eventos</h1>
        </div>
        <div class="header-right">
          <button @click="salir" class="logout-button">
            Salir
          </button>
        </div>
      </header>

      <div class="content-wrapper">
        <!-- Mostrar mensaje de carga mientras se verifica -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando datos...</p>
        </div>
        <div class="header-boton">
          <button @click="abrirCrear" class="crear-evento">Crear evento</button>
        </div>


        <div class="contenido-tabla">

          <div class="card table-container">
            <div class="loading-state" v-if="loading">
              <div class="spinner"></div>
              <p>Cargando eventos...</p>
            </div>

            <div v-else class="table-responsive">
              <table class="events-table">
                <thead>

                  <tr>
                    <th class="text-left">Nombre</th>
                    <th class="text-left">Descripción</th>
                    <th class="text-center">Plazas Total</th>
                    <th class="text-center">Disponibles</th>
                    <th class="text-center">Fecha</th>
                    <th class="text-center">Hora</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cada_evento in eventos">
                    <td class="event-name">
                      <strong>{{ cada_evento.nombreEvento }}</strong>
                    </td>
                    <td class="event-description">
                      {{ ajusteTexto(cada_evento.descripcionEvento, 40) }}
                    </td>
                    <td class="text-center">
                      <span class="badge">{{ cada_evento.plazasTotales }}</span>
                    </td>
                    <td class="text-center">
                      <span :class="['badge', cada_evento.PlazasDisponibles]">
                        {{ cada_evento.PlazasDisponibles }}
                      </span>
                    </td>
                    <td class="text-center date-cell">
                      {{ cada_evento.fecha }}
                    </td>
                    <td class="text-center date-cell">
                      {{ cada_evento.horaInicio }} - {{ cada_evento.horaFin }}
                    </td>

                    <td class="action-cell">
                      <div class="action-buttons">
                        <button class="btn-icon btn-edit" title="Editar evento" @click="abrirEditar(cada_evento)">
                          <Icon icon="mdi:pencil" width="18" />
                        </button>
                        <button class="btn-icon btn-delete" title="Eliminar evento"
                          @click="eliminEvento(cada_evento.code_Evento)">
                          <Icon icon="mdi:trash-can-outline" width="18" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>

      </div>

      <!--componente modal -->
      <ModalEvento v-model:mostrar="mostrarModal" :modo="modoModal" :evento="eventoSeleccionado"
        @guardar="guardarEvento" />
    </div>

  </div>
</template>

<script>

import ModalEvento from '../components/modal.vue'

export default {
  name: 'EventosAdmin',

  components: {
    ModalEvento
  },
  data() {
    return {
      user: null,
      loading: true,
      sidebarCollapsed: false,
      currentPage: 1,
      eventos: [],
      // para controlar el modal 
      mostrarModal: false,
      modoModal: 'crear',
      eventoSeleccionado: null
    }
  },

  mounted() {
    this.cargarDatos()
    this.cargareventos()

  },

  methods: {


    abrirCrear() {
      console.log("abierto modal crear");

      this.modoModal = 'crear'
      this.eventoSeleccionado = null
      this.mostrarModal = true
    },


    abrirEditar(evento) {
      console.log('Evento a editar:', JSON.parse(JSON.stringify(evento)))

      console.log("modal editar");

      this.modoModal = 'editar'
      this.eventoSeleccionado = evento
      this.mostrarModal = true
    },

    salir() {
      console.log('Cerrando sesión...')
      localStorage.removeItem('user')
      this.user = null
      this.$router.push('/login')
    },

    cargarDatos() {
      console.log('Cargando datos del usuario...')

      setTimeout(() => {
        const usuarioDatos = localStorage.getItem('user')
        console.log('Usuario en localStorage:', usuarioDatos)

        if (!usuarioDatos) {
          console.log('No hay usuario, redirigiendo a login...')
          this.$router.push('/login')
        } else {
          try {
            this.user = JSON.parse(usuarioDatos)
            console.log('Usuario cargado:', this.user)
          } catch (error) {
            console.error('Error parseando usuario:', error)
            this.$router.push('/login')
          }
        }

        this.loading = false
      }, 300)
    },

    salir() {
      console.log('Cerrando sesión...')
      localStorage.removeItem('user')
      this.user = null
      this.$router.push('/login')
    },

    goToLogin() {
      this.$router.push('/login')
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    getInitials(nombre, apellidos) {
      if (!nombre || !apellidos) return 'U'
      return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase()
    },

    //cargar eventos funcion
    async cargareventos() {

      try {
        const response = await window.electronAPI.getEventos()
        //console.log("eventos evento sisis", response);

        if (response.success) {
          this.eventos = response.eventos.eventosFormateados
          console.log("asdasd", this.eventos);
        } else {
          this.error = response.message
        }
      } catch (err) {
        console.error('Error Electron:', err)
        this.error = 'Error al conectar con el servidor'
      } finally {
        this.loading = false
      }
    },


    ajusteTexto(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text
    },

    async guardarEvento(datos) {
      try {
        if (this.modoModal === 'crear') {
          // CREAR
          const resultado = await window.electronAPI.crearEvento(
            datos.nombreEvento,
            datos.descripcionEvento,
            datos.plazasTotales,
            datos.fecha,
            datos.horaInicio,
            datos.horaFin
          )
          console.log('Evento creado:', resultado)
        } else {
          //parte editar
          console.log(this.eventoSeleccionado);
          
          // 2. Crear objeto COMPLETO con todos los campos
          const eventoActualizado = {
            code_Evento: this.eventoSeleccionado.code_Evento,
            nombreEvento: datos.nombreEvento,
            descripcionEvento: datos.descripcionEvento,
            plazasTotales: Number(datos.plazasTotales),
            fecha: datos.fecha,
            horaInicio: datos.horaInicio,
            horaFin: datos.horaFin,
            PlazasDisponibles: this.eventoSeleccionado.PlazasDisponibles,
          }
          
          console.log('Enviando a API:', eventoActualizado)

          // 3. Llamar a Electron
          const resultado = await window.electronAPI.modievento(eventoActualizado)
          console.log('Respuesta:', resultado)
        }

        await this.cargareventos()
      } catch (error) {
        console.error('Error al guardar:', error)
      }
    },



    // 
    async eliminEvento(codigoEliminar) {
      console.log("Codigo recibido:", codigoEliminar);

      const preguntaEliminar = confirm('¿Estás seguro de eliminar este evento?');
      if (preguntaEliminar) {
        console.log("asdasd", codigoEliminar);

        const resultado = await window.electronAPI.eliminarEvento(codigoEliminar);
        console.log(resultado);
        this.cargareventos();
      } else {
        console.log("Eliminación cancelada");
      }
    }
  }
}
</script>

<style scoped>
/* Versión ultra simple */
.table-responsive {
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
}

.events-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.text-center {
  text-align: center;
}

.badge {
  background: #f0f0f0;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.btn-icon {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  color: #666;
}

.btn-icon:hover {
  color: #000;
}

.header-boton {
  display: flex;
  justify-content: end;
}

.crear-evento {
  background-color: #263545;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px;
  border-radius: 5px;
}

.contenido-tabla {
  border: 1px solid black;
  margin-top: 20px;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Estilos del menú lateral */
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #1a2530 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 5px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border-left-color: rgba(255, 255, 255, 0.2);
}

.menu-item.active {
  background-color: rgba(52, 152, 219, 0.2);
  color: white;
  border-left-color: #3498db;
}

.menu-icon {
  font-size: 1.2rem;
  margin-right: 15px;
  min-width: 24px;
}

.menu-text {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 5px 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-role {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Estilos del contenido principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.main-header {
  background-color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 5;
}

.main-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.logout-button {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.logout-button:hover {
  background-color: #c0392b;
}

.content-wrapper {
  border: 1px solid red;
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Estilos de carga */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Estilos del contenido principal */
.welcome-section {
  background: linear-gradient(135deg, #3498db, #2c3e50);
  color: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.welcome-text {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.card-header {
  background-color: #f8f9fa;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.card-content {
  padding: 30px;
}

.info-row {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  width: 200px;
  font-weight: 600;
  color: #555;
}

.info-value {
  flex: 1;
  color: #333;
}

.role-badge {
  display: inline-block;
  background-color: #e8f4fc;
  color: #3498db;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.dashboard-card {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.dashboard-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.dashboard-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.card-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: color 0.3s;
}

.card-link:hover {
  color: #2980b9;
}

/* Estilos para otras páginas */
.page-content {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.page-content h2 {
  color: #2c3e50;
  margin-top: 0;
}

/* Estilos para mensaje sin usuario */
.no-user-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.message-container {
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 400px;
}

.message-container h3 {
  color: #e74c3c;
  margin-bottom: 15px;
}

.login-button {
  padding: 12px 25px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.login-button:hover {
  background-color: #2980b9;
}

/* Responsividad */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100%;
    transform: translateX(-100%);
    z-index: 100;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 250px;
  }

  .dashboard-cards {
    grid-template-columns: 1fr;
  }

  .info-row {
    flex-direction: column;
  }

  .info-label {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>