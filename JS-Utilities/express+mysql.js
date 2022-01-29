const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const msql = require('mysql');
const { json } = require('express');

let con;


const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/'/*, cors(corsOptions)*/, (req, res) => {
  console.log("Host:" + req.body.host)
  console.log("User:" + req.body.user)
  console.log("Pass:" + req.body.pass)
  con = msql.createConnection({
    host: req.body.host,
    user: req.body.user,
    password: req.body.pass,
    // port :3501,
    multipleStatements: true
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  con.query('SHOW DATABASES', async (err, results, fields) => {
    if (err)
      throw err
    let response = JSON.parse(JSON.stringify(results));
    for (let i = 0; i < response.length; i++) {
      response = await QueryAsync(response, i, con)
    }

    response.forEach((data) => {
      data.tables.forEach((tables) => {
        // Table names come with a "Table_in_DatabaseName"
        // instance and it's quite hard to parse them in vue
        // so I have decided to rename them to 'instances'
        let nameOfInstance = 'Tables_in_' + data.Database
        tables['instances'] = tables[nameOfInstance]
        delete tables[nameOfInstance]
      })
    })
    response = JSON.stringify(response)
    res.json(response)
    res.end()
  })
})

app.post('/queries', (req, res) => {
  con.query(req.body.query, (err, results, fields) => {
    let response;
    if(err)
    {
      console.log(err.code)
      if(err.code === 'ER_EMPTY_QUERY')
        response = [{info: 'Your querry is empty!'}]
      if(err.code === "ER_NO_DB_ERROR")
        response = [{info: 'No database selected!'}]
      if(err.code === 'ER_PARSE_ERROR')
        response = [{info: 'You have an ERROR in your SQL syntax.'}]
      if(err.code === 'ER_NO_TABLES_USED')
        response = [{info: 'Please specify a table.'}]
      if(err.code === 'ER_DUP_ENTRY')
        response = [{info: 'This entry already exists.'}]
      response = JSON.stringify(response)
      res.json(response)
      res.end()
      return
    }
      
    response = JSON.parse(JSON.stringify(results));
    console.log('Response is: ' + response)
    if(Object.keys(response).length === 0) {
      console.log('Empty object')
      console.log(response.length)
      res.send(response)
      return
     
    }
    else if(response[0].hasOwnProperty('fieldCount'))
    {
      console.log(response[0])
      console.log(response[1])
      response.shift()
      response = response[0]
    }
    
    // This is done to get rid of RowDataSomething
    response = JSON.stringify(response)
    console.log(response)
    res.json(response)
    res.end()
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function QueryAsync(response, index, con) {
  return new Promise((resolve, reject) => {
    con.query('SHOW TABLES FROM ' + response[index].Database, (err, results, fields) => {
      if (err)
        return reject(err)
      response[index].tables = JSON.parse(JSON.stringify(results))
      return resolve(response)
    })
  })
}
