
require('./bootstrap');

import Vue from 'vue';
import VueRouter from 'vue-router';
import {routes} from './routes';
// npm i sweetalert2 // alerts
import Swal from 'sweetalert2'
import { Form, HasError, AlertError } from 'vform';
//npm i moment // parse time
import moment from 'moment';
// npm i vue-progressbar // 
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color: '#80ccff',
    failedColor: '#874b4b',
    thickness: '5px',
})
window.FireAjax = new Vue()
window.Form = Form;
window.Swal = Swal;
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
window.Toast = Toast
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes
});

Vue.filter('parsTime', (time) => {
    return moment(time).format('DD/MM/YY hh:mm')
})
Vue.filter('toUpper', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
})
Vue.filter('colorType', (text) => {
    switch (text) {
        case 'admin':
                return 'badge badge-pill badge-success';
            break;
        case 'author':
                return 'badge badge-pill badge-primary';
            break;
        case 'user':
                return 'badge badge-pill badge-secondary';
            break;
        default:
            return 'badge badge-pill badge-secondary';
      }
})
Vue.component('example-component', require('./components/ExampleComponent.vue').default);


const app = new Vue({
    el: '#app',
    router
});
