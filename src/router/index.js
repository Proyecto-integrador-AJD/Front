import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../components/IndexView.vue';
import PatientsView from '../components/PatientsView.vue';
import CalendarView from '../components/CalendarView.vue';
import PatientForm from '../components/PatientForm.vue';
import PatientShow from '../components/PatientShow.vue';
import CallsView from '../components/CallsView.vue';
import CallForm from '../components/CallForm.vue';
import CallShow from '../components/CallShow.vue';
import LoginView from '../components/LoginView.vue';





const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
 
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/index',
      name: 'index',
      component: IndexView,
      
    },
    {
        path: '/patients',
        name: 'patients',
        component: PatientsView,
      },
      {
        path: '/calls',
        name: 'calls',
        component: CallsView,
      },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
    {
      path: '/edit-patient/:id?',
      name: 'editPatient',
      component: PatientForm,
      props: true
    },   
    {
      path: '/edit-call/:id?',
      name: 'editCall',
      component: CallForm,
      props: true
    }, 
    {
      path: '/view-patient/:id',
      name: 'viewPatient',
      component: PatientShow,
      props: true
    },
    {
      path: '/view-call/:id',
      name: 'viewCall',
      component: CallShow,
      props: true
    },
    
  ],
})

export default router