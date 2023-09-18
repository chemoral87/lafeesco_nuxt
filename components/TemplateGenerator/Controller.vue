<template>
  <div>
    <v-btn @click="toCopy()"><v-icon>mdi-content-copy</v-icon></v-btn>
    <div v-text="templ" ref="message" class="templ"></div>
    <!-- <template v-for="def in definitions">
      <div>{{ def }}</div>
    </template> -->
  </div>
</template>
<script>
export default {
  props: ["component", "definitions", "table_name", "variable_name"],
  data() {
    return {};
  },
  methods: {},
  computed: {
    createParams() {
      let create = "";
      for (let [i, def] of this.definitions.entries()) {
        if (def.column_key != "PRI" && !["created_at", "updated_at"].includes(def.column_name)) {
          if (i > 1) {
            create += "\n";
          }
          create += `'${def.column_name}'=> $request->get('${def.column_name}'),`;
        }
      }
      return create;
    },
    updateParams() {
      let update = "";
      for (let [i, def] of this.definitions.entries()) {
        if (def.column_key != "PRI" && !["created_at", "updated_at"].includes(def.column_name)) {
          if (i > 1) {
            update += "\n";
          }
          update += `\$${this.variable_name}->${def.column_name} = $request->get('${def.column_name}');`;
        }
      }
      return update;
    },
    Modelname() {
      return "tom";
    },
    ModelName() {
      // return title case removen underscores from variable_name
      // validate if not null
      if (this.variable_name == "") return "";
      return this.variable_name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
    },
    templ() {
      if (this.variable_name == "") return "";
      return `use App\\Http\\Resources\\DataSetResource;
use Illuminate\Http\Request;
use App\\Models\\${this.ModelName};

public function index(Request $request) {
    $filter = $request->get("filter");
    $query = queryServerSide($request, ${this.ModelName}::query());
    if ($filter) {
      $query->where("name", "like", "%" . $filter . "%");
    }
    \$${this.table_name} = $query->paginate($request->get('itemsPerPage'));
    return new DataSetResource(\$${this.table_name});
}

public function show($id) {
    \$${this.variable_name} = ${this.ModelName}::where("id", $id)->first();
    if (\$${this.variable_name} == null) {
      abort(405, '${this.ModelName} not found');
    }
    return response()->json(\$${this.variable_name});
}

  public function create(Request $request) {
    \$${this.variable_name} = ${this.ModelName}::create([
      ${this.createParams}
    ]);
    return ['success' => __('messa.${this.variable_name}_create')];
  }

  public function update(Request $request, $id) {
    \$${this.variable_name} = ${this.ModelName}::find($id);
    ${this.updateParams}
    \$${this.variable_name}->save();
    return ['success' => __('messa.${this.variable_name}_update')];
  }

  public function delete($id) {
    \$${this.variable_name} = ${this.ModelName}::find($id);
    \$${this.variable_name}->delete();
    return ['success' => __('messa.${this.variable_name}_delete')];
  }

`;
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
<style scoped>
.templ {
  white-space: pre;
}
</style>
