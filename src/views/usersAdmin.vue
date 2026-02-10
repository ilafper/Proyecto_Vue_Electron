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
                        <span>Usuarios</span>
                    </RouterLink>
                </nav>
            </div>
        </header>

        <!-- Contenido principal -->
        <main class="main-content">
            <div class="card table-container">
                <div class="loading-state" v-if="loading">
                    <div class="spinner"></div>
                    <p>Cargando usuarios...</p>
                </div>

                <div class="error-state" v-else-if="error">
                    <Icon icon="mdi:alert-circle" width="48" class="error-icon" />
                    <h3>Error al cargar los usuarios</h3>
                    <p class="error-message">{{ error }}</p>
                </div>

                <div v-else-if="lista_sin_admin && lista_sin_admin.length === 0" class="empty-state">
                    <Icon icon="mdi:user-remove" width="48" />
                    <h3>No hay usuarios registrados</h3>

                </div>

                <div v-else class="table-responsive">
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th class="text-left">Nombre</th>
                                <th class="text-left">apellidos</th>
                                <th class="text-center">Correo</th>
                                <th class="text-center">Codigo</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="cada_usuario in lista_sin_admin">
                                <td class="event-name">
                                    <strong>{{ cada_usuario.nombre }}</strong>
                                </td>
                                <td class="event-description">
                                    {{ cada_usuario.apellidos }}
                                </td>
                                <td class="text-center">
                                    <span class="badge">{{ cada_usuario.correo }}</span>
                                </td>

                                <td class="text-center">
                                    <span class="badge">{{ cada_usuario.code_user }}</span>
                                </td>
                                <td class="action-cell">
                                    <div class="action-buttons">
                                        <button class="btn-icon btn-edit" title="Editar evento"
                                            @click="editarEvento(cada_usuario.code_user)">
                                            <Icon icon="mdi:pencil" width="18" />
                                        </button>
                                        <button class="btn-icon btn-delete" title="Eliminar evento"
                                            @click="eliminarEvento(cada_usuario.code_user)">
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
    data() {
        return {
            lista_sin_admin: [] // ← ¡DECLARADO AQUÍ! ESTO ES LO QUE FALTA
        }
    },
    mounted() {
        this.cargarDatos()
        this.cargarusuarios()
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
                console.log("usuarios sisis", response);

                if (response.success) {
                    this.usuarios = response.usuarios
                    console.log("lista usuarios", this.usuarios);
                    let tempo_list = [];

                    for (let cada_usuario of this.usuarios) {
                        if (cada_usuario.rol == "user") {
                            console.log("ssss", cada_usuario);

                            tempo_list.push(cada_usuario)
                        }

                        console.log("sfdfj");


                    }
                    this.lista_sin_admin = tempo_list;

                    console.log("lista sin admin", this.lista_sin_admin);

                    //console.log("asdasd",this.usuarios);

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