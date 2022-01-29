<template>
  <div>
    <b-row
    v-for="(db, index) in dbs"
    :key="db.Database"
    class="p-1"
    >
      <b-button 
      v-b-toggle="'collapse-' + (index += 1)"
      variant="primary"
      >
        {{ db.Database }}
      </b-button>
      <b-collapse 
      :id="'collapse' + '-' + index"
      class="mt-2"
      >
      <b-card
      class="overflow-auto"
      style="max-height: 15vh"
      >
        <b-row
        :key="table.instances"
        v-for="table in db.tables"
        class="p-1"
        
        >
          <b-button
            @click="showTableContents(table.instances, db.Database)"
            size="sm"
          >
          {{ table.instances }}
          </b-button>
        </b-row>
          
      </b-card>
    </b-collapse>
    </b-row>
    

    
  </div>
</template>


<script>
  import axios from 'axios'
  export default{
    name: 'DatabasesView',
    props: ['dbs'],
    data() {
      return {
        numberOfDbs: 0,
        start: 0
      }
    },
    created(){
      this.numberOfDbs = this.dbs.length
    },
    methods: {
      showTableContents(instance, database) {
        axios({
          method: 'post',
          url: 'http://192.168.1.235:3000/queries',
          data: {
            query: 'SELECT * FROM ' +
              database +
              '.' +
              instance
          }
        })
        .then((response) => {
          let tableContents;
          console.log(response.data.length)
          if(response.data.length === 0) {
            // console.log('Aici intra')
            tableContents = []
          }
          else {
            tableContents = JSON.parse(response.data)
          }
          
          this.$emit('showTableContents', tableContents)
          // console.log(this.tableContents[0].name)
        }, 
        (error) => {
          console.log(error)
        })
      }
    }
  }

</script>

