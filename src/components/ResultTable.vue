<template>
  <div>
    <b-table
    striped
    hover
    :items="tableData"
    class="overflow-auto"
    >
  
    </b-table>
  </div>
  

</template>

<script>

  export default {
    name: 'ResultTable',
    props: ['tableData'],
    data() {
      return {
      }
    }
  }

</script>