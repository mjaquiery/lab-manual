<template>
  <div class="download-bar">
    <div v-if="status === 'converted'">
      <p>The download is ready:</p>
      <p>
        <a :href="document_url">{{document_url}}</a>
      </p>
    </div>
    <div v-else-if="status === 'converting'">
      <p>The document is being converted into .{{format}}.</p>
    </div>
    <div v-else>
      <p>To download the document, please select a download format:</p>
      <div class="inline-flex">
        <select v-model="format">
          <option v-for="f in formats" :key="f" :value="f">.{{f}}</option>
        </select>
        <DownloadIcon class="h-5 w-5" @click="startDownload" v-if="format"/>
      </div>
    </div>
  </div>
</template>

<script>

import {
  mapState
} from 'vuex'
import axios from 'axios'
import { DownloadIcon } from '@heroicons/vue/solid'

export default {
  name: 'DownloadButton',
  components: {
    DownloadIcon
  },
  props: {
    formats: {type: Array, required: false, default: ()=>['pdf', 'html', 'docx']}
  },
  data: () => {
    return {
      status: 'waiting',
      format: '',
      job_id: null,
      document_url: ''
    }
  },
  computed: {
    ...mapState(['flat', 'markdown', 'pandoc_api_url'])
  },
  methods: {
    startDownload: function () {
      console.log(`Starting conversion to .${this.format}.`)
      this.$store.commit('TO_MARKDOWN', this.flat)
      axios.post(
          `${this.pandoc_api_url}/jobs/`,
          {
            'content': this.markdown,
            'format': this.format
          },
          {
            headers: {
              'authorization': 'bearer skeleton'
            }
          }
      )
          .then(res => {console.log(res); return res.data})
          .then(res => {
            this.job_id = res.id
            if(this.job_id !== null) {
              this.status = 'converting'
              this.checkConversionStatus()
            } else {
              throw("No id received in response to conversion request.")
            }
          })
          .catch(error => {
            console.log(error)
          })
    },
    checkConversionStatus: function() {
      axios.get(`${this.pandoc_api_url}/jobs/${this.job_id}`)
          .then(res => {console.log(res); return res.data})
          .then(res => {
            if(res.output && res.output.length) {
                this.status = 'converted'
                this.document_url = `${this.pandoc_api_url}${res.output[0].file_path}`
            }
          })
          .finally(error => {
            if(error) {
              console.warn(error)
            }
            if(this.status !== 'converted') {
              setTimeout(this.checkConversionStatus, 1000)
            }
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  select {max-width: 100px}
  span.placeholder {background-color: #42b983; min-width: 4em;}
</style>
