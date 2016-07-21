var express = require('express'),
    app = express()

var port = process.env.PORT || 8080

app.use('/javascript/', express.static(__dirname + '/javascript'))
app.use('/templates/', express.static(__dirname + '/templates'))
app.use('/public/', express.static(__dirname + '/public'))

// start app
app.listen(port)
console.log(' Server started on port ' + port)

module.exports.getApp = app