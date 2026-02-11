<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="login-title">Iniciar Sesión</h2>

            <form @submit.prevent="comprobarLogin" class="login-form">
                <div class="input-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        v-model="email" 
                        placeholder="ejemplo@email.com" 
                        required 
                        :disabled="loading" 
                    />
                </div>

                <div class="input-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        v-model="password" 
                        placeholder="••••••••" 
                        required 
                        :disabled="loading" 
                    />
                </div>

                <div v-if="error" class="error">
                    {{ error }}
                </div>

                <button type="submit" :disabled="loading" class="loginBoton">
                    {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
                </button>
            </form>
        
            <h3>¿No tienes cuenta? <RouterLink to="/register">Registrate</RouterLink></h3>
        </div>
    </div>
</template>


<script>
export default {
    
    methods: {
        async comprobarLogin() {
            // Resetear estados
            this.error = ''
            this.loading = true
            
            console.log('Datos:', {
                email: this.email,
                password: this.password
            })

            try {
                // Verificar Electron API
                if (!window.electronAPI) {
                    throw new Error('Electron no está disponible')
                }
                
                // Llamar a Electron
                const resultado = await window.electronAPI.login(
                    this.email,
                    this.password
                )
                
                console.log('Resultado:', resultado)

                if (resultado.success) {
                    console.log('Login exitoso')
                    
                    // Guardar usuario en localStorage
                    localStorage.setItem('user', JSON.stringify(resultado.user))
                    console.log('Usuario guardado en localStorage')
                    
                    // Redirigir según rol
                    const rol = resultado.user.rol.toLowerCase()
                    console.log('Rol del usuario:', rol)
                    
                    if (rol === 'user') {
                        console.log('Redirigiendo a /home')
                        this.$router.push('/home')
                    } else if (rol === 'admin') {
                        console.log('Redirigiendo a /admin')
                        this.$router.push('/admin')
                    } else {
                        this.error = "Rol no reconocido: " + rol
                    }
                    
                } else {
                    this.error = resultado.message || 'Credenciales incorrectas'
                }

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
}
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #f5f5f5;
}

.login-card {
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 24px;
}

.login-form {
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

.loginBoton {
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

.loginBoton:hover:not(:disabled) {
    background-color: #0056b3;
}

.loginBoton:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>