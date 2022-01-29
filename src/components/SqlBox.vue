<template>
  <div>
    <b-form-textarea 
    v-model.lazy="text" 
    placeholder="Type your Sql Commands here and compile them by pressing F9"
    class="h-100 textarea shadow-none"
    @update="BoxUpdater"
    spellcheck="false"
    @keydown.native.120="runSql"
    >
    </b-form-textarea>
  </div>

</template>

<script>
  import { format } from 'sql-formatter'
  export default {
    name: 'SqlBox',
    data() {
      return {
        text: ''
      }
    },
    methods:{
      BoxUpdater() {
        this.text = format(this.text, {
          uppercase: false
        })
        let lines = this.text.split("\n")
        this.$emit('linesEvent', lines.length)
      },
      runSql() {
        // console.log(this.text)
        this.$emit('runSql', this.text)
      }
    }
  }
</script>

<style scoped>
  

</style>