<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12"> </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="2">
        <v-text-field v-model="table_filter" label="Filtro Tabla"></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <!-- <my-numeric v-model="numericValue" /> -->
        <my-money v-model="numericValue" />
        {{ numericValue }}
        <my-numeric v-model="rate" />
        {{ rate }}
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="getTables()" color="primary"> <v-icon class="mr-1">mdi-magnify</v-icon> Buscar </v-btn>
        <v-btn @click="sendNotify()" color="primary"> <v-icon class="mr-1">mdi-bell</v-icon> Notificacion </v-btn>
        <v-btn @click="getDefinitions()" color="danger"> <v-icon class="mr-1">mdi-engine</v-icon> Generar </v-btn>
        <v-btn @click="runLogic()" color="danger"> <v-icon class="mr-1">mdi-engine</v-icon> Logic </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">TABLE_NAME</th>
                <!-- <th class="text-left">TABLE_NAME</th> -->
                <th class="text-left">SCHEMA_NAME</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tablez" :key="item.name">
                <td>
                  <v-radio-group v-model="radioTable" column>
                    <v-radio :label="item.TABLE_NAME" :value="item.TABLE_NAME" @click="getColumns()"></v-radio>
                  </v-radio-group>
                  <!-- <v-checkbox
                    v-model="item.check"
                    @change="mark($event, item)"
                  /> -->
                </td>
                <!-- <td>{{ item.TABLE_NAME }}</td> -->
                <td>{{ item.TABLE_SCHEMA }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="6"> tablas aqui </v-col>
    </v-row>
    <!-- {{ mark_tables }} -->
    <v-row dense>
      <v-col cols="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script></script>
