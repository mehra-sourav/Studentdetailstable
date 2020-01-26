var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

//Development connection
// var connection = mysql.createConnection({

//     host:"localhost",
//     user:"test1",
//     password:"test1",
//     database:"newtonschool"
// });

//Remote DB connection
//If DB gets offline fix it from https://remotemysql.com/
var connection = mysql.createConnection({

    host:"remotemysql.com",
    user:"ScNNsO4vw0",
    password:"LAnHu7OXxw",
    database:"ScNNsO4vw0"
});

connection.connect((error) => {
    if(error)
        console.log("Oops... Something went wrong");
        // console.log(error)
    else
    {
        console.log("Connected to DB!!")

    }
    
});

// app.use(express.static(path.join(__dirname,'index.js')));
app.use(express.json());
// app.use(express.urlencoded());

app.use(express.static("public"))

app.get('/',function(req,res){
    // console.log("in GET")
    res.sendFile(path.resolve(__dirname+"/index.html"));
})

app.post('/',urlencodedParser, function(req,res){
    // console.log("in POST");
    // console.log(req.body);
    let sql = `INSERT INTO Student VALUES (${req.body.id},"${req.body.name}",${req.body.age},${req.body.year},"${req.body.gender}");`
    let data =  JSON.parse(JSON.stringify(req.body))
    let table = entrytostring(data);
    // console.log(data)
    connection.query(sql,(err,result) => {
        if(err)
        {
            if(err.code == "ER_DUP_ENTRY")
            {
                res.send(err.sqlMessage)
            }
            // else
                // res.send(err)
        }
        res.send("<h3 style='text-align:center;'>1 entry added</h3>");
        // res.send(table);
    });
});

app.get('/getlatest',function(req,res){
    // console.log("in GETlast")
    let sql = 'SELECT * FROM Student ORDER BY ID DESC LIMIT 1';
    connection.query(sql,(err,result) => {
        if(err)
        {
            if(err.code == "ER_DUP_ENTRY")
            {
                res.send(err.sqlMessage)
            }
        }
        // console.log(result);
    });
})

app.get('/getall',function(req,res){
    // console.log("in GETall")
    let sql = 'SELECT * FROM Student';
    connection.query(sql,(err,result) => {
        if(err)
        {
            if(err.code == "ER_DUP_ENTRY")
            {
                res.send(err.sqlMessage)
            }
            // else
                // res.send(err)
        }
        let tablestart = '<table style="width:100%">'
        let tableend = '</table>'
        let firstrow = '<tr>'+
                            '<th>ID</th>'+
                            '<th>Name</th>'+
                            '<th>Age</th>'+
                            '<th>Year</th>'+
                            '<th>Gender</th>'+
                        '</tr>';
        let content ='';

        result.forEach(element => {
            content = content+'<tr>'+
                        '<td>'+
                            element.ID+
                        '</td>'+
                        '<td>'+
                            element.Name+    
                        '</td>'+
                        '<td>'+
                            element.Age+
                        '</td>'+
                        '<td>'+
                            element.Year+
                        '</td>'+
                        '<td>'+
                            element.Gender+
                        '</td>';
        });
        tablestart= tablestart+firstrow+content+tableend;
        res.send(tablestart);
    });
});

app.post('/search',urlencodedParser,function(req,res){
    // console.log(req.body);
    // console.log("IN search");
    let sql = `SELECT * FROM Student WHERE ID=${req.body.id}`;
    connection.query(sql,(err,result) => {
        if(err)
        {
            if(err.code == "ER_DUP_ENTRY")
            {
                res.send(err.sqlMessage)
            }
        }
        if(result=="")
        res.send("<h3 style='text-align:center;'>No Such Entry</h3>");
        else
        {
            // console.log(result);
            let h = '<h3 style="text-align:center;">1 Result Found'+'<br/><br/>';
            let tablestart = '<table style="width:100%">'
            let tableend = '</table>'
            let firstrow = '<tr>'+
                                '<th>ID</th>'+
                                '<th>Name</th>'+
                                '<th>Age</th>'+
                                '<th>Year</th>'+
                                '<th>Gender</th>'+
                            '</tr>';
            let td ='<td style="text-align: center;">';
            let content = '<tr>'+
                            td+result[0].ID+'</td>'+
                            td+result[0].Name+'</td>'+
                            td+result[0].Age+'</td>'+
                            td+result[0].Year+'</td>'+
                            td+result[0].Gender+'</td>'+
                            '</tr>'
            tablestart= h+tablestart+firstrow+content+tableend;

            res.send(tablestart);

        }
        // res.send(table);
    });
});

app.get('/delete',urlencodedParser,function(req,res){
    // console.log("In delete")
    // console.log(req.query)
    let sql = `DELETE FROM Student WHERE ID=${req.query.id}`;
    connection.query(sql,(err,result) => {
        if(err)
        {
            if(err.code == "ER_DUP_ENTRY")
            {
                res.send(err.sqlMessage)
            }
        }
        // console.log(result.affectedRows)
        if(result.affectedRows==0)
        res.send("<h3 style='text-align:center;'>No Such Entry</h3>");
        else
            res.send("<h3 style='text-align:center;'>Entry Deleted</h3>");
    });
});





function entrytostring(x)
{
    // console.log("In ent")
    // console.log(x)
    let res = '<table style="width:100%"; text-align:"center">'+
            '<tr>'+
                '<th>ID</th>'+
                '<th>Name</th>'+
                '<th>Age</th>'+
                '<th>Year</th>'+
                '<th>Gender</th>'+
            '</tr>'+
            '<tr>'+
                '<td>'+x.id +'</td>'+
                '<td>'+x.name +'</td>'+
                '<td>'+x.age +'</td>'+
                '<td>'+x.year +'</td>'+
                '<td>'+x.gender +'</td>'+
            '</tr>'+
            '</table>'
    
    return res;
}


// function entrytostring(x)
// {
//     var table = '<table style="width:100%">'+
//             '<tr>'+
//                 '<th>ID</th>'+
//                 '<th>Name</th>'+
//                 '<th>Age</th>'+
//                 '<th>Year</th>'+
//                 '<th>Gender</th>'+
//             '</tr>'+
//             +
//         '</table>'
// }

app.listen(process.env.PORT || 3000);