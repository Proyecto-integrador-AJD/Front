function generateAlerts(startDate, endDate, alert) {
    const alerts = [];
    const recurrenceType = alert.recurrenceType;
    let initialPoint = null;
    let intervalDays = 0;

    switch (recurrenceType) {
        case 'daily':
            intervalDays = 1;
            break;
        case 'weekly':
            intervalDays = 7;
            break;
        case 'monthly':
            intervalDays = 30;
            break;
    }

    const totalAlertDays = intervalDays * alert.recurrence;
    const alertStartDate = new Date(alert.startDate);
    let tempStartDate = new Date(alert.startDate);

    // Fecha de fin de la alerta
    const alertEndDate = new Date(tempStartDate.setDate(tempStartDate.getDate() + totalAlertDays));

    // Si la fecha de fin de la alerta es anterior a la fecha de inicio del rango, no hay alertas
    if (alertEndDate < startDate) {
        return [];
    }

    // Si la fecha de inicio de la alerta es posterior a la fecha de fin del rango, no hay alertas
    if (alertStartDate > endDate) {
        return [];
    }

    // Determinar el punto inicial de la alerta basado en el tipo de recurrencia
    if (recurrenceType === 'daily') {
        initialPoint = new Date(alert.startDate);
    } else if (recurrenceType === 'weekly') {
        const alertDayOfWeek = new Date(alert.startDate).getDay();

        for (let i = 0; i < 7; i++) {
            const currentDayOfWeek = new Date(startDate).getDay();
            if (currentDayOfWeek === alertDayOfWeek) {
                initialPoint = new Date(startDate);
                break;
            }
            startDate.setDate(startDate.getDate() + 1);
        }
    } else if (recurrenceType === 'monthly') {
        const alertDayOfMonth = new Date(alert.startDate).getDate();

        for (let i = 0; i < 30; i++) {
            const currentDayOfMonth = new Date(startDate).getDate();
            if (currentDayOfMonth === alertDayOfMonth) {
                initialPoint = new Date(startDate);
                break;
            }
            startDate.setDate(startDate.getDate() + 1);
        }
    }

    // Generar las alertas basadas en el punto inicial y el intervalo de días
    if (initialPoint) {
        let currentDate = new Date(initialPoint);
        while (currentDate >= startDate && currentDate <= alertEndDate && currentDate <= endDate) {
            const alertCopy = { ...alert };
            alertCopy.startDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
            alerts.push(alertCopy);
            currentDate.setDate(currentDate.getDate() + intervalDays);
        }
    }

    return alerts;
}

const startDate = new Date('2025-01-01');
const endDate = new Date('2025-02-10');
const alert = {
    "id": 2,
    "patientId": 5,
    "type": "Follow-up in application according to protocols",
    "subType": null,
    "description": "Autem fugit odio quae odit.",
    "startDate": "2025-01-05 23:36:03",
    "isRecurring": 1,
    "recurrenceType": "weekly",
    "recurrence": 6
}

console.log(generateAlerts(startDate, endDate, alert));