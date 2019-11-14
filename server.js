const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(bodyParser.json());

app.get('/api/getDevices', (req,res) => {
    res.json({data :[{
        room: 'Livingroom',
        devices: [{name: 'F500', type: 'heater', data: {temperature: '21'}},
                  {name: 'LED100', type: 'light', data: {state: false}}],
      }, {
        room: 'Bedroom',
        devices: [{name: 'LED150', type: 'light', data: {state: true}}]
      }]});
    console.log('Sent list of devices');
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

//  Authentication services

let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' },
             { id: 2, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User' }];

app.post('/users/authenticate/', (req,res) => {
  console.log('Login request');
  let params = req.body;
  let filteredUsers = users.filter(user => {
    return user.username === params.username && user.password === params.password;
  });

  if (filteredUsers.length) {
    let user = filteredUsers[0];
    let responseJson = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
      res.json({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
  } else {
    res.json({error:"Username or password is incorrect"});
  }
});