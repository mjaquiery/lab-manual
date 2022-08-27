<template>
  <div class="download-bar">
    <div v-if="status === 'converted'">
      <p>The download is ready!</p>
      <p>
        <a :href="document_url">{{ document_url }}</a>
      </p>
    </div>
    <div v-else-if="status === 'converting'">
      <p>The document is being converted into .{{ format }}.</p>
    </div>
    <div ref="downloadModalContent" v-else>
      <h2 class="ml-2 mb-2">Download options</h2>
      <div class="flex flex-col items-center">
      <label for="format-select" class="mr-2 mb-2">To download the document, please select a download format:</label>
      <select id="format-select" v-model="format" class="rounded-md mb-6 bg-blue-300 bg-opacity-50 p-1" >
        <option v-for="f in formats" :key="f" :value="f.value">.{{ f.value }}</option>
      </select>
      <button @click="startDownload" class="rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold" v-if="format">
        <DownloadIcon class="h-5 w-5" />
        <span>Download</span>
      </button>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import { DownloadIcon} from '@heroicons/vue/solid'
import { toNested, download } from '@/utils.js'

export default {
  name: 'DownloadButton',
  components: {
    DownloadIcon
  },
  props: {
    formats: {
      type: Array,
      required: false,
      default: () => [
        {
          'value': 'pdf',
          'hint': ''  
        },
        {
          'value': 'html',
          'hint': '' 
        },
        {
          'value': 'docx',
          'hint': '' 
        },
        {
          'value': 'markdown',
          'hint': '' 
        },
        {
          'value': 'json',
          'hint': '' 
        }
      ]
    }
  },
  data: () => {
    return {
      status: 'waiting',
      format: 'pdf',
      job_id: null
    }
  },
  computed: {
    ...mapState(['flat', 'markdown', 'pandoc_api_url'])
  },
  methods: {
    startDownload: function () {
      // Prepare download for markdown and json prepared here
      function prepareDownload(blob_data, filename) {
        const blob = new Blob([blob_data], { type: 'text/plain' })
        const href = URL.createObjectURL(blob)
        download(href, filename)
        URL.revokeObjectURL(href)
      }

      // Convert data to markdown for pandoc conversion
      console.log(`Starting conversion to .${this.format}.`)
      this.$store.commit('TO_MARKDOWN', this.flat)

      // Download pdf, html, or docx
      if (['pdf', 'html', 'docx'].includes(this.format)) {
        // Post a job for pandoc api
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
          .then(res => {console.log(res); return res.data })
          .then(res => {
            this.job_id = res.id
            if (this.job_id !== null) {
              this.status = 'converting'
              this.checkConversionStatus()
            } else {
              throw ("No id received in response to conversion request.")
            }
          })
          .catch(error => {
            console.log(error)
          })
        // Return markdown as is if requested
      } else if (this.format === 'markdown') {
        prepareDownload(this.markdown, 'lab-manual.md')
        // Turn template to JSON and return
      } else if (this.format === 'json') {
        const flatClone = _.cloneDeep(this.flat)
        const nested = toNested(flatClone)
        const data = JSON.stringify(nested)
        prepareDownload(data, 'lab-manual.json')
      }
    },
    checkConversionStatus: function (i = 0, delay = 1000) {
      axios.get(`${this.pandoc_api_url}/jobs/${this.job_id}`)
        .then(res => { console.log(res); return res.data })
        .then(res => {
          if (res.output && res.output.length) {
            this.status = 'converted'
            const document_url = `${this.pandoc_api_url}${res.output[0].file_path}`
            download(
              document_url,
              `lab-manual.${this.format}`  // this doesn't actually set the name when downloading from PandocAPI
            )
          }
        })
        .finally(error => {
          if (error) {
            console.warn(error)
          }
          if (this.status !== 'converted') {
            setTimeout(this.checkConversionStatus, i = i + 1, delay)
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*   select {max-width: 100px}
  span.placeholder {background-color: #42b983; min-width: 4em;} */
</style>
