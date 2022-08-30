<template>
    <div class="addTemplateString">
        <form @submit="onSubmit" class="flex flex-col mt-5">
            <textarea
                rows = "3"
                cols = "30"
                name = "option"
                placeholder="enter text of the option here..."
                v-model="optionText"
            >
            </textarea>
            <span class="flex justify-center text-gray-500 mt-2" v-if="v$.optionText.$error"> providing text is required </span>
            <button type="submit" class="submit mt-2 mb-2"> Submit </button>
        </form>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
    name: 'AddTemplateString',
    props: {
        itemId: {type: Number, default: null}
    },
    data() {
        return {
            optionText: ''
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations() {
        return {
            optionText: { required }
        }
    },
    methods: {
        onSubmit: function (e) {
            e.preventDefault()

            this.v$.optionText.$touch() // run the validation
            
            if (!this.v$.optionText.$error) {
                const payload = {
                    'itemId': this.itemId,
                    'optionText': this.optionText
                }
                this.$store.commit('ADD_TEMPLATESTRING', payload)
                // Cleanup after submitting the response
                this.optionText = ''
            }
        }
    }
}
</script>

<style scoped>

</style>