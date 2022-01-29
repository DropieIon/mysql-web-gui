<template>
  <b-container fluid style="height: 65vh">
    <b-row class="h-100">
      <b-col
      cols="1"
      style="width:auto; height: 65vh"
      class="overflow-auto"
      >
          <DatabasesView @showTableContents="showTableContents" :dbs="dbs" />
      </b-col>
      <b-col sm="auto" class="g-0">
        <ul class="list-group">
          <li 
          :style="{
            'height': hei,
           'font-size': f_s
           }"
          v-for="line in line_numbers"
          :key="line"
          class="list-group-item border-right-0"
          > 
          {{ line }} </li>
        </ul>
      </b-col>
      <b-col class="h-100 texty g-0">
          <SqlBox 
          @linesEvent="updateLineNumbers" 
          class="h-100"
          @runSql="runSql"
          />
      </b-col>
        
    </b-row>
    <b-row 
    class="overflow-auto"
    style="height: 30vh"
    >
      <ResultTable 
      :tableData="tableContents"
      />
    </b-row>
   
  </b-container>
  
  
  

</template>

<script>
import DatabasesView from "@/components/DatabasesView.vue"
import SqlBox from "@/components/SqlBox.vue"
import ResultTable from "@/components/ResultTable.vue"
import axios from 'axios'

export default {
  name: 'SqlEnvironment',
  props: ['dbs'],
  data() {
    return {
      line_numbers: [],
      hei: 0, // line height
      f_s: 0, // font size
      linesPossible: 0, // the amount of lines visible in textarea
      showTable: false,
      tableContents: [
        {'Mysql-Web-Gui': 'Welcome to MySql Web Gui! This is \
      where you\'ll be seeing the answer to your queries.'}
      ]
    }
  },
  components: {
    DatabasesView,
    SqlBox,
    ResultTable
  },
  methods: {
    updateLineNumbers(nrOfLines) {
      if(this.linesPossible >= nrOfLines) {
        let last_element = this.line_numbers[this.line_numbers.length - 1]
        if(last_element === 1 && nrOfLines === 1)
          return
        if(last_element === nrOfLines)
          return
        else if(last_element < nrOfLines) {
          for(let i = last_element + 1; i <= nrOfLines; i++)
          {
            this.line_numbers.push(i)
          }
          return
        }
        else {
          while(last_element > nrOfLines)
          {
            this.line_numbers.pop()
            last_element = this.line_numbers[this.line_numbers.length - 1]
          }
          return
        }
      }
      
    },
    showTableContents(data) {
      if(data.length === 0)
      {
        data.push({info: "There are no elements in this table"})
      }
      // console.log(data)
      this.tableContents = data
      return
    },
    runSql(text) {
        axios({
          method: 'post',
          url: 'http://192.168.1.235:3000/queries',
          data: {
            query: text
          }
        })
        .then((response) => {
          this.tableContents = JSON.parse(response.data)
          console.log(JSON.parse(response.data))
          
          // console.log(this.tableContents[0].name)
        }, 
        (error) => {
          console.log(error)
        })
    }
  },
  beforeCreate() {
    this.$nextTick(() => {
      const element = document.querySelector('.texty')
      const style = getComputedStyle(element)
      // console.log(style)
      this.hei = style.lineHeight
      this.f_s = parseInt(style.lineHeight) * 1/2 + "px"
      this.line_numbers.push(1)
      this.linesPossible = parseInt(parseInt(style.height) / parseInt(this.hei))
    })
  }
}

</script>