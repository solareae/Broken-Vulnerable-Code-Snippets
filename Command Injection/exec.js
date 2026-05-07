const express = require('express');
const router = express.Router()

const { exec, spawn }  = require('child_process');


router.post('/ping', (req,res) => {
    const url = req.body.url;
    // Validate input is a valid hostname/IP (alphanumeric, dots, hyphens only)
    if (!url || !/^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/.test(url)) {
        return res.send('error');
    }
    const pingProcess = spawn('ping', ['-c', '1', url]);
    pingProcess.on('close', (code) => {
        if (code !== 0) {
            return res.send('error');
        }
        res.send('pong')
    })
    
})

router.post('/gzip', (req,res) => {
    exec(
        'gzip ' + req.query.file_path,
        function (err, data) {
          console.log('err: ', err)
          console.log('data: ', data);
          res.send('done');
    });
})

router.get('/run', (req,res) => {
   let cmd = req.params.cmd;
   runMe(cmd,res)
});

function runMe(cmd,res){
//    return spawn(cmd);

    const cmdRunning = spawn(cmd, []);
    cmdRunning.on('close', (code) => {
        res.send(`child process exited with code ${code}`);
    });
}

module.exports = router
