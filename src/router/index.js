import { createRouter, createWebHistory } from 'vue-router'
import { useDataStore } from '../stores/data';
import { useAuthStore } from '../stores/auth';
import IndexView from '../components/IndexView.vue';
import PatientsView from '../components/PatientsView.vue';
import CalendarView from '../components/CalendarView.vue';
import PatientForm from '../components/PatientForm.vue';
import PatientShow from '../components/PatientShow.vue';
import CallsView from '../components/CallsView.vue';
import CallForm from '../components/CallForm.vue';
import CallShow from '../components/CallShow.vue';
import LoginView from '../components/LoginView.vue';
import RegisterView from '../components/RegisterView.vue';
import AlertsView from '../components/AlertsView.vue';
import AlertShow from '../components/AlertShow.vue';




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
 
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/index',
      name: 'index',
      component: IndexView,
      meta: { requiresAuth: true } 
      
    },
    {
        path: '/patients',
        name: 'patients',
        component: PatientsView,
        meta: { requiresAuth: true } 
      },
      {
        path: '/calls',
        name: 'calls',
        component: CallsView,
        meta: { requiresAuth: true } 
      },
      {
        path: '/alerts',
        name: 'alerts',
        component: AlertsView,
        meta: { requiresAuth: true } 
      },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: { requiresAuth: true } 
    },
    {
      path: '/edit-patient/:id?',
      name: 'editPatient',
      component: PatientForm,
      props: true,
      meta: { requiresAuth: true } 
    },   
    {
      path: '/edit-call/:id?',
      name: 'editCall',
      component: CallForm,
      props: true,
      meta: { requiresAuth: true } 
    }, 
    {
      path: '/view-patient/:id',
      name: 'viewPatient',
      component: PatientShow,
      props: true,
      meta: { requiresAuth: true } 
    },
    {
      path: '/view-call/:id',
      name: 'viewCall',
      component: CallShow,
      props: true,
      meta: { requiresAuth: true } 
    },

    {
      path: '/view-alert/:id',
      name: 'viewAlert',
      component: AlertShow,
      props: true,
      meta: { requiresAuth: true } 
    },
    
  ],
})
router.beforeEach((to, from, next) => {
  const store = useDataStore(); // Accedemos al store para verificar la autenticación
  const auth = useAuthStore(); // Accedemos al store para verificar la autenticación

  // Si la ruta requiere autenticación y el usuario no está autenticado
  console.log(store);
  
  if (to.meta.requiresAuth && auth.token == "") {
    // Si no está autenticado, redirigir al login
    next({ name: 'login' }); 
  } else {
    // Si la ruta no requiere autenticación o el usuario está autenticado
    next();
  }
});
export default router