const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(bodyParser.json());

jsonData = {data :[{
  room: 'Livingroom',
  devices: [{name: 'F500', type: 'heater', data: {temperature: '21'}},
            {name: 'LED100', type: 'light', data: {state: false}}],
}, {
  room: 'Bedroom',
  devices: [{name: 'LED150', type: 'light', data: {state: true}}]
}]};

app.get('/api/getDevices', (req,res) => {
    res.json(jsonData);
    console.log('Sent list of devices');
});

app.get('/api/changeTemp', (req,res) => {
  let room = req.query.room;
  let device = req.query.device;

  jsonData.data[room].devices[device].data.temperature = req.query.value;
  res.json({temperature: jsonData.data[room].devices[device].data.temperature});
  console.log('Updated temperature');
});

app.get('/api/changeLight', (req,res) => {
  let room = req.query.room;
  let device = req.query.device;

  jsonData.data[room].devices[device].data.state = !jsonData.data[room].devices[device].data.state;
  res.json({state: !!jsonData.data[room].devices[device].data.state});
  console.log('Updated light');
});

app.get('/api/addRoom', (req,res) => {
  let room_name = req.query.room_name;

  jsonData.data.push({room: room_name, devices:[]});
  res.json({state: 'success'});
  console.log('Added a room');
});

app.get('/api/addDevice', (req,res) => {
  let room = req.query.room;
  let type = req.query.type;
  let name = req.query.name;

  if (type == 10){
    jsonData.data[room].devices.push({name: name, type: 'heater', data: {temperature: '15'}});
  }
  else if(type == 20){
    jsonData.data[room].devices.push({name: name, type: 'light', data: {state: false}});
  }

  res.json({state: 'success'});
  console.log('Added a device');
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