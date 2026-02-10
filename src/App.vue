<!-- App.vue - EL QUE MANEJA TODO -->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>



<script>
import Login from './views/loginView.vue'
import Home from './views/home.vue'

export default {
  components: { Login, Home },
  data() {
    return {
      usuarioLogueado: false
    }
  },

  methods: {
    iniciarSesion() {
      this.usuarioLogueado = true
    },
    cerrarSesion() {
      this.usuarioLogueado = false
    }
  }
}
</script>

