<template>
  <div class="container">
    <h2 class="welcome-text">¡Bienvenido, {{ username }}!</h2>

    <!-- Calendario -->
    <div v-if="hayAlertas()" class="calendar-wrapper">
      <FullCalendar :options="calendarOptions" />
    </div>

    <div v-else class="calendar-wrapper">
      <h2>No hay alertas para hoy</h2>
    </div>

    <div class="patients-wrapper">
      <h2>Pacientes asignados</h2>
      <div class="list-patient">
        <div v-for="patient in patientsCurrent" :key="patient.id" >
            <button class="btn btn-info " @click="$router.push('/view-patient/' + patient.id)">
              {{ patient.name }} {{ patient.lastName }}
            </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalComponent v-model="isModalOpen">
      <template #default>
        <h2>Detalles del Día</h2>
        <p>Fecha seleccionada: {{ selectedEvent?.start }}</p>
        <ul>
          <li v-for="(event, index) in selectedEvent?.events" :key="index" :style="{ color: event.color }">
            <!-- Checkbox con su estado independiente -->
            <input type="checkbox" v-model="event.checked" @change="saveCheckboxState(event, selectedEvent.start)" />
            
            <!-- Enlace al formulario de edición al hacer clic en el nombre del paciente -->
            <router-link 
              :to="{ name: 'editCall', query: { alertId: event.alertId, patientId: event.patientId } }"
            >
              {{ event.title }} - {{ event.description }}
            </router-link><br />

            Teléfono: {{ event.phone }}
          </li>
        </ul>
       
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
import { useRouter } from 'vue-router';
import { storeToRefs } from "pinia";

export default {
  components: { FullCalendar, ModalComponent },
  setup() {
    const username = ref("");  // Variable para almacenar el nombre del usuario
    const dataStore = useDataStore();
    const router = useRouter();
    const { patientsCurrent, alertsCurrent } = storeToRefs(dataStore);

    const calendarOptions = ref({
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: "timeGridDay",
      scrollTime: new Date().getHours() + ':00:00', // Hace scroll a la hora actual
      editable: true,
      selectable: true,
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      events: [],
      eventClick: (info) => {
        selectedEvent.value = {
          start: info.event.startStr,
          events: (info.event.extendedProps.events || []).map((event) => ({
            title: event.title,
            description: event.description,
            phone: event.phone,
            color: event.color,
            alertId: event.alertId,
            patientId: event.patientId,
            checked: ref(loadCheckboxState(event.title, info.event.startStr)),
          })),
        };
        isModalOpen.value = true;
      },
    });

    const selectedEvent = ref(null);
    const isModalOpen = ref(false);

    const saveCheckboxState = (event, date) => {
      const key = `${event.title}-${date}`;
      localStorage.setItem(key, JSON.stringify(event.checked));
    };

    const loadCheckboxState = (title, date) => {
      const key = `${title}-${date}`;
      return JSON.parse(localStorage.getItem(key)) || false;
    };

    const hayAlertas = () => {
      const today = new Date();
      return (
        Array.isArray(alertsCurrent.value) &&
        alertsCurrent.value.some(alert => {
          const alertDate = new Date(alert.startDate);
          if (alert.recurrenceType === 'daily') {
            return true;
          }
          return (
            alertDate.getDate() === today.getDate() &&
            alertDate.getMonth() === today.getMonth() &&
            alertDate.getFullYear() === today.getFullYear()
          );
        })
      );
    };

    const loadEvents = () => {
      if (!alertsCurrent.value || !Array.isArray(alertsCurrent.value) || alertsCurrent.value.length === 0) {
        console.warn("No hay alertas disponibles aún.");
        return;
      }

      let allEvents = [];

      alertsCurrent.value.forEach((alert) => {
        let startDate = new Date(alert.startDate);
        let eventColor = alert.isRecurring ? "dodgerblue" : "limegreen";

        let patient = dataStore.getPatientFullNameById(alert.patientId);
        let patientPhone = dataStore.getPatientPhoneById(alert.patientId);

        const eventData = {
          start: startDate.toISOString(),
          title: `${patient} - ${alert.subType}`,
          description: alert.description,
          phone: patientPhone,
          color: eventColor,
          extendedProps: {
            events: [{
              title: `${patient} - ${alert.subType}`,
              description: alert.description,
              phone: patientPhone,
              color: eventColor,
              alertId: alert.id,
              patientId: alert.patientId,
              checked: ref(loadCheckboxState(`${patient} - ${alert.subType}`, startDate.toISOString())),
            }],
          },
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

    onMounted(async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      username.value = user ? user.name : "Usuario";
      if (!dataStore.isLoadData()) {
        await dataStore.loadInitialData(); 
      }
      await dataStore.loadAlertsCurrent();
      await dataStore.loadPatients();
      await dataStore.loadPatientsCurrentUser();
      loadEvents();
      calendarOptions.value.scrollTime = new Date().getHours() + ':00:00';
    });

    watchEffect(() => {
      loadEvents();
    });

    return { username, patientsCurrent, calendarOptions, isModalOpen, selectedEvent, saveCheckboxState, hayAlertas };
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
    .container {
    display: flex;
    flex-direction: column;
    overflow: visible; /* Permite que el contenido que se mueve hacia arriba sea visible */
    height: 100%;
  }

}

.calendar-wrapper {
  /* width: 50%;
  height: 80%; */
  text-align: center;
  background: #fcfcfc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid #66c2ff;
  /* position: relative; */
  /* top: 100px; */
  /* right: 0; */
}

.patients-wrapper {
  /* width: 45%;
  height: 80%; */
  text-align: center;
  background: #fcfcfc;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #66c2ff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  /* position: relative; */
  /* top: 496px; */
  /* left: 0; */
}

.welcome-text {
  font-size: 80px;
  font-weight: bold;
  color: #333;
  padding: 0;
  /* margin-top: 50px;
  margin-left: -300px; */
  display: block;
  text-align: center;
}

@media (max-width: 576px) {
  .welcome-text {
    font-size: 40px;
  }
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

.no-alerts {
  opacity: 0.4;
}

li {
  list-style: none;
}

.list-patient {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>