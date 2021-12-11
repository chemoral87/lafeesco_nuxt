<script>
import { VTextField } from "vuetify/lib";
import AutoNumeric from "autonumeric";

export default {
  extends: VTextField,
  props: {
    anOptions: { // autonumeric options (see doc) https://www.npmjs.com/package/autonumeric
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    prefix: {
      type: String,
      default: '$ '
    },
  },
  data() {
    return {
      anElement: null, // autonumeric instance
      changedByInput: false // Flag to know if the value is changed by user input 
    };
  },
  mounted() {
    // Create the AutoNumeric instance on the VTextField input element
    this.$refs.input.inputMode = "numeric";
    this.anElement = new AutoNumeric(this.$refs.input, Object.assign({
      selectOnFocus: false,
      modifyValueOnWheel: false,
      decimalPlaces: 2
    }, this.anOptions));
    // Set the AutoNumeric  default value

    if (this.value == null || this.value == "") {
      this.anElement.clear();
    } else {
      this.anElement.set(this.value);
    }

  },
  methods: {
    onInput() {
      // User has changed the input
      this.changedByInput = true; // set the flag to true
      this.updateVModel(); // emit v-model
    },
    updateVModel() { // emit raw value
      if (this.$refs.input.value == "" || this.$refs.input.value == null) {
        this.$emit("input", null);
      } else {
        this.anElement.set(this.$refs.input.value); // fix for samsung browser 13
        this.$emit("input", this.anElement.getNumber());
      }

    },
    genInput() {
      const listeners = Object.assign({}, this.listeners$);
      delete listeners["change"];
      let element = this.$createElement("input", {
        style: {},
        attrs: {
          ...this.attrs$,
          autofocus: this.autofocus,
          disabled: this.disabled,
          id: this.computedId,
          placeholder: this.placeholder,
          readonly: this.readonly,
          type: this.type
        },
        on: {
          blur: this.onBlur,
          input: this.onInput,
          focus: this.onFocus,
          keydown: this.onKeyDown,
          "autoNumeric:formatted": () => {
            this.changedByInput = false; // Remove the flag when autonumeric finish formatting
          }
        },
        ref: "input"
      });
      return element;
    }
  },
  watch: {
    value(newVal) {
      // Check if the last v-model update is fired by the input

      if (!this.changedByInput) {
        if (this.value == null || this.value == "") {
          this.anElement.clear();
        } else {
          this.anElement.set(this.value); // Set the AutoNumeric raw value
        }
      }
    }
  }
};
</script>