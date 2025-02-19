<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit" class="form-datos">
      <fieldset>
        <legend>{{ title }}</legend>

        <div class="form-group">
          <label>Nombre:</label>
          <Field v-model="patient.name" name="nombrePacient" class="form-control" />
          <ErrorMessage class="error" name="nombrePacient" />
        </div>

        <div class="form-group">
          <label>Apellido:</label>
          <Field v-model="patient.lastName" name="apellido" class="form-control" />
          <ErrorMessage class="error" name="apellido" />
        </div>

        <div class="form-group">
          <label>Fecha de nacimiento:</label>
          <Field v-model="patient.birthDate" name="fecha" type="date" class="form-control" />
          <ErrorMessage class="error" name="fecha" />
        </div>

        <div class="form-group">
          <label>Dirección:</label>
          <div class="form-group-multiple">
            <div class="form-group">
              <Field v-model="patient.addressStreet" name="calle" type="text" class="form-control" placeholder="Calle" />
              <ErrorMessage class="error" name="calle" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressNumber" name="numero" type="text" class="form-control" placeholder="Número" />
              <ErrorMessage class="error" name="numero" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressFloor" name="piso" type="text" class="form-control" placeholder="Piso" />
              <ErrorMessage class="error" name="piso" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressDoor" name="puerta" type="text" class="form-control" placeholder="Puerta" />
              <ErrorMessage class="error" name="puerta" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressPostalCode" name="codigoPostal" type="text" class="form-control" placeholder="Código Postal" />
              <ErrorMessage class="error" name="codigoPostal" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressCity" name="ciudad" type="text" class="form-control" placeholder="Ciudad" />
              <ErrorMessage class="error" name="ciudad" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressProvince" name="provincia" type="text" class="form-control" placeholder="Provincia" />
              <ErrorMessage class="error" name="provincia" />
            </div>
            <div class="form-group">
              <Field v-model="patient.addressCountry" name="pais" type="text" class="form-control" placeholder="País" />
              <ErrorMessage class="error" name="pais" />
            </div>
          </div>
          <ErrorMessage class="error" name="direccion" />
        </div>

        <div class="form-group">
          <label>DNI:</label>
          <Field v-model="patient.dni" name="dni" class="form-control" />
          <ErrorMessage class="error" name="dni" />
        </div>

        <div class="form-group">
          <label>Número Sanitario:</label>
          <Field v-model="patient.healthCardNumber" name="sanitario" class="form-control" />
          <ErrorMessage class="error" name="sanitario" />
        </div>


        <div class="form-group">
          <label>Idioma:</label>
          <MultiSelect
            v-model="patient.language"
            :options="languages"
            optionLabel="spanishName"
            optionValue="name"
            display="chip"
            placeholder="Selecciona los idiomas"
            class="w-full md:w-20rem multi-select-container"
          >
            <template #optiongroup="slotProps">
              <div class="flex align-items-center">
                <img :alt="slotProps.option.spanishName" :src="slotProps.option.flag" class="mr-2" style="width: 20px" />
                <div>{{ slotProps.option.spanishName }}</div>
              </div>
            </template>
          </MultiSelect>
          <ErrorMessage class="error" name="idioma" />
        </div>

          <div class="form-group">
            <label>Teléfono:</label>
            <div class="phone-group form-group-multiple">
              <div>
                
                <Field as="select" v-model="patient.prefix" name="prefijo" class="form-control">
                  <option 
                    v-for="prefix in prefixes" 
                    :key="prefix.id" 
                    :value="prefix.prefix">
                    {{ prefix.country }}
                  </option>
                </Field>
                <ErrorMessage class="error" name="prefijo" />
              </div>

              <div>
                <Field 
                  v-model="patient.phone" 
                  name="telefono" 
                  type="number" 
                  class="form-control" 
                  placeholder="Teléfono" />
                <ErrorMessage class="error" name="telefono" />
              </div>
            </div>
          </div>


        <div class="form-group">
          <label>Correo:</label>
          <Field v-model="patient.email" name="correo" class="form-control" />
          <ErrorMessage class="error" name="correo" />
        </div>

        <div class="form-group">
            <label>Zona:</label>
            <Field as="select" v-model="patient.zoneId" name="zona" class="form-control">
            <option 
            v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
            </Field>
            <ErrorMessage class="error" name="zona" />
          </div>

        <div class="form-group">
          <label>Situación personal familiar:</label>
          <Field v-model="patient.situationPersonalFamily" name="situacionPersonal" class="form-control" />
          <ErrorMessage class="error" name="situacionPersonal" />
        </div>

        <div class="form-group">
          <label>Situación sanitaria:</label>
          <Field v-model="patient.healthSituation" name="situacionSanitaria" class="form-control" />
          <ErrorMessage class="error" name="situacionSanitaria" />
        </div>

        <div class="form-group">
          <label>Situacion de Alojamiento:</label>
          <div class="form-group-multiple"> 
            <div>
              <Field v-model="patient.housingSituationType" name="tipo" type="text" class="form-control" placeholder="Tipo" />
              <ErrorMessage class="error" name="tipo" />
            </div>
            <div>
              <Field v-model="patient.housingSituationStatus" name="estado" type="text" class="form-control" placeholder="Estado" />
              <ErrorMessage class="error" name="estado" />
            </div>
            <div>
              <Field v-model="patient.housingSituationNumberOfRooms" name="habitacion" type="number" class="form-control" placeholder="Habitación" />
              <ErrorMessage class="error" name="habitacion" />
            </div>
            <div>
              <Field v-model="patient.housingSituationLocation" name="localizacion" type="text" class="form-control" placeholder="Localización" />
              <ErrorMessage class="error" name="localizacion" />
            </div>
          </div> 
        </div>

        <div class="form-group">
          <label>Autonomía:</label>
          <Field v-model="patient.personalAutonomy" name="autonomia" class="form-control" />
          <ErrorMessage class="error" name="autonomia" />
        </div>

        <div class="form-group">
          <label>Situación económica:</label>
          <Field v-model="patient.economicSituation" name="situacionEconomica" class="form-control" />
          <ErrorMessage class="error" name="situacionEconomica" />
        </div>

        <div class="form-group" >
          <label>Contacto de emergencia:</label>
          <div class="form-group-multiple">
            <div v-for="(contact, index) in patient.emergencyContacts" :key="index" class="contact-card col-12">
              <div>
                <Field v-model="contact.name" :name="`emergencyContacts[${index}].nombre`" placeholder="Nombre" class="form-control" />
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].nombre`" />
              </div>
              <div>
                <Field v-model="contact.lastName" :name="`emergencyContacts[${index}].apellido`" placeholder="Apellido" class="form-control" />
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].apellido`" />
              </div>
              <div>
                <Field v-model="contact.email" :name="`emergencyContacts[${index}].email`" placeholder="Email" class="form-control" />
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].email`" />
              </div>
              <!-- <div>
                <Field v-model="contact.prefix" :name="`emergencyContacts[${index}].prefix`" placeholder="Prefijo" class="form-control" />
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].prefix`" />
              </div> -->
              <div class="form-group">
                <label>Prefijo:</label>
                <Field as="select" v-model="contact.prefix" :name="`emergencyContacts[${index}].prefix`" class="form-control">
                <option 
                v-for="prefix in prefixes" :key="prefix.prefix" :value="prefix.prefix">{{ prefix.country }}</option>
                </Field>
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].prefix`" />
              </div>
              <div>
                <Field v-model="contact.phone" :name="`emergencyContacts[${index}].telefono`" placeholder="Teléfono" class="form-control" />
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].telefono`" />
              </div>
              <!-- <div>
                <Field v-model="contact.relationship" :name="`emergencyContacts[${index}].relacion`" placeholder="Relación" class="form-control" />
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].relacion`" />
              </div> -->

              <div class="form-group">
                <label>Relacion:</label>
                <Field as="select" v-model="contact.relationship" :name="`emergencyContacts[${index}].relacion`" class="form-control">
                <option 
                v-for="relationship in relationships" :key="relationship.name" :value="relationship.name">{{ relationship.spanishName }}</option>
                </Field>
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].relacion`" />
              </div>
            </div>
            <div>
              <button type="button" class="btn btn-primary" @click="addContact">
                <i class="bi bi-plus-circle"></i>
              </button>
              <button v-if="patient.emergencyContacts && patient.emergencyContacts.length > 1" 
                      type="button" 
                      class="btn btn-primary" 
                      @click="delContact(index)">
                <i class="bi bi-dash-circle"></i>
              </button>
            </div>
          </div>
        </div><br>

        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-danger" @click="handleCancel">Cancelar</button>
      </fieldset>
    </Form>
  </div>
