<template>
  <div>
    <!-- Calendario -->
    <FullCalendar ref="calendarRef" :options="calendarOptions" />

    <!-- Modal de eventos del día -->
    <ModalComponent v-model="isModalOpen">
      <h2>Detalles del Día</h2>
      <p>Fecha seleccionada: {{ selectedDate }}</p>
      <ul>
        <li v-for="(event, index) in selectedEvents" :key="index">
          <button class="btn btn-primary" :style="{ backgroundColor: event.color }" @click="debugger; handleAddCall(event?.alertId)">
            {{ event.title }}
          </button>
          <!-- <button class="btn btn-primary" :style="{ backgroundColor: event.color }" @click="handleEventClick(event)">
            {{ event.title }}
          </button> -->
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
        datesSet: () => this.loadEvents(this.alertsCurrent),
      },
      dateCalendar: null,
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
    this.getCurrentMonth();
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
    getCurrentMonth() {
      if (this.$refs.calendarRef) {
        const calendarApi = this.$refs.calendarRef.getApi();
        this.dateCalendar = calendarApi.getDate();
      }
    },

    loadEvents(alerts) {
      if (!alerts.length) return;
      let allEvents = [];
      alerts.forEach((alert) => {
        let startDate = new Date(alert.startDate);
        // let eventColor = alert.isRecurring ? 'dodgerblue' : 'limegreen';
        let eventColor = alert.isRecurring ? 'dodgerblue' : 'limegreen';
        let patientFullName = this.getPatientFullNameById(alert.patientId);
        let patient = this.getPatientById(alert.patientId);
        let patientPhone = patient.prefix + ' ' + patient.phone;

        if (alert.isRecurring) {
          // let recurringDate = new Date(startDate);
          // let recurrenceStep = alert.recurrenceType === 'daily' ? 1 : 7;
          // let iterations = alert.recurrenceType === 'daily' ? 50 : 10;

          // for (let i = 0; i < iterations; i++) {
          //   allEvents.push({
          //     start: recurringDate.toISOString().split('T')[0],
          //     alertId: alert.id,
          //     title: `${patientFullName} ${alert.subType || ''}`,
          //     description: alert.description,
          //     phone: patientPhone,
          //     color: eventColor,
          //   });
          //   recurringDate.setDate(recurringDate.getDate() + recurrenceStep);
          // }

          /*
          const alertCopy = { 
            start: currentDate.toISOString().slice(0, 19).replace('T', ' '),
            alertId: alert.id,
            title: `${patientFullName} ${alert.subType || ''}`,
            description: alert.description,
            phone: patientPhone,
            color: eventColor, 
          };
          */




          const getSpecificDay = (isNextMonth, year, month) => {
            const today = new Date(year, month - 1); // Ajustar el mes ya que los meses en JavaScript son 0-indexados
            let targetDate;

            if (isNextMonth) {
              // Avanzar un mes a la fecha proporcionada
              const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
              // Establecer la fecha al primer día del mes siguiente
              const firstDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
              // Avanzar hasta el domingo de la segunda semana del mes siguiente
              const dayOfWeek = firstDayOfNextMonth.getDay();
              targetDate = new Date(firstDayOfNextMonth);
              targetDate.setDate(firstDayOfNextMonth.getDate() + (14 - dayOfWeek) % 14);
            } else {
              // Restar un mes a la fecha proporcionada
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              // Establecer la fecha al último día del mes pasado
              const lastDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
              // Retroceder hasta el lunes de la penúltima semana del mes pasado
              const dayOfWeek = lastDayOfLastMonth.getDay();
              targetDate = new Date(lastDayOfLastMonth);
              targetDate.setDate(lastDayOfLastMonth.getDate() - ((dayOfWeek + 13) % 14));
            }

            return targetDate;
          }
          this.getCurrentMonth();
          const mes = this.dateCalendar.getMonth() + 1;
          const anio = this.dateCalendar.getFullYear();
          // Ejemplo de uso
          const recurringEvents = this.generateAlerts(getSpecificDay(false, anio, mes), getSpecificDay(true, anio, mes), alert, patientFullName, patientPhone, eventColor);
          console.log('recurringEvents', recurringEvents);
          recurringEvents.forEach((event) => {
            allEvents.push(event);
          });

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
    generateAlerts(startDate, endDate, alert, patientFullName, patientPhone, eventColor) {
      const alerts = [];
      if (!alert.isRecurring) return []; // Si no es recurrente, no generamos alertas

      const recurrenceType = alert.recurrenceType;
      const recurrenceCount = alert.recurrence;
      const alertStartDate = new Date(alert.startDate); // Fecha inicial de la alerta

      if (isNaN(alertStartDate.getTime()) || recurrenceCount <= 0) return []; // Validaciones básicas

      let intervalDays = 0;
      switch (recurrenceType) {
        case 'daily':
          intervalDays = 1;
          break;
        case 'weekly':
          intervalDays = 7;
          break;
        case 'monthly':
          intervalDays = 30; // Nota: Esto no maneja meses con diferente cantidad de días
          break;
        default:
          return []; // Si la recurrencia no es válida, no generamos alertas
      }

      // Calcular todas las fechas de recurrencia
      let currentDate = new Date(alertStartDate);
      for (let i = 0; i < recurrenceCount; i++) {
        if (currentDate >= startDate && currentDate <= endDate) {
          alerts.push({
            start: currentDate.toISOString().split('T')[0], // Formato 'YYYY-MM-DD HH:MM'
            alertId: alert.id,
            title: `${patientFullName} ${alert.subType || ''}`.trim(),
            description: alert.description,
            phone: patientPhone,
            color: eventColor,
          });
        }
        currentDate.setDate(currentDate.getDate() + intervalDays);
      }

      return alerts;
    }

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
