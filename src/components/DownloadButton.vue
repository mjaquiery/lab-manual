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
import _ from 'lodash'
import { DownloadIcon} from '@heroicons/vue/solid'
import { toNested, download } from '@/utils.js'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import MarkdownIt from 'markdown-it'

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
        // {
        //   'value': 'pdf',
        //   'hint': ''  
        // },
        // {
        //   'value': 'html',
        //   'hint': '' 
        // },
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
    ...mapState(['flat', 'markdown'])
  },
  methods: {
    async startDownload() {
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
     

      // Download docx
      if (['docx'].includes(this.format)) {
        this.status = 'converting'
        try {
          const markdownIt = new MarkdownIt()
          const tokens = markdownIt.parse(this.markdown, {});

          const children = [];
          let inParagraph = false;

          tokens.forEach(token => {
           
            if (token.type === 'heading_open') {
              const level = parseInt(token.tag.slice(1));
              const text = tokens[tokens.indexOf(token) + 1].content;
              children.push(
                new Paragraph({
                  text,
                  heading: HeadingLevel[`HEADING_${level}`],
                })
              )  
            } else if (token.type === 'paragraph_open') {
              inParagraph = true;
            } else if (token.type === 'paragraph_close') {
              inParagraph = false;
            } else if (token.type === 'inline' && inParagraph) {
              const textRuns = token.children.map(inlineToken => {
                if (inlineToken.type === 'text') {
                  return new TextRun(inlineToken.content);
                } else if (inlineToken.type === 'em_open' || inlineToken.type === 'em_close') {
                  return new TextRun({
                    text: inlineToken.content,
                    italics: inlineToken.type === 'em_open',
                  });
                } else if (inlineToken.type === 'strong_open' || inlineToken.type === 'strong_close') {
                  return new TextRun({
                    text: inlineToken.content,
                    bold: inlineToken.type === 'strong_open',
                  });
                } else if (inlineToken.type === 'code_inline') {
                  return new TextRun({
                    text: inlineToken.content,
                    font: { name: 'Courier New' },
                  });
                }
                return new TextRun(inlineToken.content);
              });

              children.push(new Paragraph({
                children: textRuns
              }));
            }
          });
          
          const doc = new Document({
            sections: [{
            properties: {},
           children: children,
            }],
          });

          const blob = await Packer.toBlob(doc);
          this.status = 'converted';
          prepareDownload(blob, 'lab-manual.docx');
        } catch (error) {
          console.error('Error converting document:', error);
          this.status = 'waiting';
        }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*   select {max-width: 100px}
  span.placeholder {background-color: #42b983; min-width: 4em;} */
</style>
