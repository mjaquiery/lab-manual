import { h } from "vue";

export default {
    props: {
        level: {
          type: Number,
          required: true
        }
      },
    render() {
      return h(
        'h' + this.level, // tag name
        {}, // props/attributes
        this.$slots.default() // array of children
      )
    }
  };