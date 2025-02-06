<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useDataStore } from '@/stores/data' 
import { mapState, mapActions } from 'pinia';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  computed: {
      ...mapState(useDataStore, ['getPatientNameById']),
    },
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: []
      }
    }
  },
  

  async mounted() {
    const dataStore = useDataStore(); 
    await dataStore.loadAlerts(); 
    await dataStore.loadPatients();
    this.loadEvents(dataStore.alerts); 
   
    
  },
  methods: {
  loadEvents(alerts) {
    if (!alerts.length) return;

    let allEvents = [];

    // Iteramos sobre cada alerta
    alerts.forEach(alert => {
      let startDate = new Date(alert.startDate);
      
      if (alert.isRecurring) {
        // Si la alerta es recurrente, calculamos las fechas
        let recurringDate = new Date(startDate);

        // Si la recurrencia es diaria, añadimos el evento para cada día
        if (alert.recurrenceType === 'daily') {
          // Agregamos eventos por 30 días, puedes cambiar el número si lo necesitas
          for (let i = 0; i < 50; i++) {
            let title= `${this.getPatientNameById(alert.patientId)} ${alert.subType}`
            
            allEvents.push({
              start: recurringDate.toISOString().split("T")[0], // Fecha solo (sin hora)
              title:title,
             
            });

            // Avanzamos 1 día para el siguiente evento
            recurringDate.setDate(recurringDate.getDate() + 1);
          }
        } else if (alert.recurrenceType === 'weekly') {
          // Si la recurrencia es semanal, la lógica ya está funcionando como antes
          for (let i = 0; i < 10; i++) {
            allEvents.push({
              start: recurringDate.toISOString().split("T")[0], // Fecha solo (sin hora)
              title: `${this.getPatientNameById(alert.patientId)} ${alert.subType}`,
             
            });

            // Avanzamos 1 semana
            recurringDate.setDate(recurringDate.getDate() + 7);
          }
        }
     
      } else {
        // Si no es recurrente, solo agregamos el evento en la fecha de inicio
        allEvents.push({
          start: startDate.toISOString().split("T")[0], // Fecha solo (sin hora)
          title: `${this.getPatientNameById(alert.patientId)} ${alert.subType}`,
           color:"black"
        });
      }

    });

    // Asignamos los eventos al calendario
    this.calendarOptions.events = allEvents;
  }
},
watch: {
    // Observar cambios en la ruta actual
    async '$route.path'() {
      const dataStore = useDataStore(); 
    await dataStore.loadAlerts(); 
    this.loadEvents(dataStore.alerts); 
    await dataStore.loadPatients();
    }
  }
}

</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>


<style scoped>

html, body {
  margin: 0;
  padding: 0;
  height: 90%;
  width: 90%;
  display: flex;
  flex-direction: column;
}

#app {
  height: 90%;
  display: flex;
  flex-direction: column;
}

.calendar-container {
  flex: 1; 
  width: 10%; 
}


.fc {
  height: 90vh ;
  width: 80vw ; 
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}
</style>
