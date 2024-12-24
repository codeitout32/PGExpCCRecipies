require('dotenv').config()
var express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cons = require('consolidate'),
dust = require('dustjs-helpers'),
pg = require('pg'),
app = express();

const dbConfig = {
    user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
}

const connect = async () => {
    const { Client } = pg
    const client = new Client(dbConfig)
    await client.connect()
    
    try {
        const res = await client.query('SELECT * from recipies')
        client.end()
        return res
    } catch (error) {
        console.log('error call', error);
        client.end()
        
    }
   
   // console.log(res.rows[0].message) // Hello world!
    // await client.end()
    
    console.log('running');
}
const add = async (request) => {
    const { Client } = pg
    const client = new Client(dbConfig)
    await client.connect()
    
    try {
        const res = await client.query('INSERT INTO recipies(name, ingredients, directions) VALUES($1, $2, $3)', [request.body.name, request.body.ingredients, request.body.directions])
        client.end()
        return res
    } catch (error) {
        console.log('error call', error);
        client.end()
        
    }
   
   // console.log(res.rows[0].message) // Hello world!
    // await client.end()
    
    console.log('running');
}

connect()



app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//set puvblic folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    // console.log("Test");
    connect().then((res1) => {

        console.log('res1', res1);
        res.render('index', {recipes: res1.rows});

    })
})

app.post('/add', function(req,res) {
    // debugger;
    console.log('add req', req);
    add(req).then(res2 => {
        console.log('add success', res2)
        res.redirect('/')
    })
    // res.redirect('/')
})



const { Client } = pg
const myClient = new Client(dbConfig)
app.delete('/delete/:id', function(req,res) {
    // debugger;
    console.log('add req', req);
    myClient.connect().then(() => {
        myClient.query('DELETE FROM recipies WHERE id = $1', [req.params.id])
    }).then(() => {
        myClient.end;
                res.send(200);
    }).catch(e => console.log('error', e))
    // add(req).then(res2 => {
    //     console.log('add success', res2)
    //     res.redirect('/')
    // })
    // res.redirect('/')
})
app.post('/edit', function(req,res) {
    // debugger;
    console.log('add req', req);
    myClient.connect().then(() => {
        myClient.query('UPDATE recipies SET name =$2, ingredients=$3, directions=$4 WHERE id = $1', [req.body.id, req.body.name, req.body.ingredients, req.body.directions])
    }).then(() => {
        myClient.end;
                res.redirect('/');
    }).catch(e => {
        console.log('error', e);
        myClient.end;
    })
    
})


 

//server
app.listen(3000, function(){
    console.log('Server started in port 3000', dbConfig);

})