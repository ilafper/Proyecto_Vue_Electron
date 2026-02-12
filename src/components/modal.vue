 <!--vista del modal  -->
<template>
  <div v-if="mostrar" class="modal-overlay" @click="cerrarModal">
    <div class="modal-content" @click.stop>
      <!-- Cabecera DINÁMICA -->
      <div class="modal-header">
        <h3>{{ modo === 'crear' ? 'Crear Evento' : 'Editar Evento' }}</h3>
        <button class="close-btn" @click="cerrarModal">×</button>
      </div>
      
      <!-- Formulario DINÁMICO -->
      <form @submit.prevent="guardarEvento" class="eventos-form">
        <div class="input-group">
          <label>Nombre Evento</label>
          <input type="text" v-model="formData.nombreEvento" placeholder="Firma de Autógrafos" required />
        </div>

        <div class="input-group">
          <label>Descripción</label>
          <input type="textarea" v-model="formData.descripcionEvento" placeholder="Encuentro con artistas locales..." />
        </div>

        <div class="input-group">
          <label>Plazas Totales</label>
          <input type="number" v-model="formData.plazasTotales" required />
        </div>

        <div class="input-group">
          <label>Fecha</label>
          <input type="date" v-model="formData.fecha" required />
        </div>

        <div class="input-group">
          <label>Hora inicio</label>
          <input type="time" v-model="formData.horaInicio" required />
        </div>

        <div class="input-group">
          <label>Hora Fin</label>
          <input type="time" v-model="formData.horaFin" required />
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <!-- Boton DINÁMICO -->
        <button type="submit" :disabled="loading" class="btn-guardar">
            <!-- en funcion del modo o el boton que pulsemo cambia el texto del boton-->
          {{ loading ? 'Cargando...' : (modo === 'crear' ? 'Crear evento' : 'Actualizar evento') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalEvento',
    // lo que recibira del adminEventos.vue 
  props: {
    mostrar: Boolean,
    modo: {
      type: String,
      default: 'crear'
    },
    evento: {
      type: Object,
      default: null
    }
  },

  emits: ['update:mostrar', 'guardar'],

  data() {
    return {
      formData: {
        nombreEvento: '',
        descripcionEvento: '',
        plazasTotales: '',
        fecha: '',
        horaInicio: '',
        horaFin: ''
      },
      error: '',
      loading: false
    }
  },

  watch: {
    // Cuando se abre el modal con un evento (editar), cargar los datos
    evento: {
      handler(nuevoEvento) {
        if (nuevoEvento && this.modo === 'editar') {
          // Rellenar formulario con datos del evento a editar
          this.formData = {
            nombreEvento: nuevoEvento.nombreEvento || '',
            descripcionEvento: nuevoEvento.descripcionEvento || '',
            plazasTotales: nuevoEvento.plazasTotales || '',
            fecha: nuevoEvento.fecha || '',
            horaInicio: nuevoEvento.horaInicio || '',
            horaFin: nuevoEvento.horaFin || ''
          }
        }
      },
      immediate: true,
      deep: true
    },

    // Limpiar formulario al cerrar
    mostrar(nuevoValor) {
      if (!nuevoValor) {
        this.limpiarFormulario()
      }
    }
  },

  methods: {
    limpiarFormulario() {
      this.formData = {
        nombreEvento: '',
        descripcionEvento: '',
        plazasTotales: '',
        fecha: '',
        horaInicio: '',
        horaFin: ''
      }
      this.error = ''
    },

    cerrarModal() {
      this.$emit('update:mostrar', false)
    },

    async guardarEvento() {
      this.loading = true
      this.error = ''
      
      try {
        // Emitir los datos al padre
        this.$emit('guardar', { ...this.formData })
        this.cerrarModal()
      } catch (error) {
        this.error = 'Error al guardar el evento'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>



<style scoped>

.btn-guardar{
    margin-top: 10px;
    width: 100%;
    padding: 10px;
    background-color: #253444;
    border: none;
    color: white;
    font-weight: bold;
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

</style>
