import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../components/IndexView.vue';
import PatientsView from '../components/PatientsView.vue';
import CalendarView from '../components/CalendarView.vue';
import PatientForm from '../components/PatientForm.vue';
import PatientShow from '../components/PatientShow.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
        path: '/patients',
        name: 'patients',
        component: PatientsView,
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
    },   {
      path: '/view-patient/:id',
      name: 'viewPatient',
      component: PatientShow,
      props: true
    },
    
  ],
})

export default router