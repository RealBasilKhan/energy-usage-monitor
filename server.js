let express = require("express");
let app = express();

app.use(express.json());

let port = 3000;
let hostname = "localhost";

let energyUse = {};



app.post("/api/:id", function(req, res){
	let deviceId = req.params.id;
	let stringId = String(deviceId);
	const incomingUsage = req.body;
	if (
		(incomingUsage.hasOwnProperty("energy-usage")) && 
		(incomingUsage["energy-usage"] == parseInt(incomingUsage["energy-usage"]))){
		res.setHeader('content-type', 'text/plain');
		res.status(200).send()
		if (energyUse.hasOwnProperty(stringId)){
		let energyArray = energyUse[stringId];
		energyArray.push(incomingUsage["energy-usage"]);
	}
	else {
		energyUse[stringId] = [incomingUsage["energy-usage"]];
	};
		
	}
	else {
		res.setHeader('content-type', 'text/plain');
		res.status(400);
		res.send("Invalid Request");
	}
});

app.get("/api/:id", function(req, res){
	let deviceId = req.params.id;
	let stringId = String(deviceId);
	if (energyUse.hasOwnProperty(stringId)){
		res.status(200);
		let returnKey = "total-energy-usage"
		let returnJson = {}
		returnJson[returnKey] = energyUse[stringId];
		res.json(returnJson);
	}
	else {
		res.setHeader('content-type', 'text/plain');
		res.status(404).send("Device Not Found");
	}

});

app.get("/", function(req, res){
let result = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Energy Company</title></head><body>'
result = '<table style="border:1px solid black;border-collapse:collapse;width:150px !important;"><tr><th>Device ID</th><th>Energy Usage</th></tr>';
result += '<tr>'
for (var obj in energyUse){
var sum =  energyUse[obj].reduce(function(a, b){
        return a + b;
    }, 0);
if (sum > 1000){
  result += '<tr style="background-color:red;"><td>' + obj + '</td>'
  result += '<td>' + energyUse[obj].toString() + '</td></tr>'
  }
else {
    result += '<tr><td>' + obj + '</td>'
  result += '<td>' + energyUse[obj].toString() + '</td></tr>'
}
  }
result += '</table></body></html>'
res.setHeader('Content-type','text/html')
res.send(result);
});


app.listen(port, hostname, () => {console.log(`Listening at: http://${hostname}:${port}`);
});