</template>

<script>
import { useDataStore } from '../stores/data';
import { mapState, mapActions } from 'pinia';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import MultiSelect from 'primevue/multiselect';
import axios from 'axios';




const API = import.meta.env.VITE_URL_API;

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    MultiSelect,
  },
  props: ['id'],
  async mounted() {
    await this.loadRelationships();
    await this.loadZones();
    await this.loadPrefixes();
    await this.loadLanguages();
  
    console.log('Idiomas cargados:', this.languages);

    if (this.id) {
      const response = await axios.get(API + '/patients/' + this.id);
      this.patient = response.data.data;
    }
  },
  computed: {
    ...mapState(useDataStore, ['zones', 'prefixes', 'languages', 'relationships']),
    title() {
      return this.id ? 'Editar paciente' : 'Añadir paciente';
    },
  },
  data() {
    return {
      mySchema: yup.object().shape({
        nombrePacient: yup.string().required('El nombre es obligatorio'),
        apellido: yup.string().required('El apellido es obligatorio'),
        fecha: yup
          .date()
          .typeError('La fecha debe ser válida en formato YYYY-MM-DD')
          .required('La fecha de nacimiento es obligatoria'),
        calle: yup.string().required('La calle es obligatoria'),
        numero: yup
          .number()
          .typeError('El número debe ser un número')
          .required('El número es obligatorio'),
        piso: yup.string().nullable(),
        puerta: yup.string().nullable(),
        codigoPostal: yup.string().required('El código postal es obligatorio'),
        ciudad: yup.string().required('La ciudad es obligatoria'),
        provincia: yup.string().required('La provincia es obligatoria'),
        pais: yup.string().required('El país es obligatorio'),
        dni: yup.string().required('El DNI es obligatorio'),
        sanitario: yup.string().required('El número sanitario es obligatorio'),
        prefijo: yup.string().required('El prefijo es obligatorio'),
        telefono: yup
          .number()
          .typeError('El teléfono debe ser un número')
          .required('El teléfono es obligatorio'),
        correo: yup.string().email('Correo inválido').required('El correo es obligatorio'),
        zona: yup.string().required('La zona es obligatoria'),
        situacionPersonal: yup.string().required('La situación personal familiar es obligatoria'),
        situacionSanitaria: yup.string().required('La situación sanitaria es obligatoria'),
        tipo: yup.string().required('El tipo es obligatorio'),
        estado: yup.string().required('El estado es obligatorio'),
        habitacion: yup.string().required('las habitaciones son obligatorias'),
        localizacion: yup.string().required('La localización es obligatoria'),
        autonomia: yup.string().required('La autonomía es obligatoria'),
        situacionEconomica: yup.string().required('La situación económica es obligatoria'),
        emergencyContacts: yup.array()
          .of(
            yup.object({
              nombre: yup.string().required('El nombre es obligatorio'),
              apellido: yup.string().required('El apellido es obligatorio'),
              email: yup.string().required('El email es obligatorio').email('debe ser un email valido'),
              prefix: yup.string().required('El prefijo es obligatorio'),
              telefono: yup
                .string()
                .matches(/^\d+$/, 'teléfono debe ser un número')
                .required('El teléfono es obligatorio'),
              relacion: yup.string().required('La relación es obligatoria')
            })
          )
          .min(1, 'Debe haber al menos un contacto de emergencia')
      }),
      languageOptions:[],
      patient: {
        name: '',
        birthDate: '',
        addressStreet: '',
        addressNumber: '',
        addressFloor: '',
        addressDoor: '',
        language:[],
        addressPostalCode: '',
        addressCity: '',
        addressProvince: '',
        addressCountry: '',
        dni: '',
        healthCardNumber: '',
        prefix: '',
        phone: '',
        email: '',
        zoneId: '',
        situationPersonalFamily: '',
        healthSituation: '',
        housingSituationType: '',
        housingSituationStatus: '',
        housingSituationNumberOfRooms: '',
        housingSituationLocation: '',
        personalAutonomy: '',
        economicSituation: '',
        emergencyContacts: [{ name: '', lastName: '', email:'', prefix: '', phone: '', relationship: '' }], 
      },
    };
  },
  methods: {
    ...mapActions(useDataStore, ['loadZones', 'loadPrefixes', 'loadLanguages', 'loadRelationships']),
    async handleSubmit() {
      try {
        if (this.id) {
          await axios.put(`${API}/patients/${this.id}`, this.patient).then(response=>{
            console.log(response);
            const idPatient=response.data.data.id;
            const contacts= this.patient.emergencyContacts;
            contacts.forEach(element => {

              element.patientId = idPatient;
              axios.put(`${API}/contacts/`, element)
            });

            this.$router.push('/patients');
            console.log(response);
             this.loadPatients();
          }).catch(error=>{
            console.error('error' + error);
          })

        } else {console.log(this.patient);
          await axios.post(`${API}/patients/`, this.patient).then(response=>{
            console.log(response);
            const idPatient=response.data.data.id;
            const contacts= this.patient.emergencyContacts;
            contacts.forEach(element => {

              element.patientId = idPatient;
              axios.post(`${API}/contacts/`, element)
            });

            this.$router.push('/patients');
            console.log(response);
             this.loadPatients();
          }).catch(error=>{
            console.error('error' + error);
          })

        }
      } catch (error) {
        alert('Error en la solicitud');
      }
    },
    handleCancel() {
      this.$router.push('/patients');
    },
    addContact() {
      this.patient.emergencyContacts.push({ name: '', lastName: '', prefix: '', phone: '', relationship: '' });
    },
    delContact() {
      if (this.patient.emergencyContacts.length > 1) {
        this.patient.emergencyContacts.pop();
      }
    }
  },
};
</script>