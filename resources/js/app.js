import { createApp } from 'vue';
import Usuarios from './components/Usuarios.vue';

import './bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
import 'bootstrap-icons/font/bootstrap-icons.css';

createApp(Usuarios).mount('#app');
