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
import axios from 'axios';

export default {
	data() {
		return {
			types: [],
			selectedType: null, // Tipo seleccionado
			selectedSubtype: null, // Subtipo seleccionado
			preselectedType: {}, // Tipo preseleccionado
			preselectedSubtype: {}, // Subtipo preseleccionado
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
	async mounted() {
		// Asignamos los valores preseleccionados al cargar el componente
		this.types = await axios.get('http://localhost/api/alert/types').then(response => response.data.data);
		this.preselectedType = this.types.find(type => type.name === "Follow-up according to protocols");
		this.preselectedSubtype = this.preselectedType.subtypes.find(subtype => subtype.id === 5);
		this.selectedType = this.types.find(type => type.name === this.preselectedType.name);
		this.selectedType.selectedSubtype = this.preselectedType.preselectedSubtype;
	}
};
</script>