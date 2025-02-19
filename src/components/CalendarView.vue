<template>
  <div>
    <!-- Calendario -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modal de eventos del día -->
    <ModalComponent v-model="isModalOpen">
      <h2>Detalles del Día</h2>
      <p>Fecha seleccionada: {{ selectedDate }}</p>
      <ul>
        <li v-for="(event, index) in selectedEvents" :key="index">
          <button class="btn btn-primary" :style="{ backgroundColor: event.color }" @click="handleEventClick(event)">
            {{ event.title }}
          </button>
          - {{ event.description }}<br />
          Teléfono: {{ event.phone }}
        </li>
      </ul>
    </ModalComponent>

    <!-- Modal de detalles de un evento individual -->
     
    <ModalComponent v-model="isEventModalOpen">
      <h2>Detalles de alerta</h2>
      <ul>
        <li>
          <button :style="{ backgroundColor: selectedEvent.color }" @click="handleAddCall(selectedEvent?.alertId)">
            {{ selectedEvent.title }}
          </button>
          - {{ selectedEvent.description }}<br />
          Teléfono: {{ selectedEvent.phone }}
        </li>
      </ul>
    </ModalComponent>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDataStore } from '@/stores/data';
import { mapState } from 'pinia';
import ModalComponent from './Modal.vue';

export default {
  computed: {
    ...mapState(useDataStore, ['getPatientFullNameById', 'loadAlerts', 'alertsCurrent', 'getPatientById', 'alerts', 'patients']),
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
        eventClick: (info) => this.handleEventClick(info.event),
        dayMaxEvents: 3,
        eventLimitText: "Ver más eventos",
      },
      isModalOpen: false,
      isEventModalOpen: false,
      selectedDate: null,
      selectedEvents: [],
      selectedEvent: null,
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

    handleEventClick(event) {
      console.log("Evento clickeado:", event);
      this.selectedEvent = {
        title: event.title,
        description: event.extendedProps?.description || "",
        phone: event.extendedProps?.phone || "No disponible",
        color: event.backgroundColor || "black",
        alertId: event.extendedProps?.alertId || null,
      };
      this.isEventModalOpen = true;
    },

    loadEvents(alerts) {
      if (!alerts.length) return;
      let allEvents = [];
      alerts.forEach((alert) => {
        let startDate = new Date(alert.startDate);
        let eventColor = alert.isRecurring ? 'dodgerblue' : 'limegreen';
        let patientFullName = this.getPatientFullNameById(alert.patientId);
        let patient = this.getPatientById(alert.patientId);
        let patientPhone = patient.prefix + ' ' + patient.phone;

        if (alert.isRecurring) {
          let recurringDate = new Date(startDate);
          let recurrenceStep = alert.recurrenceType === 'daily' ? 1 : 7;
          let iterations = alert.recurrenceType === 'daily' ? 50 : 10;

          for (let i = 0; i < iterations; i++) {
            allEvents.push({
              start: recurringDate.toISOString().split('T')[0],
              alertId: alert.id,
                title: `${patientFullName} ${alert.subType || ''}`,
              description: alert.description,
              phone: patientPhone,
              color: eventColor,
            });
            recurringDate.setDate(recurringDate.getDate() + recurrenceStep);
          }
        } else {
          allEvents.push({
            start: startDate.toISOString().split('T')[0],
            alertId: alert.id,
            title: `${patientFullName} ${alert.subType || ''}`,
            description: alert.description,
            phone: patientPhone,
            color: eventColor,
          });
        }
      });
      this.calendarOptions.events = allEvents;
    },

    handleAddCall(alertId) {
      if (!alertId) return;
      this.$router.push({
        name: 'addCall',
        query: { alertId: alertId }
      });
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

.fc {
  height: 90vh;
  width: 80vw;
}

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
