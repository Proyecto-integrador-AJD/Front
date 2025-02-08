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
          start: info.event.startStr, // Guardar la fecha y hora de inicio
          events: [
            {
              title: info.event.title, // El nombre del paciente ya está en el título
              description: info.event.extendedProps.description,
              phone: info.event.extendedProps.phone,
              color: info.event.backgroundColor, // Asumiendo que se pasa un color
            },
          ],
        };
        isModalOpen.value = true; // Abrir el modal
      },
    });

    const selectedEvent = ref(null); // Para almacenar el evento seleccionado
    const isModalOpen = ref(false);  // Controla la visibilidad del modal

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

        if (alert.isRecurring) {
          let recurringDate = new Date(startDate);
          if (alert.recurrenceType === "daily") {
            for (let i = 0; i < 50; i++) {
              allEvents.push({
                start: recurringDate.toISOString(),
                title: `${patient} - ${alert.subType}`,
                description: alert.description,
                phone: patientPhone,
                color: eventColor,
              });
              recurringDate.setDate(recurringDate.getDate() + 1);
            }
          } else if (alert.recurrenceType === "weekly") {
            for (let i = 0; i < 10; i++) {
              allEvents.push({
                start: recurringDate.toISOString(),
                title: `${patient} - ${alert.subType}`,
                description: alert.description,
                phone: patientPhone,
                color: eventColor,
              });
              recurringDate.setDate(recurringDate.getDate() + 7);
            }
          }
        } else {
          allEvents.push({
            start: startDate.toISOString(),
            title: `${patient} - ${alert.subType}`,
            description: alert.description,
            phone: patientPhone,
            color: eventColor,
          });
        }
      });

      calendarOptions.value.events = allEvents;
    };

    const closeModal = () => {
      isModalOpen.value = false; // Cierra el modal
    };

    onMounted(async () => {
      await dataStore.loadAlerts();
      await dataStore.loadPatients();
      loadEvents();
    });

    watchEffect(() => {
      loadEvents();
    });

    return { calendarOptions, isModalOpen, selectedEvent, closeModal };
  },
};
</script>

<style scoped>
/* Estilos generales para el calendario */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* Contenedor principal */
.container {
  display: flex;
  justify-content: flex-end; /* Asegura que el calendario esté alineado a la derecha */
  align-items: flex-start; /* Asegura que el calendario esté alineado en la parte superior */
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.calendar-wrapper {
  width: 50%; /* Calendario ocupa el 50% de la pantalla */
  height: 80%; /* Ajustamos la altura del calendario al 80% de la pantalla */
  background: #fcfcfc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  position: fixed; /* Lo fija a la derecha */
  top: 100px; /* Lo mueve hacia abajo 100px */
  right: 0; /* Alinea el calendario al borde derecho */
}
.fc {
  height: 80vh;  /* Ajusta la altura del calendario (70% de la ventana) */
  max-height: 75vh; /* Limita la altura máxima del calendario */
}

/* Modal */
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





