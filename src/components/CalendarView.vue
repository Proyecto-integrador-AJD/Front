<template>
  <div>
    <!-- Calendario -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modal -->
    <ModalComponent v-model="isModalOpen">
      <h2>Detalles del Día</h2>
      <p>Fecha seleccionada: {{ selectedDate }}</p>
      <ul>
        <li v-for="(event, index) in selectedEvents" :key="index" :style="{ color: event.color }">
          <!-- Enlace al formulario de edición al hacer clic en el nombre del paciente -->
          <router-link 
            :to="{ name: 'editCall', query: { alertId: event.alertId, patientId: event.patientId } }"
            style="color: inherit; text-decoration: underline;" 
          >
            {{ event.title }}
          </router-link>
          - {{ event.description }}<br />
          Teléfono: {{ event.phone }}
        </li>
      </ul>
      <button class="btn btn-primary" @click="$router.push('/edit-call')">
        Hacer llamada
      </button>
    </ModalComponent>
  </div>
</template>


<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDataStore } from '@/stores/data';
import { mapState } from 'pinia';
import { ref } from 'vue';
import ModalComponent from './Modal.vue';

export default {
  computed: {
    ...mapState(useDataStore, ['getPatientNameById', 'getPatientPhoneById', 'alertsCurrent', 'patients']),
  },
  components: {
    FullCalendar,
    ModalComponent
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        dateClick: (info) => this.handleDateClick(info),
        dayMaxEvents: 3,
        eventLimitText: "Ver más eventos",
      },
      isModalOpen: false,
      selectedDate: null,
      selectedEvents: [],
    };
  },

  async mounted() {
    const dataStore = useDataStore();
    await dataStore.loadAlertsCurrent();
    this.loadEvents(this.alertsCurrent);
    console.log("Alertas actuales cargadas:", this.alertsCurrent);
  },

  methods: {
    handleDateClick(info) {
      console.log("Clic en fecha:", info.dateStr);
      this.selectedDate = info.dateStr;
      this.selectedEvents = this.calendarOptions.events.filter(event => event.start === info.dateStr);
      this.isModalOpen = this.selectedEvents.length > 0;
    },

    loadEvents(alerts) {
      if (!alerts.length) return;
      let allEvents = [];
      alerts.forEach((alert) => {
        let startDate = new Date(alert.startDate);
        let eventColor = alert.isRecurring ? 'dodgerblue' : 'limegreen';
        let patient = this.getPatientNameById(alert.patientId);
        let patientPhone = this.getPatientPhoneById(alert.patientId);

        if (alert.isRecurring) {
          let recurringDate = new Date(startDate);
          if (alert.recurrenceType === 'daily') {
            for (let i = 0; i < 50; i++) {
              allEvents.push({
                start: recurringDate.toISOString().split('T')[0],
                title: `${patient} ${alert.subType}`,
                description: alert.description,
                phone: patientPhone,
                color: eventColor,
              });
              recurringDate.setDate(recurringDate.getDate() + 1);
            }
          } else if (alert.recurrenceType === 'weekly') {
            for (let i = 0; i < 10; i++) {
              allEvents.push({
                start: recurringDate.toISOString().split('T')[0],
                title: `${patient} ${alert.subType}`,
                description: alert.description,
                phone: patientPhone,
                color: eventColor,
              });
              recurringDate.setDate(recurringDate.getDate() + 7);
            }
          }
        } else {
          allEvents.push({
            start: startDate.toISOString().split('T')[0],
            title: `${patient} ${alert.subType}`,
            description: alert.description,
            phone: patientPhone,
            color: eventColor,
          });
        }
      });
      this.calendarOptions.events = allEvents;
    },
  },
};
</script>



<style scoped>
html,
body {
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
  height: 90vh;
  width: 80vw;
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

/* Estilo para el nuevo botón */
button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

li {
  list-style: none;
}
</style>
