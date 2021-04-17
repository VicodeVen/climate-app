const express = require ('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

const routes = require('./routes/index')


//Settings
app.set('port', process.env.PORT || 3000)

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')


//middlewares 

app.use((req,res,next) => {
	console.log(req.url, '-' , req.method)
	next()
})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}))



//routes
app.use(routes)


//Static files
app.use(express.static(path.join(__dirname, 'public')))




//Start the server
app.listen(app.get('port'), () => {
	console.log('Servidor corriendo en', app.get('port'))
})














