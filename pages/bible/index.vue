<template>
  <v-container>
    <v-row>
      <v-col cols="5" sm="4" md="3">
        <v-text-field
          v-model="prompt"
          @keyup.enter="getVersicles"
          label="Versículos"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn
          :disabled="prompt.length <= 4"
          @click="getVersicles()"
          color="primary"
        >
          Buscar
        </v-btn>
        <v-btn @click="showHelp()" color="info"> Ayuda </v-btn>
        <v-btn @click="share()" color="info"> Compartir </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-checkbox v-model="see_sub" label="Ver Sub"></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(versicle, ix) in searches"
        :key="'x' + ix"
      >
        <v-card v-if="versicle.versicles">
          <v-card-title class="py-1">
            {{ versicle.book.name }}
            {{ versicle.chapter }}.{{ versicle.verse }}
            <template v-if="versicle.verseTo">-{{ versicle.verseTo }}</template>
            <v-spacer />
            <v-icon class="ml-2" @click="searches.splice(ix, 1)" color="red">
              mdi-delete
            </v-icon>
          </v-card-title>
          <v-card-text class="black--text py-0">
            <template v-if="versicle.versicles.length > 0">
              <span v-for="(verse, iy) in versicle.versicles" :key="'y' + iy">
                <sup v-if="see_sub" class="red--text">
                  <strong>{{ verse.verse }}</strong>
                </sup>
                {{ verse.text }}
              </span>
            </template>

            <span v-else class="red--text">Versículos no encontrados</span>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title class="py-1">
            {{ versicle.prompt }}
            <v-spacer />
            <v-icon class="ml-2" @click="searches.splice(ix, 1)" color="red">
              mdi-delete
            </v-icon>
          </v-card-title>
          <v-card-text class="black--text py-0">
            <span class="red--text">Versículos no encontrados</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogHelp" max-width="600px">
      <v-card class="">
        <v-card-title class="headline">
          <v-icon class="mr-2">mdi-help-circle-outline</v-icon>
          <span class="text-h5">Ayuda</span> <v-spacer />
          <v-icon @click="dialogHelp = false"> $delete </v-icon>
        </v-card-title>
        <v-card-text class="py-0 px-2 ma-0">
          <p>
            Puedes buscar versículos de la Biblia usando el formato
            <code>is 2.1</code>, donde <code>is</code> es el libro de
            <code>Isaías</code>, seguido del capítulo <code>2</code> y versículo
            <code>1</code>, separados por punto <code>.</code> o dos puntos
            <code>:</code>.
          </p>
          <p>
            Si deseas buscar un rango de versículos, usa el guion para
            especificar el rango, como en <code>is 3.4-5</code> o
            <code>is 3:4-5</code> .
          </p>
        </v-card-text>
        <v-card-title class="headline py-0">
          <h3 class="text-subtitle-1 font-weight-bold my-0">
            Antiguo Testamento
          </h3>
        </v-card-title>
        <v-card-text class="ma-0 pa-1">
          <v-simple-table>
            <tbody>
              <tr
                v-for="(row, rowIndex) in chunkBooks(
                  oldTestamentBooks,
                  books_per_row
                )"
                :key="rowIndex"
              >
                <td v-for="(book, colIndex) in row" :key="colIndex">
                  <div v-if="book">
                    {{ book.name }} <sup>{{ book.order }}</sup
                    ><br />
                    <strong>{{ book.abbreviation }}</strong>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-title class="headline pt-3 pb-0">
          <h3 class="text-subtitle-1 font-weight-bold my-0">
            Nuevo Testamento
          </h3>
        </v-card-title>
        <v-card-text class="ma-0 pa-1">
          <v-simple-table>
            <tbody>
              <tr
                v-for="(row, rowIndex) in chunkBooks(
                  newTestamentBooks,
                  books_per_row
                )"
                :key="rowIndex"
              >
                <td v-for="(book, colIndex) in row" :key="colIndex">
                  <div v-if="book">
                    {{ book.name }} <sup>{{ book.order }}</sup
                    ><br />
                    <strong>{{ book.abbreviation }}</strong>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="mr-1"
            outlined
            @click="dialogHelp = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      prompt: "jr 33.3", // "is 1.1;is 3.4-5",
      versicles: [],
      bible_books: [],
      see_sub: true,

      dialogHelp: false,
      books_per_row: 3,
      searches: [],
      no_result: "",
      showPromptError: false,
    };
  },
  methods: {
    share() {
      if (this.prompt.length < 4) {
        this.showPromptError = true;
        this.$refs.promptField.validate();
        return;
      }
      let url = `${window.location.origin}${this.$route.path}?s=${this.prompt}`;
      navigator.clipboard.writeText(url).then(() => {
        alert("Enlace copiado al portapapeles");
      });
    },
    onPromptInput() {
      if (this.showPromptError) {
        this.showPromptError = false;
        this.$refs.promptField.resetValidation();
      }
    },
    getTbody(books, cols) {
      let rows = [];
      for (let i = 0; i < books.length; i += cols) {
        let row = [];
        for (let j = 0; j < cols && i + j < books.length; j++) {
          row.push(
            `<td>${books[i + j].name}<br /><strong>${
              books[i + j].abbreviation
            }</strong></td>`
          );
        }
        rows.push(`<tr>${row.join("")}</tr>`);
      }
      return rows.join("");
    },
    showHelp() {
      this.dialogHelp = true;
    },
    getVersicles() {
      // this.$route.query.s = this.prompt
      //this.$router.push({ path: this.$route.path, query: { s: this.prompt } });
      this.$repository.Bible.index({ prompt: this.prompt }).then((resp) => {
        // for each item in resp push to searches
        for (let i = resp.length - 1; i > -1; i--) {
          this.searches.unshift(resp[i]);
        }
        this.prompt = "";
      });
    },
    chunkBooks(books, columns) {
      const rows = Math.ceil(books.length / columns);
      const chunked = [];

      for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < columns; col++) {
          const index = col * rows + row;
          currentRow.push(books[index] || null); // rellena con null si falta
        }
        chunked.push(currentRow);
      }

      return chunked;
    },
  },
  computed: {
    promptRule() {
      return (v) => !!v || "Debes escribir un versículo o palabra clave.";
    },
    newTestamentBooks() {
      return this.bible_books.filter((book) => book.testament === "N");
    },
    oldTestamentBooks() {
      return this.bible_books.filter((book) => book.testament === "O");
    },
  },
  mounted() {
    let me = this;
    if (this.$route.query.s) {
      this.prompt = this.$route.query.s;
      this.$repository.Bible.index({ prompt: this.prompt }).then((resp) => {
        for (let i = resp.length - 1; i > -1; i--) {
          this.searches.unshift(resp[i]);
        }
        this.prompt = "";
      });
    }
    this.$repository.BibleBook.index().then((resp) => {
      this.bible_books = resp;
    });
    const realPixelWidth = window.screen.width;

    if (realPixelWidth < 600) {
      this.books_per_row = 3;
    } else if (realPixelWidth < 800) {
      this.books_per_row = 4;
    } else {
      this.books_per_row = 5;
    }
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Biblia",
      icon: "book",
    });
  },
};
</script>
