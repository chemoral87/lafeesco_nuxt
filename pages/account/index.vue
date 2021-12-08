<template>
  <div>
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <div class="text-h4">
            Nombre: {{user.name}} {{user.last_name}} {{user.second_last_name}}

          </div>
          <div class="text-h5">
            Email: {{user.email}}
          </div>
        </v-col>
        <v-col cols="12">
          <div class="text-h6">
            Permisos:
          </div>
          <ul>
            <li v-for="permission in permissions" :key="permission">
              {{permission}}
            </li>
          </ul>
          <!-- {{permissions}} -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Perfil", icon: "account" });
  }
}
</script>

<style>
</style>