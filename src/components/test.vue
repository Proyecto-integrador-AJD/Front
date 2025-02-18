<template>
	<div>
		<!-- Select para tipos -->
		<select v-model="selectedType" @change="onTypeChange">
			<option value="" disabled>Selecciona un tipo</option>
			<option v-for="type in types" :key="type.name" :value="type">
				{{ type.spanishName }}
			</option>
		</select>

		<!-- Select para subtipos -->
		<select v-model="selectedSubtype" :disabled="!selectedType">
			<option value="" disabled>Selecciona un subtipo</option>
			<option v-for="subtype in filteredSubtypes" :key="subtype.id" :value="subtype">
				{{ subtype.spanishName }}
			</option>
		</select>
	</div>
</template>

<script>
export default {
	data() {
		return {
			types: [
				{
					"name": "Follow-up according to protocols",
					"spanishName": "Seguimiento según protocolos",
					"valencianName": "Seguiment segons protocols",
					"subtypes": [
						{
							"id": 4,
							"name": "After emergencies",
							"spanishName": "Después de emergencias",
							"valencianName": "Després d’emergències"
						},
						{
							"id": 5,
							"name": "For grief processes",
							"spanishName": "Por procesos de duelo",
							"valencianName": "Per processos de dol"
						},
						{
							"id": 6,
							"name": "For hospital discharges",
							"spanishName": "Por altas hospitalarias",
							"valencianName": "Per altes hospitalàries"
						},
						{
							"id": 13,
							"name": "After emergencies",
							"spanishName": "Después de emergencias",
							"valencianName": "Després d’emergències"
						},
						{
							"id": 14,
							"name": "For grief processes",
							"spanishName": "Por procesos de duelo",
							"valencianName": "Per processos de dol"
						},
						{
							"id": 15,
							"name": "For hospital discharges",
							"spanishName": "Por altas hospitalarias",
							"valencianName": "Per altes hospitalàries"
						}
					]
				},
				{
					"name": "Notice",
					"spanishName": "Aviso",
					"valencianName": "Aviso",
					"subtypes": [
						{
							"id": 1,
							"name": "medication",
							"spanishName": "medicación",
							"valencianName": "medicació"
						},
						{
							"id": 2,
							"name": "Specials",
							"spanishName": "Especiales",
							"valencianName": "Especials"
						},
						{
							"id": 3,
							"name": "per alert",
							"spanishName": "por alerta",
							"valencianName": "per alerta"
						}
					]
				}
			],
			selectedType: null, // Tipo seleccionado
			selectedSubtype: null, // Subtipo seleccionado
			preselectedType: { // Valor preseleccionado para el tipo
				name: "Follow-up according to protocols",
				spanishName: "Seguimiento según protocolos",
				valencianName: "Seguiment segons protocols",
				subtypes: [
					{
						"id": 7,
						"name": "Temporary service suspension",
						"spanishName": "Suspensión temporal del servicio",
						"valencianName": "Suspensió temporal del servei"
					},
					{
						"id": 8,
						"name": "Home absence",
						"spanishName": "Ausencia domiciliaria",
						"valencianName": "Ausència domiciliària"
					},
					{
						"id": 9,
						"name": "Returns or end of absence",
						"spanishName": "Retornos o fin de la ausencia",
						"valencianName": "Retorns o fi de l’absència"
					},
					{
						"id": 16,
						"name": "Temporary service suspension",
						"spanishName": "Suspensión temporal del servicio",
						"valencianName": "Suspensió temporal del servei"
					},
					{
						"id": 17,
						"name": "Home absence",
						"spanishName": "Ausencia domiciliaria",
						"valencianName": "Ausència domiciliària"
					},
					{
						"id": 18,
						"name": "Returns or end of absence",
						"spanishName": "Retornos o fin de la ausencia",
						"valencianName": "Retorns o fi de l’absència"
					}
				]
			},
			preselectedSubtype: { id: 4, name: "After emergencies" }, // Subtipo preseleccionado
		};
	},
	computed: {
		filteredSubtypes() {
			// Filtra los subtipos basados en el tipo seleccionado
			return this.selectedType ? this.selectedType.subtypes : [];
		}
	},
	methods: {
		onTypeChange() {
			this.selectedSubtype = null; // Resetea el subtipo cuando cambia el tipo
		}
	},
	watch: {
		preselectedType(newValue) {
			// Al cambiar el tipo preseleccionado, asignamos el tipo y el subtipo
			this.selectedType = this.types.find(type => type.name === newValue.name);
			this.selectedSubtype = this.selectedType.subtypes.find(subtype => subtype.id === this.preselectedSubtype.id);
		}
	},
	mounted() {
		// Asignamos los valores preseleccionados al cargar el componente
		this.selectedType = this.types.find(type => type.name === this.preselectedType.name);
		this.selectedSubtype = this.selectedType.subtypes.find(subtype => subtype.id === this.preselectedSubtype.id);
	}
};
</script>