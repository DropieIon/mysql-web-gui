<template>
  <div class="login">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Host:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.host"
          type="text"
          placeholder="Enter host ip:"
          pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Username:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.username"
          placeholder="Enter Username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Password:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="form.pass"
          type="password"
          placeholder="Enter password:"
          aria-describedby="password-help-block"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Login</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>

    <b-spinner type="grow" v-if="vizibil && !primit"></b-spinner>

    <b-list-group v-if="vizibil && primit">
       <b-list-group-item v-for="item in databases" :key="item.Database"> {{ item.Database }} </b-list-group-item>
    </b-list-group>

  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        host:'',
        username: '',
        pass: ''
      },
      show: true,
      databases: JSON,
      vizibil: false,
      primit: false
    }
  },
  methods: {
    onSubmit(event) {
        // this.$emit('clicked')
        this.show = false
        this.vizibil = true
        event.preventDefault()
        axios({
          method: 'post',
          url: 'http://192.168.1.235:3000',
          data: {
            host: this.form.host,
            user: this.form.username,
            pass: this.form.pass
          }
        })
        .then((response) => {
          this.primit = true
          this.databases = JSON.parse(response.data)
          this.$emit('loginSuccessful', response.data)
          // console.log("Login: " + response.data)
          // console.log(this.databases[1].Database)
        }, (error) => {
          console.log(error)
        })
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.host = ''
        this.form.username = ''
        this.form.pass = ''
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }//,
      // updateVisible(value){
      //   this.$emit('input')
      // }
  }
}
</script>
