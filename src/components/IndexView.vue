<template>
  <div class="container">
    <!-- Calendario -->
    <div class="calendar-wrapper">
      <FullCalendar :options="calendarOptions" />
    </div>

    <!-- Modal -->
    <ModalComponent v-model="isModalOpen">
      <template #default>
        <h2>Detalles del Día</h2>
        <p>Fecha seleccionada: {{ selectedEvent?.start }}</p>
        <ul>
          <li v-for="(event, index) in selectedEvent?.events" :key="index" :style="{ color: event.color }">
            <input type="checkbox" v-model="event.checked" @change="saveCheckboxState(event)" />
            {{ event.title }} - {{ event.description }}<br />
            Teléfono: {{ event.phone }}
          </li>
        </ul>
        <button class="btn btn-primary" @click="$router.push('/edit-call')">
          Hacer llamada
        </button>
      </template>
    </ModalComponent>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDataStore } from "@/stores/data";
import ModalComponent from "@/components/Modal.vue";

export default {
  components: { FullCalendar, ModalComponent },
  setup() {
    const dataStore = useDataStore();

    const calendarOptions = ref({
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: "timeGridDay",
      editable: true,
      selectable: true,
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      events: [],
      eventClick: (info) => {
        selectedEvent.value = {
          start: info.event.startStr,
          events: [
            {
              title: info.event.title,
              description: info.event.extendedProps.description,
              phone: info.event.extendedProps.phone,
              color: info.event.backgroundColor,
              checked: loadCheckboxState(info.event.title), // Recuperar estado
            },
          ],
        };
        isModalOpen.value = true;
      },
    });

    const selectedEvent = ref(null);
    const isModalOpen = ref(false);

    const saveCheckboxState = (event) => {
      localStorage.setItem(event.title, JSON.stringify(event.checked));
    };

    const loadCheckboxState = (title) => {
      return JSON.parse(localStorage.getItem(title)) || false;
    };

    const loadEvents = () => {
      if (!dataStore.alerts || !Array.isArray(dataStore.alerts) || dataStore.alerts.length === 0) {
        console.warn("No hay alertas disponibles aún.");
        return;
      }

      let allEvents = [];

      dataStore.alerts.forEach((alert) => {
        let startDate = new Date(alert.startDate);
        let eventColor = alert.isRecurring ? "dodgerblue" : "limegreen";

        let patient = dataStore.getPatientNameById(alert.patientId);
        let patientPhone = dataStore.getPatientPhoneById(alert.patientId);

        const eventData = {
          start: startDate.toISOString(),
          title: `${patient} - ${alert.subType}`,
          description: alert.description,
          phone: patientPhone,
          color: eventColor,
          checked: loadCheckboxState(`${patient} - ${alert.subType}`), // Recuperar estado
        };

        if (alert.isRecurring) {
          let recurringDate = new Date(startDate);
          let interval = alert.recurrenceType === "daily" ? 1 : 7;
          let count = alert.recurrenceType === "daily" ? 50 : 10;

          for (let i = 0; i < count; i++) {
            allEvents.push({ ...eventData, start: recurringDate.toISOString() });
            recurringDate.setDate(recurringDate.getDate() + interval);
          }
        } else {
          allEvents.push(eventData);
        }
      });

      calendarOptions.value.events = allEvents;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    onMounted(async () => {
      await dataStore.loadAlerts();
      await dataStore.loadPatients();
      loadEvents();
    });

    watchEffect(() => {
      loadEvents();
    });

    return { calendarOptions, isModalOpen, selectedEvent, closeModal, saveCheckboxState };
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.calendar-wrapper {
  width: 50%;
  height: 80%;
  background: #fcfcfc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 100px;
  right: 0;
}

.fc {
  height: 80vh;
  max-height: 75vh;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

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









