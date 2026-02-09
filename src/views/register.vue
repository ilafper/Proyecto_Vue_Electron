<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">Registrarse</h2>

      <form @submit.prevent="comprobarRegistro" class="register-form">
        <h2>Crear Cuenta</h2>

        <div class="input-group">

          <label for="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            v-model="nombre"
            placeholder="Juan"
            required
            :disabled="loading"
          />
        </div>

        <div class="input-group">
          <label for="apellidos">Apellidos</label>
          <input
            id="apellidos"
            type="text"
            v-model="apellidos"
            placeholder="costas martinez"
            required
            :disabled="loading"
          />
        </div>

        <div class="input-group">
          <label for="correo">Correo Electrónico</label>
          <input
            id="correo"
            type="email"
            v-model="correo"
            placeholder="juan@email.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="contraseña"
            type="password"
            v-model="contraseña"
            placeholder="••••••••"
            required
            :disabled="loading"
          />
        </div>

        <div class="input-group">
          <label for="password2">Confirmar Contraseña</label>
          <input
            id="password2"
            type="password"
            v-model="contraseña2"
            placeholder="••••••••"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="registerBoton">
            Registrarse
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
        async comprobarRegistro() {
            
            console.log('Datos registro:', {
                nombre: this.nombre,
                apellidos: this.apellidos,
                correo: this.correo,
                contraseña: this.contraseña,
                contraseña2: this.contraseña2
            })

            try {
                // Verificar Electron API
                if (!window.electronAPI) {
                    throw new Error('Electron no está disponible')
                }
                
                // Llamar a Electron
                const resultado = await window.electronAPI.registro(
                    this.nombre,
                    this.apellidos,
                    this.correo,
                    this.contraseña,
                    this.contraseña2,
                )
                
                console.log('Resultado:', resultado)

                this.$router.push('/login')

            } catch (err) {
                console.error('Error:', err)
                this.error = 'Error de conexión con el servidor'
            } finally {
                this.loading = false
            }
        }
    },
    
    // Para debugging
    mounted() {
        console.log('LoginView montado')
        console.log('Router disponible?', !!this.$router)
    }
};
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.registerBoton {
  padding: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.registerBoton:hover:not(:disabled) {
  background-color: #0056b3;
}

.registerBoton:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
