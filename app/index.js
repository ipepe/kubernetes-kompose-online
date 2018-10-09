'use strict';

// Imports
const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');

// Constants
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Application

app.post('/api/kompose', function(req, res){
    res.type('application/json');
    res.status(422);

    var workdir = '/tmp/' + Date.now() + Math.floor((Math.random() * 9999) + 1) + '/';

    fs.mkdirSync(workdir);

    if(req.body.input && req.body.input.length){
        fs.writeFileSync(workdir + 'input.yml', req.body.input);
        exec('kompose convert -f input.yml', { cwd: workdir }, (error, stdout, stderr) => {
            if (error){
                console.error('Kompose stderr:', error);
            }
            if(stderr && stderr.length){
                res.status(201);
                var outputs = {'stdout.log': stdout + stderr};

                fs.readdirSync(workdir).forEach(function(file_name){
                   if(file_name !== 'input.yml'){
                       outputs[file_name] = fs.readFileSync(workdir + file_name).toString();
                   }
                });

                res.send({outputs: outputs})
            }else{
                res.send({error: true})
            }
            exec('rm -rf ' + workdir);
        });
    }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
