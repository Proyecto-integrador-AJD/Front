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
          {{ event.title }} - {{ event.description }}<br />
          Teléfono: {{ event.phone }}
        </li>
      </ul>
      <!-- Nuevo botón arriba del botón de cerrar -->
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
    ...mapState(useDataStore, ['getPatientNameById', 'getPatientPhoneById']),
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
      },
      isModalOpen: false, // Controla si el modal está abierto o cerrado
      selectedDate: null, // Guarda la fecha clickeada
      selectedEvents: [], // Guarda los eventos de la fecha clickeada
    };
  },

  async mounted() {
    const dataStore = useDataStore();
    await dataStore.loadAlerts();
    await dataStore.loadPatients();
    this.loadEvents(dataStore.alerts);
  },

  methods: {
    handleDateClick(info) {
      console.log("Clic en fecha:", info.dateStr);
      this.selectedDate = info.dateStr;

      this.selectedEvents = this.calendarOptions.events.filter(
        event => event.start === info.dateStr
      );

      if (this.selectedEvents.length > 0) {
        console.log("Abriendo modal con eventos:", this.selectedEvents);
        this.isModalOpen = true;
      } else {
        console.log("No hay eventos para esta fecha.");
      }
    },
    loadEvents(alerts) {
      if (!alerts.length) return;

      let allEvents = [];

      alerts.forEach((alert) => {
        let startDate = new Date(alert.startDate);
        let eventColor = alert.isRecurring ? 'dodgerblue' : 'limegreen';

        let patient = this.getPatientNameById(alert.patientId);  // Usa el getter para obtener el nombre
        let patientPhone = this.getPatientPhoneById(alert.patientId); // Usa el getter para obtener el teléfono

        if (alert.isRecurring) {
          let recurringDate = new Date(startDate);
          if (alert.recurrenceType === 'daily') {
            for (let i = 0; i < 50; i++) {
              allEvents.push({
                start: recurringDate.toISOString().split('T')[0],
                title: `${patient} ${alert.subType}`,
                description: alert.description,
                phone: patientPhone, // Añadimos el teléfono
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
                phone: patientPhone, // Añadimos el teléfono
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
            phone: patientPhone, // Añadimos el teléfono
            color: eventColor,
          });
        }
      });

      this.calendarOptions.events = allEvents;
    },

    // Método para manejar la acción del nuevo botón
    handleNewButtonClick() {
      console.log("¡Nuevo botón clickeado!");
      // Aquí puedes agregar la acción que quieras realizar cuando se haga clic en el nuevo botón.
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

/* Asegura que el modal esté visible y bien centrado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Asegura que esté por encima de todo */
}

/* Diseño del modal más grande */
.modal {
  background: #ffffff;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  width: 600px;
  height: 500px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


/* Asegura que el modal no esté oculto */
.modal-overlay,
.modal {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  flex-direction: column;
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
</style>
