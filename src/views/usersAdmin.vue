<template>
  <div class="usuarios-container">
    <!-- Header con navegación -->
    <header class="admin-header">
      <div class="header-content">
        <h1 class="app-title">Panel de Administración</h1>
        <nav class="nav-links">
          
          <RouterLink class="nav-link" to="/admin">
            <Icon icon="mdi:home" width="20" />
            <span>Home</span>
          </RouterLink>

          <RouterLink class="nav-link" to="/eventosAdmin">
            <Icon icon="mdi:calendar" width="20" />
            <span>Eventos</span>
          </RouterLink>
          <RouterLink class="nav-link" to="/usersAdmin">
            <Icon icon="mdi:users" width="20" />
            <span>Home</span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="main-content">
      <div class="card table-container">
        <div class="loading-state" v-if="loading">
          <div class="spinner"></div>
          <p>Cargando eventos...</p>
        </div>

        <div class="error-state" v-else-if="error">
          <Icon icon="mdi:alert-circle" width="48" class="error-icon" />
          <h3>Error al cargar eventos</h3>
          <p class="error-message">{{ error }}</p>
          <button class="btn btn-secondary" @click="cargareventos">
            Reintentar
          </button>
        </div>

        <div v-else-if="eventos && eventos.length === 0" class="empty-state">
          <Icon icon="mdi:calendar-remove" width="48" />
          <h3>No hay eventos registrados</h3>
          <p>Comienza creando tu primer evento</p>
          <button class="btn btn-primary">
            <Icon icon="mdi:plus" width="18" />
            Crear Evento
          </button>
        </div>

        <div v-else class="table-responsive">
          <table class="events-table">
            <thead>
              <tr>
                <th class="text-left">Nombre</th>
                <th class="text-left">apellidos</th>
                <th class="text-center">Plazas Total</th>
                <th class="text-center">Disponibles</th>
                <th class="text-center">Inicio</th>
                <th class="text-center">Fin</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cada_usuario in usuarios">
                <td class="event-name">
                  <strong>{{ cada_evento.nombre }}</strong>
                </td>
                <td class="event-description">
                  {{ truncateText(cada_evento.descripcionEvento, 50) }}
                </td>
                <td class="text-center">
                  <span class="badge">{{ cada_evento.plazasTotales }}</span>
                </td>
                <td class="text-center">
                  <span 
                    :class="['badge', cada_evento.PlazasDisponibles]"
                  >
                    {{ cada_evento.PlazasDisponibles }}
                  </span>
                </td>
                <td class="text-center date-cell">
                  {{ cada_evento.fechaInicio}}
                </td>
                <td class="text-center date-cell">
                  {{ cada_evento.fechaFin }}
                </td>
                <td class="action-cell">
                  <div class="action-buttons">
                    <button 
                      class="btn-icon btn-edit" 
                      title="Editar evento"
                      @click="editarEvento(cada_evento.code_Evento)"
                    >
                      <Icon icon="mdi:pencil" width="18" />
                    </button>
                    <button 
                      class="btn-icon btn-delete" 
                      title="Eliminar evento"
                      @click="eliminarEvento(cada_evento.code_Evento)"
                    >
                      <Icon icon="mdi:trash-can-outline" width="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'EventosAdmin',
  
  components: {
    Icon
  },
  
  data() {
    return {
      user: null,
      loading: true,
      eventos: [],
      error: null,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10
    }
  },

  mounted() {
    this.cargarDatos()
    this.cargareventos()
  },

  methods: {
    cargarDatos() {
      setTimeout(() => {
        const usuarioDatos = localStorage.getItem('user')
        if (!usuarioDatos) {
          this.$router.push('/login')
        } else {
          try {
            this.user = JSON.parse(usuarioDatos)
          } catch (error) {
            console.error('Error parseando usuario:', error)
            this.$router.push('/login')
          }
        }
      }, 100)
    },

    async cargarusuarios() {
      
      try {
        const response = await window.electronAPI.getUsuarios()
        console.log("eventos evento sisis"+ response);
        
        if (response.success) {
          this.usuarios = response.usuarioss
          console.log(this.usuarios);
          
        } else {
          this.error = response.message
        }
      } catch (err) {
        console.error('Error Electron:', err)
        this.error = 'Error al conectar con el servidor'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

.eventos-container {
  height: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.admin-header {
  background: white;
  box-shadow: var(--shadow);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--gray-color);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: var(--primary-color);
}

.nav-link.active {
  background-color: var(--primary-color);
  color: white;
}

/* Main content */
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--dark-color);
  font-size: 1.75rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: white;
  color: rgb(0, 0, 0);
}

.btn-primary:hover {
  transform: translateY(-2px);
}


</style>