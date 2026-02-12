<template>
    <div class="dashboard-container">
        <!-- Menú lateral -->
        <div class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
            <div class="sidebar-header">
                <h3 v-if="!sidebarCollapsed">Menu</h3>
                <button class="toggle-btn" @click="toggleSidebar">
                    {{ sidebarCollapsed ? '>' : '<' }} </button>
            </div>


            <nav class="sidebar-menu">
                <ul>
                    <li>
                        <router-link to="/home" class="menu-item">
                            <Icon icon="mdi:home-outline" width="28" />
                            <span v-if="!sidebarCollapsed" class="menu-text">Home</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/eventosUser" class="menu-item">
                            <Icon icon="mdi:calendar-text" width="28" />
                            <span v-if="!sidebarCollapsed" class="menu-text">Eventos</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/misEventos" class="menu-item">
                            <Icon icon="mdi:ticket-confirmation-outline" width="28" />
                            <span v-if="!sidebarCollapsed" class="menu-text">Mis Eventos</span>
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
                    <h1>Eventos Disponibles</h1>
                </div>
                <div class="header-right">
                    <button @click="salir" class="logout-button">
                        Salir
                    </button>
                </div>
            </header>

            <div class="content-wrapper">
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

                <h2>LISTA DE EVENTOS</h2>

                <div class="lista_eventos">
                    <div class="targeta_evento" v-for="cada_evento in eventos">
                        <!-- Información principal siempre visible -->
                        <div class="info-principal">
                            <h3>{{ cada_evento.nombreEvento }}</h3>
                            <p class="plazas">
                                <p>Disponibles <strong>{{ cada_evento.PlazasDisponibles }}</strong> de <strong>{{ cada_evento.plazasTotales }}</strong></p>
                            </p>

                            <p><strong>Estado:</strong> {{ cada_evento.estado }}</p>
                           
                        </div>

                        <!-- Boton informacion-->
                        <button @click="mostrarDetallesEvento(cada_evento)" class="btn-detalles">
                            <Icon 
                                :icon="mostrarDetalles[cada_evento.code_Evento] ? 'mdi:minus' : 'mdi:plus'" 
                                width="20"
                            />
                        </button>

                        <!-- Información adicional (oculta por defecto) -->
                        <div v-if="mostrarDetalles[cada_evento.code_Evento]" class="info-adicional">
                            <p><span class="etiqueta">Fecha:</span> {{ cada_evento.fecha }}</p>
                            <p><span class="etiqueta">Hora</span> {{ cada_evento.horaInicio }} de {{ cada_evento.horaFin }} </p>
                            <p class="descripcion-completa">{{ cada_evento.descripcionEvento }}</p>
                        </div>
                        <div>
                            <button @click="apuntarme(cada_evento)">Apuntarme</button>
                        </div>
                    </div>
                </div>


                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'eventosUser',

    data() {
        return {
            user: null,
            loading: true,
            sidebarCollapsed: false,
            mostrarDetalles: {}
        }
    },

    mounted() {
        this.cargarDatos()
        this.cargareventos()
    },
    methods: {
        mostrarDetallesEvento(cada_evento) {
            this.mostrarDetalles[cada_evento.code_Evento] = !this.mostrarDetalles[cada_evento.code_Evento]
            console.log("isissiis detalles");
        },

        cargarDatos() {
            console.log('Cargando datos del usuario...')

            setTimeout(() => {
                const usuarioDatos = localStorage.getItem('user')
                console.log('datos usuario suar:', usuarioDatos)

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


        //cargar evento user
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

        async apuntarme(cada_evento) {
            console.log("sisis reserva");
            console.log(cada_evento);
            console.log(this.user.code_user);
            
            const reserva_nueva={
                codigo_evento: cada_evento.code_Evento,
                nombre_evento:cada_evento.nombreEvento,
                fecha:cada_evento.fecha,
                code_usuario:this.user.code_user,
                horaInicio:cada_evento.horaInicio,
                horaFin:cada_evento.horaFin,
            }
            console.log(reserva_nueva);
            
            const enviar_reserva = await window.electronAPI.crearreserva(reserva_nueva)
            console.log("respues",enviar_reserva);
            this.cargareventos();

        }
    }
}
</script>

<style scoped>
.targeta_evento {
    position: relative;
    width: 250px;
    background: white;
    border-radius: 10px;
    padding: 10px;
    border-bottom: 5px solid #293A4B;
    border-right: 5px solid #293A4B;
    box-shadow: 7px 7px 5px rgba(117, 117, 117, 0.3);
}

.targeta_evento:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.info-principal h3 {
    margin-right:30px;
    color: #374b5f;
    font-size: 1.2rem;
    font-weight: 600;
}

.descripcion-corta {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 16px;
    line-height: 1.5;
}

.plazas {
    margin: 8px 0;
    color: #555;
}

.estado {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 8px;
}

.btn-detalles {
    position: absolute;
    top: 5px;
    left: 213px;
    color: black;
    border-radius: 50%;
    padding: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: white;
    transition: all 0.3s ease;
}

.info-adicional {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
}

.info-adicional p {
    margin: 8px 0;
    color: #555;
    font-size: 0.95rem;
}

.etiqueta {
    font-weight: 600;
    color: #2c3e50;
    min-width: 80px;
    display: inline-block;
}

.descripcion-completa {
    margin-top: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #333;
    line-height: 1.6;
}

.lista_eventos {
    border: 3px solid #cc0000;
    width: 100%;
    height: auto;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 20px;
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
    font-weight: bold;
    font-size: 15px;
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

.user-info-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
    overflow: hidden;
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