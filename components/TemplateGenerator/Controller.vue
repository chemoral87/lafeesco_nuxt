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
  props: ['component', 'definitions', 'table_name', 'model_name'],
  data() {
    return {}
  },
  methods: {},
  computed: {
    createParams() {
      let create = ''
      for (let [i, def] of this.definitions.entries()) {
        if (def.column_key != 'PRI' && !['created_at', 'updated_at'].includes(def.column_name)) {
          if (i > 1) {
            create += '\n'
          }
          create += `'${def.column_name}'=> $request->get('${def.column_name}'),`
        }
      }
      return create
    },
    updateParams() {
      let update = ''
      for (let [i, def] of this.definitions.entries()) {
        if (def.column_key != 'PRI' && !['created_at', 'updated_at'].includes(def.column_name)) {
          if (i > 1) {
            update += '\n'
          }
          update += `\$${this.model_name}->${def.column_name} = $request->get('${def.column_name}');`
        }
      }
      return update
    },
    Modelname() {
      let str = this.model_name.toLowerCase()
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    templ() {
      if (this.model_name == '') return ''
      return `use App\\Http\\Resources\\DataSetResource;
use App\\Models\\Ministry;

public function index(Request $request) {
    $filter = $request->get("filter");
    $query = queryServerSide($request, ${this.Modelname}::query());
    if ($filter) {
      $query->where("name", "like", "%" . $filter . "%");
    }
    \$${this.table_name} = $query->paginate($request->get('itemsPerPage'));
    return new DataSetResource(\$${this.table_name});
}

public function show($id) {
    \$${this.model_name} = ${this.Modelname}::where("id", $id)->first();
    if (\$${this.model_name} == null) {
      abort(405, '${this.Modelname} not found');
    }
    return response()->json(\$${this.model_name});
}

  public function create(Request $request) {
    \$${this.model_name} = ${this.Modelname}::create([
      ${this.createParams}
    ]);
    return ['success' => __('messa.${this.model_name}_create')];
  }

  public function update(Request $request, $id) {
    \$${this.model_name} = ${this.Modelname}::find($id);
    ${this.updateParams}
    \$${this.model_name}->save();
    return ['success' => __('messa.${this.model_name}_update')];
  }

  public function delete($id) {
    \$${this.model_name} = ${this.Modelname}::find($id);
    \$${this.model_name}->delete();
    return ['success' => __('messa.${this.model_name}_delete')];
  }

`
    }
  },
  mounted() {
    let me = this
  }
}
</script>
<style scoped>
.templ {
  white-space: pre;
}
</style>
