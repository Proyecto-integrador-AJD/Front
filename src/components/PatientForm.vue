<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit" class="form-datos">
      <fieldset class="grid-form">
        <legend class="title">{{ title }}</legend>

        <div class="form-group nombre">
          <label>Nombre:</label>
          <Field v-model="patient.name" name="nombrePacient" class="form-control" />
          <ErrorMessage class="error" name="nombrePacient" />
        </div>

        <div class="form-group apellido">
          <label>Apellido:</label>
          <Field v-model="patient.lastName" name="apellido" class="form-control" />
          <ErrorMessage class="error" name="apellido" />
        </div>

        <div class="form-group fecha">
          <label>Fecha de nacimiento:</label>
          <Field v-model="patient.birthDate" name="fecha" type="date" class="form-control" />
          <ErrorMessage class="error" name="fecha" />
        </div>

        <div class="form-group calle">
          <label>Dirección:</label>
          <div class="form-group-multiple little-margin row">
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressStreet" name="calle" type="text" class="form-control" placeholder="Calle" />
              <ErrorMessage class="error" name="calle" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressNumber" name="numero" type="text" class="form-control" placeholder="Número" />
              <ErrorMessage class="error" name="numero" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressFloor" name="piso" type="text" class="form-control" placeholder="Piso" />
              <ErrorMessage class="error" name="piso" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressDoor" name="puerta" type="text" class="form-control" placeholder="Puerta" />
              <ErrorMessage class="error" name="puerta" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressPostalCode" name="codigoPostal" type="text" class="form-control" placeholder="Código Postal" />
              <ErrorMessage class="error" name="codigoPostal" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressCity" name="ciudad" type="text" class="form-control" placeholder="Ciudad" />
              <ErrorMessage class="error" name="ciudad" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressProvince" name="provincia" type="text" class="form-control" placeholder="Provincia" />
              <ErrorMessage class="error" name="provincia" />
            </div>
            <div class="form-group col-md-3 col-sm-6 col-12">
              <Field v-model="patient.addressCountry" name="pais" type="text" class="form-control" placeholder="País" />
              <ErrorMessage class="error" name="pais" />
            </div>
          </div>
          <ErrorMessage class="error" name="direccion" />
        </div>

        <div class="form-group dni">
          <label>DNI:</label>
          <Field v-model="patient.dni" name="dni" class="form-control" />
          <ErrorMessage class="error" name="dni" />
        </div>

        <div class="form-group sanitario">
          <label>Número Sanitario:</label>
          <Field v-model="patient.healthCardNumber" name="sanitario" class="form-control" />
          <ErrorMessage class="error" name="sanitario" />
        </div>


        <div class="form-group idioma label-language">
          <label>Idioma:</label>
          <MultiSelect
            v-model="patient.language"
            :options="languages"
            optionLabel="spanishName"
            optionValue="name"
            display="chip"
            placeholder="Selecciona los idiomas"
            class="w-full md:w-20rem multi-select-container input-languages"
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

          <div class="form-group telefono">
            <label>Teléfono:</label>
            <div class="phone-group form-group-multiple">
              <div>
                
                <Field as="select" v-model="patient.prefix" name="prefijo" class="form-control">
                  <option 
                    v-for="prefix in prefixes" 
                    :key="prefix.id" 
                    :value="prefix.prefix">
                    {{ prefix.country }}  ({{ prefix.prefix }})
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


        <div class="form-group correo">
          <label>Correo:</label>
          <Field v-model="patient.email" name="correo" class="form-control" />
          <ErrorMessage class="error" name="correo" />
        </div>

        <div class="form-group zona">
            <label>Zona:</label>
            <Field as="select" v-model="patient.zoneId" name="zona" class="form-control">
            <option 
            v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
            </Field>
            <ErrorMessage class="error" name="zona" />
          </div>

        <div class="form-group situacionPersonal">
          <label>Situación personal familiar:</label>
          <Field v-model="patient.situationPersonalFamily" name="situacionPersonal" class="form-control" />
          <ErrorMessage class="error" name="situacionPersonal" />
        </div>

        <div class="form-group situacionSanitaria">
          <label>Situación sanitaria:</label>
          <Field v-model="patient.healthSituation" name="situacionSanitaria" class="form-control" />
          <ErrorMessage class="error" name="situacionSanitaria" />
        </div>

        <div class="form-group situacionAlojamiento">
          <label>Situacion de Alojamiento:</label>
          <div class="form-group-multiple little-margin row"> 
            <div class="col-md-3 col-sm-6 col-12">
              <Field v-model="patient.housingSituationType" name="tipo" type="text" class="form-control" placeholder="Tipo" />
              <ErrorMessage class="error" name="tipo" />
            </div>
            <div class="col-md-3 col-sm-6 col-12">
              <Field v-model="patient.housingSituationStatus" name="estado" type="text" class="form-control" placeholder="Estado" />
              <ErrorMessage class="error" name="estado" />
            </div>
            <div class="col-md-3 col-sm-6 col-12">
              <Field v-model="patient.housingSituationNumberOfRooms" name="habitacion" type="number" class="form-control" placeholder="Habitación" />
              <ErrorMessage class="error" name="habitacion" />
            </div>
            <div class="col-md-3 col-sm-6 col-12">
              <Field v-model="patient.housingSituationLocation" name="localizacion" type="text" class="form-control" placeholder="Localización" />
              <ErrorMessage class="error" name="localizacion" />
            </div>
          </div> 
        </div>

        <div class="form-group autonomia">
          <label>Autonomía:</label>
          <Field v-model="patient.personalAutonomy" name="autonomia" class="form-control" />
          <ErrorMessage class="error" name="autonomia" />
        </div>

        <div class="form-group situacionEconomica">
          <label>Situación económica:</label>
          <Field v-model="patient.economicSituation" name="situacionEconomica" class="form-control" />
          <ErrorMessage class="error" name="situacionEconomica" />
        </div>

        <div class="form-group contacto" >
          <label>Contacto de emergencia:</label>
          <div class="form-group-multiple-contact row">
            <div v-for="(contact, index) in patient.contacts" :key="index" class="contact-card col-sm-6 col-12">
              <div>
                <Field v-model="contact.name" :name="`contacts[${index}].nombre`" placeholder="Nombre" class="form-control" />
                <ErrorMessage class="error" :name="`contacts[${index}].nombre`" />
              </div>
              <div>
                <Field v-model="contact.lastName" :name="`contacts[${index}].apellido`" placeholder="Apellido" class="form-control" />
                <ErrorMessage class="error" :name="`contacts[${index}].apellido`" />
              </div>
              <div>
                <Field v-model="contact.email" :name="`contacts[${index}].email`" placeholder="Email" class="form-control" />
                <ErrorMessage class="error" :name="`contacts[${index}].email`" />
              </div>
              <!-- <div>
                <Field v-model="contact.prefix" :name="`contacts[${index}].prefix`" placeholder="Prefijo" class="form-control" />
                <ErrorMessage class="error" :name="`contacts[${index}].prefix`" />
              </div> -->
              <div class="form-group">
                <label>Prefijo:</label>
                <Field as="select" v-model="contact.prefix" :name="`contacts[${index}].prefix`" class="form-control">
                <option 
                v-for="prefix in prefixes" :key="prefix.prefix" :value="prefix.prefix">{{ prefix.country }} ({{ prefix.prefix  }})</option>
                </Field>
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].prefix`" />
              </div>
              <div>
                <Field v-model="contact.phone" :name="`contacts[${index}].telefono`" placeholder="Teléfono" class="form-control" />
                <ErrorMessage class="error" :name="`contacts[${index}].telefono`" />
              </div>
              <!-- <div>
                <Field v-model="contact.relationship" :name="`contacts[${index}].relacion`" placeholder="Relación" class="form-control" />
                <ErrorMessage class="error" :name="`contacts[${index}].relacion`" />
              </div> -->

              <div class="form-group">
                <label>Relacion:</label>
                <Field as="select" v-model="contact.relationship" :name="`contacts[${index}].relacion`" class="form-control">
                <option 
                v-for="relationship in relationships" :key="relationship.name" :value="relationship.name">{{ relationship.spanishName }}</option>
                </Field>
                <ErrorMessage class="error" :name="`emergencyContacts[${index}].relacion`" />
              </div>
            </div>
          </div>
          <div>
              <button type="button" class="btn btn-primary" @click="addContact">
                <i class="bi bi-plus-circle"></i>
              </button>
              <button v-if="patient.contacts && patient.contacts.length > 1" 
                      type="button" 
                      class="btn btn-primary" 
                      @click="delContact(index)">
                <i class="bi bi-dash-circle"></i>
              </button>
            </div>
        </div><br>

        <button type="submit" class="btn btn-primary save">Guardar</button>
        <button type="button" class="btn btn-danger cancel" @click="handleCancel">Cancelar</button>
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
        contacts: yup.array()
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
        contacts: [{ name: '', lastName: '', email:'', prefix: '', phone: '', relationship: '' }], 
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
            const contacts= this.patient.contacts;
            contacts.forEach(element => {

              element.patientId = idPatient;
              axios.put(`${API}/contacts/${element.id}`, element)
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
            const contacts= this.patient.contacts;
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
      this.patient.contacts.push({ name: '', lastName: '', prefix: '', phone: '', relationship: '' });
    },
    delContact() {
      if (this.patient.contacts.length > 1) {
        this.patient.contacts.pop();
      }
    }
  },
};
</script>

<style>
.input-languages {
  margin-top: 15px;
  padding: 9px;
  border-radius: 10px !important;
  border: 2px solid #66c2ff !important;
}
.p-multiselect-label {
  flex-direction: row !important;
  flex-wrap: wrap;
  align-items: flex-end !important;
}
.p-multiselect-list-container {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 5px;
}

.p-multiselect {
  margin-top: 0 !important;
}

.p-chip {
  margin-right: 10px;
}

.label-language {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}

.grid-form {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "title title"
    "nombre apellido"
    "fecha fecha"
    "calle calle"
    "dni sanitario"
    "idioma telefono"
    "correo zona"
    "situacionPersonal situacionSanitaria"
    "situacionAlojamiento situacionAlojamiento"
    "autonomia situacionEconomica"
    "contacto contacto"
    "save save"
    "cancel cancel";
}

@media (max-width: 576px) {
  .grid-form {
    grid-template-columns: 1fr;
    grid-template-areas:
      "title"
      "nombre"
      "apellido"
      "fecha"
      "calle"
      "dni"
      "sanitario"
      "idioma"
      "telefono"
      "correo"
      "zona"
      "situacionPersonal"
      "situacionSanitaria"
      "situacionAlojamiento"
      "autonomia"
      "situacionEconomica"
      "contacto"
      "save"
      "cancel";
  }
}

.title {
  grid-area: title;
}

.nombre {
    grid-area: nombre;
}

.apellido {
    grid-area: apellido;
  }

  .fecha {
    grid-area: fecha;
  }
  
.calle {
  grid-area: calle;
}

.dni {
    grid-area: dni;
}

.sanitario {
    grid-area: sanitario;
}

.idioma {
    grid-area: idioma;
}

.telefono {
    grid-area: telefono;
}

.correo {
    grid-area: correo;
}

.zona {
    grid-area: zona;
  }

  .situacionPersonal {
    grid-area: situacionPersonal;
}

.situacionSanitaria {
  grid-area: situacionSanitaria;
}

.situacionAlojamiento {
    grid-area: situacionAlojamiento;
}

.autonomia {
    grid-area: autonomia;
}

.situacionEconomica {
    grid-area: situacionEconomica;
}

.contacto {
    grid-area: contacto;
  }

  .save {
    grid-area: save;
}

.cancel {
    grid-area: cancel;
}
</style>