
const mysql = require('mysql');

function connectToDatabase(){ 
    const connection = mysql.createConnection({
      host     : 'HOST',
      user     : 'USER',
      password : 'PASSWORD',
      database : 'DATABASE'
    });
    return new Promise((resolve,reject) => {
       connection.connect();
       resolve(connection);
    });
  }
  
  function queryDatabase(connection){
    return new Promise((resolve, reject) => {
      connection.query('YOUR_SQL_QUERY', (error, results, fields) => {
        resolve(results);
      });
    });
  }

   function insertIntoDatabase(connection, data){
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET ?', data, (error, results, fields) => {
        resolve(results);
      });
    });
  }
  
  function updateDatabase(connection, data){
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET ? WHERE email = ?`, [data, data.email], (error, results, fields) => {
        resolve(results);
      });
    });
  }

  function deleteFromDatabase(connection, email){
    return new Promise((resolve, reject) => {
      connection.query(`DELETE from users WHERE email = ?`, email, (error, results, fields) => {
        resolve(results);
      });
    });
  }
  
  function handleReadFromMySQL(agent){
    const user_email = agent.parameters.email;
    return connectToDatabase()
    .then(connection => {
      return queryDatabase(connection)
      .then(result => {
        console.log(result);
        result.map(user => {
          if(user_email === user.email){
            agent.add(`First Name: ${user.first_name} and Last Name: ${user.last_name}`);
          }
        });        
        connection.end();
      });
    });
  }

  function handleWriteIntoMysql(agent){
    const data = {
      first_name: "test",
      last_name: "user",
      email: "sample@email.com"
    };
    return connectToDatabase()
    .then(connection => {
      return insertIntoDatabase(connection, data)
      .then(result => {
 		agent.add(`Data inserted`);       
        connection.end();
      });
    });
  }
  
  function handleUpdateMysql(agent){
    const data = {
      first_name: "Anshul",
      last_name: "Random",
      email: "sample@email.com"
    };
    return connectToDatabase()
    .then(connection => {
      return updateDatabase(connection, data)
      .then(result => {
 		agent.add(`Data updated`);       
        connection.end();
      });
    });
  }
  
  function handleDeleteFromMysql(agent){
    const email = "sample@email.com";
    return connectToDatabase()
    .then(connection => {
      return deleteFromDatabase(connection, email)
      .then(result => {
 		agent.add(`Data deleted`);       
        connection.end();
      });
    });
  }


  let intentMap = new Map();
  intentMap.set('getDataFromMySQL', handleReadFromMySQL);
  intentMap.set('writeDataIntoMysql', handleWriteIntoMysql);
  intentMap.set('updateMysql', handleUpdateMysql);
  intentMap.set('deleteFromMysql', handleDeleteFromMysql);
  agent.handleRequest(intentMap);