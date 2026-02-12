 <!--vista del modal  -->
<template>
  <div v-if="mostrar" class="modal-overlay" @click="cerrarModal">
    <div class="modal-content" @click.stop>
      <!-- Cabecera DINÁMICA: Cambia según sea crear o editar -->
      <div class="modal-header">
        <h3>{{ modo === 'crear' ? 'Crear Evento' : 'Editar Evento' }}</h3>
        <button class="close-btn" @click="cerrarModal">×</button>
      </div>

      <form @submit.prevent="guardarEvento" class="eventos-form">
        <div class="input-group">
          <label>Nombre Evento</label>
          <input type="text" v-model="nombreEvento" placeholder="Firma de Autógrafos" required />
        </div>

        <div class="input-group">
          <label>Descripción</label>
          <input type="textarea" v-model="descripcionEvento" placeholder="Encuentro con artistas locales..." />
        </div>

        <div class="input-group">
          <label>Plazas Totales</label>
          <input type="number" v-model="plazasTotales" required />
        </div>
        
        <div class="input-group">
          <label>Fecha</label>
          <input type="date" v-model="fecha" required />
        </div>

        <div class="input-group">
          <label>Hora inicio</label>
          <input type="time" v-model="horaInicio" required />
        </div>

        <div class="input-group">
          <label>Hora Fin</label>
          <input type="time" v-model="horaFin" required />
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="crearEvento">
          {{ loading ? 'Cargando...' : (modo === 'crear' ? 'Crear evento' : 'Actualizar evento') }}
        </button>
      </form>
    </div>
  </div>
</template>






<script setup>
import { ref, watch } from 'vue'




// Props para recibir datos del padre
const props = defineProps({
  mostrar: Boolean,
  modo: { type: String, default: 'crear' }, // 'crear' o 'editar'
  evento: { type: Object, default: null } // null o datos del evento a editar
})

// 2. Emits para comunicar al padre
const emit = defineEmits(['update:mostrar', 'guardar'])

// 3. Datos del formulario (reactivos)
const nombreEvento = ref('')
const descripcionEvento = ref('')
const plazasTotales = ref('')
const fecha = ref('')
const horaInicio = ref('')
const horaFin = ref('')
const error = ref('')
const loading = ref(false)

// 4. Cargar datos si es edición
watch(() => props.evento, (nuevoEvento) => {
  if (nuevoEvento && props.modo === 'editar') {
    // Rellenar el formulario con los datos del evento a editar
    nombreEvento.value = nuevoEvento.nombre || ''
    descripcionEvento.value = nuevoEvento.descripcion || ''
    plazasTotales.value = nuevoEvento.plazas || ''
    fecha.value = nuevoEvento.fecha || ''
    horaInicio.value = nuevoEvento.horaInicio || ''
    horaFin.value = nuevoEvento.horaFin || ''
  }
}, { immediate: true })

// 5. Limpiar formulario al cerrar
watch(() => props.mostrar, (nuevoValor) => {
  if (!nuevoValor) {
    limpiarFormulario()
  }
})

// 6. Métodos
const limpiarFormulario = () => {
  nombreEvento.value = ''
  descripcionEvento.value = ''
  plazasTotales.value = ''
  fecha.value = ''
  horaInicio.value = ''
  horaFin.value = ''
  error.value = ''
}

const cerrarModal = () => {
  emit('update:mostrar', false)
}

const guardarEvento = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const datosEvento = {
      nombre: nombreEvento.value,
      descripcion: descripcionEvento.value,
      plazas: plazasTotales.value,
      fecha: fecha.value,
      horaInicio: horaInicio.value,
      horaFin: horaFin.value
    }
    
    // Emitir evento al padre con los datos
    emit('guardar', datosEvento)
    cerrarModal()
    
  } catch (e) {
    error.value = 'Error al guardar el evento'
  } finally {
    loading.value = false
  }
}
</script>