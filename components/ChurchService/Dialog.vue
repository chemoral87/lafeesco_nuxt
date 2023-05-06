<template>
  <v-dialog :value="true" persistent width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">{{ iconTitle }}</v-icon>
        <span class="text-h5">{{ formTitle }}</span>
        <v-spacer />
        <v-icon @click.native="close"> $delete </v-icon>
      </v-card-title>
      <v-form ref="form" @submit.prevent="save">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-select
                label="Contactado"
                @change="item.call_type_id = null"
                v-model="item.was_contacted"
                :items="was_contacted_items"
                item-text="text"
                item-value="value"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-select
                label="Tipo de Llamada"
                ref="call_type"
                v-model="item.call_type_id"
                :items="call_types_filtered"
                item-text="name"
                item-value="id"
                :rules="[rules.required]"
                outlined
                :hide-details="$refs.call_type && $refs.call_type.valid"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field label="Comentarios" v-model="item.comments" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" class="mr-1" outlined @click.native="close"> Cancelar </v-btn>
        <v-btn color="primary" @click.native="save"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['memberCall'],
  data() {
    return {
      municipalities: [
        { id: 1, name: 'Escobedo' },
        { id: 2, name: 'García' },
        { id: 3, name: 'San Nicolás' },
        { id: 4, name: 'Monterrey' }
      ],
      item: {},
      call_types: [],
      was_contacted_items: [
        { value: 1, text: 'SI' },
        { value: 0, text: 'NO' }
      ],
      rules: {
        required: (value) => {
          return !!value || 'Requerido.'
        },
        min: (v) => v.length >= 8 || 'Min 8 characters'
      }
    }
  },
  computed: {
    iconTitle() {
      return 'mdi-phone'
    },
    formTitle() {
      return 'Llamada Seguimiento'
    },
    call_types_filtered() {
      return this.call_types.filter((x) => x.was_contacted == this.item.was_contacted)
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      if (this.$refs.form.validate()) this.$emit('save', this.item)
    }
  },
  async mounted() {
    this.call_types = await this.$store.dispatch('catalogs/fetchCallTypes')
    //await this.$repository.MemberCall.getCallTypes();
    if (this.memberCall) {
      this.item = { ...this.memberCall }
    }
  }
}
</script>
