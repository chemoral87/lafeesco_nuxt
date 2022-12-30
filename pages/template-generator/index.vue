<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12"> </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="table_filter"
          label="Filtro Tabla"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <!-- <my-numeric v-model="numericValue" /> -->
        <my-money v-model="numericValue" />
        {{ numericValue }}
        <my-numeric v-model="rate" />
        {{ rate }}
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="getTables()" color="primary">
          <v-icon class="mr-1">mdi-magnify</v-icon> Buscar
        </v-btn>
        <v-btn @click="sendNotify()" color="primary">
          <v-icon class="mr-1">mdi-bell</v-icon> Notificacion
        </v-btn>
        <v-btn @click="getDefinitions()" color="danger">
          <v-icon class="mr-1">mdi-engine</v-icon> Generar
        </v-btn>
        <v-btn @click="runLogic()" color="danger">
          <v-icon class="mr-1">mdi-engine</v-icon> Logic
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Mark</th>
                <th class="text-left">TABLE_NAME</th>
                <th class="text-left">SCHEMA_NAME</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tablez" :key="item.name">
                <td>
                  <v-checkbox
                    v-model="item.check"
                    @change="mark($event, item)"
                  />
                </td>
                <td>{{ item.TABLE_NAME }}</td>
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
<script>
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as THREE from "three";
export default {
  props: {},

  data() {
    return {
      numericValue: 0,
      rate: 15,
      priceVuetify: 0,
      config: {
        decimal: ".",
        thousands: ",",
        prefix: "",
        suffix: "",
        precision: 2,
        // masked: false,
      },
      table_filter: "",
      schema_filter: "lafeescobedo_db",
      tablez: [],
      definitions: [],
      a: 1,
    };
  },
  computed: {
    configMask() {
      let precision = 2;
      // console.log(this.priceVuetify);
      // if (
      //   this.priceVuetify.toString().indexOf(".") == -1 ||
      //   this.priceVuetify == 0
      // ) {
      //   precision = 0;
      //   console.log("configMask");
      // }
      // if ((this.priceVuetify * 100) % 100 == 0) precision = 0;
      return {
        decimal: ".",
        thousands: ",",
        prefix: "",
        suffix: "",
        precision: precision,
        // masked: false,
      };
    },
    mark_tables() {
      let mark_tables = this.tablez.filter((tab) => tab.check == true);
      return mark_tables;
    },
  },
  watch: {
    async table_filter(value) {
      this.$store.dispatch("hideNextLoading");
      this.getTables();
    },
  },
  methods: {
    mark(ev, item) {
      this.$set(item, "check", ev);
      // item.check = ev;
      // item = Object.assign({}, item);
    },
    sendNotify() {
      this.$store.dispatch("notify", {
        success: "tomasin " + this.a,
      });
      this.a++;
    },
    async getTables(options) {
      let { table_filter, schema_filter } = this;
      this.tablez = await this.$repository.TemplateGenerator.getTables({
        table_filter,
        schema_filter,
      });
    },

    async getDefinitions() {
      let { mark_tables } = this;
      let payload = mark_tables.map((tab) => {
        return { table_name: tab.TABLE_NAME, table_schema: tab.TABLE_SCHEMA };
      });

      this.definitions =
        await this.$repository.TemplateGenerator.getDefinitions({
          payload,
        });
    },
  },
  mounted() {
    let me = this;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the materials for the cubes
    const material1 = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
    });
    const material2 = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3,
    });
    const material3 = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.3,
    });

    // Create the first level of cubes
    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const cube1 = new THREE.Mesh(geometry1, material1);
    const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material1);
    const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material1);
    const cube4 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material3);

    // Create the colored material for the edges
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Create the edges
    const edges = new THREE.EdgesGeometry(geometry1);
    const line = new THREE.LineSegments(edges, edgeMaterial);
    line.position.set(2, 0, 0);
    scene.add(line);

    // Position the first level of cubes in a square formation
    cube1.position.set(0, 0, 0);
    cube2.position.set(1, 0, 0);
    cube3.position.set(0, 0, -1);
    cube4.position.set(1, 0, -1);

    // Add the first level of cubes to the scene
    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);
    scene.add(cube4);
    // Set up the label
    const fontLoader = new FontLoader();
    fontLoader.load("/font/droid_sans_regular.typeface.json", function (font) {
      const textGeometry = new TextGeometry("A1", {
        font: font,
        size: 0.5,
        height: 0.03,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 0, 0);
      scene.add(textMesh);
    });

    // // Add the text to the cube as a child

    // scene.add(labelObject);
    // Create the second level of cubes
    const cube5 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material2);
    const cube6 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material2);
    const cube7 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material2);
    const cube8 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material2);

    // Position the second level of cubes in a square formation
    cube5.position.set(0, 1, 0);
    cube6.position.set(1, 1, 0);
    cube7.position.set(0, 1, -1);
    cube8.position.set(1, 1, -1);

    // Add the second level of cubes to the scene
    scene.add(cube5);
    scene.add(cube6);
    scene.add(cube7);
    scene.add(cube8);

    // Render the scene
    camera.position.set(0, 2, 5);

    // Render the scene
    const controls = new OrbitControls(camera, renderer.domElement);

    // Render the scene
    function render() {
      renderer.render(scene, camera);
    }

    // Animate the camera
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
    }

    // Start the animation loop
    animate();
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Template Generator",
      icon: "engine",
    });
  },
};
</script>
