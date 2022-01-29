<template>
  <div class="home">
    <Login 
    class="container" 
    v-if="visible" 
    @loginSuccessful="loginSuccessful"
    />
    <SqlEnvironment :dbs="dbs" v-if="!visible" />
  </div>
</template>

<script>
  // @ is an alias to /src
  import Login from "@/components/Login.vue"
  import SqlEnvironment from "@/components/SqlEnvironment.vue"


  export default {
    name: 'Home',
    data() {
      return {
        visible: true,
        dbs: []
      }
    },
    components: {
      Login,
      SqlEnvironment
    },
    methods: {
      loginSuccessful(databases) {
        // This function loads the sql environment and removes 
        // the login window. It also receives the database names
        this.visible = false
        this.dbs = JSON.parse(databases)
        // for(let i = 0; i < this.dbs.length; i++) {
        //   this.dbs[i].id = i
        // }
        // console.log(this.dbs[0].dbs[0])
      }
    }
  }
</script>
