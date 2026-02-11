<template>
  <div class="eventos-container">
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
            <span>Usuarios</span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="main-content">
      <div class="content-header">
        <h2 class="page-title">
          <Icon icon="mdi:calendar-text" width="28" />
          Gestión de Eventos
        </h2>
        <div class="header-actions">
          <button @click="abrirModal" class="btn btn-primary">
            <Icon icon="mdi:plus" width="18" />
            Nuevo Evento
          </button>
        </div>
      </div>

      <!-- Tabla de eventos -->
      <div class="card table-container">
        <div class="loading-state" v-if="loading">
          <div class="spinner"></div>
          <p>Cargando eventos...</p>
        </div>

        <div v-else-if="eventos && eventos.length === 0" class="empty-state">
          <Icon icon="mdi:calendar-remove" width="48" />
          <h3>No hay eventos registrados</h3>
          <p>Comienza creando tu primer evento</p>
          <button @click="abrirModal" class="btn btn-primary">
            <Icon icon="mdi:plus" width="18" />
            Crear Evento
          </button>
        </div>

        <div v-else class="table-responsive">
          <table class="events-table">
            <thead>

              <tr>
                <th class="text-left">Nombre</th>
                <th class="text-left">Descripción</th>
                <th class="text-center">Plazas Total</th>
                <th class="text-center">Disponibles</th>
                <th class="text-center">Inicio</th>
                <th class="text-center">Fin</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cada_evento in eventos">
                <td class="event-name">
                  <strong>{{ cada_evento.nombreEvento }}</strong>
                </td>
                <td class="event-description">
                  {{ truncateText(cada_evento.descripcionEvento, 40) }}
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
                  {{ cada_evento.fechaInicio }}
                </td>
                <td class="text-center date-cell">
                  {{ cada_evento.fechaFin }}
                </td>

                <td class="action-cell">
                  <div class="action-buttons">
                    <button class="btn-icon btn-edit" title="Editar evento"
                      @click="editarEvento(cada_evento.code_Evento)">
                      <Icon icon="mdi:pencil" width="18" />
                    </button>
                    <button class="btn-icon btn-delete" title="Eliminar evento"
                      @click="eliminarEvento(cada_evento.code_Evento)">
                      <Icon icon="mdi:trash-can-outline" width="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer de la tabla -->
      <div class="table-footer" v-if="eventos && eventos.length > 0">
        <div class="footer-info">
          <p>Mostrando {{ eventos.length }} eventos</p>
        </div>
        <div class="pagination" v-if="totalPages > 1">
          <button class="btn-pagination" :disabled="currentPage === 1">
            <Icon icon="mdi:chevron-left" width="18" />
          </button>
          <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button class="btn-pagination" :disabled="currentPage === totalPages">
            <Icon icon="mdi:chevron-right" width="18" />
          </button>
        </div>
      </div>

    </main>
    <footer>
      asd
    </footer>

    <div v-if="modalVisible" class="modal-overlay" @click="cerrarModal">
      <div class="modal-content" @click.stop>
        <!-- Cabecera -->
        <div class="modal-header">
          <h3>Creacion eventos</h3>
          <button class="close-btn" @click="cerrarModal">×</button>
        </div>

        <form @submit.prevent="crearevento" class="eventos-form">

          <div class="input-group">
            <label>Nombre Evento</label>
            <input type="text" v-model="nombreEvento" placeholder="Firma de Autógrafos" required />
          </div>

          <div class="input-group">
            <label>Descripcion</label>
            <input type="textarea" v-model="descripcionEvento" placeholder="Encuentro con artistas locales..." />
          </div>

          <div class="input-group">
            <label>Plazas Totales</label>
            <input type="number" v-model="plazasTotales" required />
          </div>
          <div class="input-group">
            <label>fechaInicio</label>
            <input type="date" v-model="fechaInicio" required />
          </div>

          <div class="input-group">
            <label>fecha Fin</label>
            <input type="date" v-model="fechaFin" required />
          </div>

          <div v-if="error" class="error">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="crearEvento">
            {{ loading ? 'Cargando...' : 'Crear evento' }}
          </button>
        </form>
      </div>
    </div>
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
      error: null,
      currentPage: 1,
      eventos: [],
      modalVisible: false,
    }
  },

  mounted() {
    this.cargarDatos()

    this.cargareventos()

    this.crearevento()
  },

  methods: {
    abrirModal() {
      console.log("abriendo modal sisisi");

      this.modalVisible = true
    },

    cerrarModal() {
      this.modalVisible = false
      console.log("cerrando cerrando");

    },
    async crearevento() {

      console.log('Datos nuevo evento:', {
        nombreEvento: this.nombreEvento,
        descripcionEvento: this.descripcionEvento,
        plazasTotales: this.plazasTotales,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin
      })

      try {
        // Verificar Electron API
        if (!window.electronAPI) {
          throw new Error('Electron no está disponible')
        }

        // Llamar a Electron
        const resultado = await window.electronAPI.crearEvento(
          this.nombreEvento,
          this.descripcionEvento,
          this.plazasTotales,
          this.fechaInicio,
          this.fechaFin,
        )

        console.log('Resultado:', resultado)


      } catch (err) {
        console.error('Error:', err)
        this.error = 'Error de conexión con el servidor'
      } finally {
        this.loading = false
      }
    },


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

    async cargareventos() {

      try {
        const response = await window.electronAPI.getEventos()
        //console.log("eventos evento sisis", response);

        if (response.success) {
          this.eventos = response.eventos.eventosFormateados
          console.log(this.eventos);

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

    editarEvento(codigo) {
      console.log('Editar evento:', codigo)

    },

    eliminarEvento(codigo) {
      if (confirm('¿Estás seguro de eliminar este evento?')) {
        console.log('Eliminar evento:', codigo)
      }
    },

    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text
    }
  }
}
</script>

<style scoped>
.crearEvento {
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  border: none;
  padding: 10px;
  color: white;
  background-color: rgba(117, 50, 117, 0.658);
}

.close-btn {
  border: none;
  background: none;
  position: relative;
  left: 430px;
  top: -40px;
  font-size: 40px;
  cursor: pointer;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.input-group input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
}

.input-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  padding: 30px;
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

body {
  height: auto;
}

.eventos-container {
  height: 100%;
  background: rgb(148, 148, 182);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.admin-header {
  background: white;
  padding: 1rem 2rem;
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

.btn-secondary {
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background-color: #f8f9fa;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  color: var(--primary-color);
}

.btn-edit:hover {
  background-color: rgba(67, 97, 238, 0.1);
}

.btn-delete {
  color: var(--danger-color);
}

.btn-delete:hover {
  background-color: rgba(247, 37, 133, 0.1);
}

.btn-view {
  color: var(--gray-color);
}

.btn-view:hover {
  background-color: rgba(108, 117, 125, 0.1);
}

/* Card and table container */
.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.table-responsive {
  overflow-x: auto;
}

/* Table styles */
.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table thead {
  background-color: #f8f9fa;
}

.events-table th {
  padding: 1rem;
  color: var(--dark-color);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border-color);
}

.events-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.events-table tbody tr {
  transition: background-color 0.3s ease;
}

.events-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-success {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--success-color);
}

.badge-warning {
  background-color: rgba(248, 150, 30, 0.1);
  color: var(--warning-color);
}

.badge-danger {
  background-color: rgba(247, 37, 133, 0.1);
  color: var(--danger-color);
}

/* States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--gray-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  text-align: center;
  padding: 3rem;
  color: var(--danger-color);
}

.error-icon {
  margin-bottom: 1rem;
}

.error-message {
  color: var(--gray-color);
  margin: 1rem 0;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--gray-color);
}

.empty-state h3 {
  margin: 1rem 0 0.5rem;
  color: var(--dark-color);
}

/* Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.footer-info {
  color: var(--gray-color);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-pagination {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: var(--primary-color);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--gray-color);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .content-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .events-table th,
  .events-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .table-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Text utilities */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* Date cells */
.date-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--gray-color);
}

/* Event name */
.event-name {
  font-weight: 600;
  color: var(--dark-color);
}

/* Event description */
.event-description {
  max-width: 300px;
  line-height: 1.5;
  color: var(--gray-color);
}
</style>