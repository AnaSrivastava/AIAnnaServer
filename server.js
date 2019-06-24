const express=require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors =require('cors');
const saltRounds=10;
const knex = require('knex');
const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'psql',
      database : 'aianna'
    }
  });

const app=express();

app.use(bodyParser.json());
app.use(cors());

app.post('/login',(req,res)=>{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json("User Not Found");
        }
         db.select('email','hash').from('login').where(
                'email','=',email
            ).then(user=>{
                {
                console.log("adsasdfg");
                const isValid=bcrypt.compareSync(password, user[0].hash);
                if(isValid){
                    console.log("pooiuuuytt");
                   return db('users').where( 'email','=', email )
                        .increment('entries',1)
                        .returning(['entries','name'])
                        .then(response1=>{
                            res.status(200).json(response1[0])
                        }).catch(err=>{res.json("Wrong Credentials")})
                } 
                else{
                         console.log("ghjgfhjfghf");
                        return res.status(400).json("User Not Found");
                     }
            }
                
            })
 })

 app.post('/signup',(req,res)=>{
    const { name,email,password }=req.body;
    if(!email || !password || !name)
    {
      return  res.status(400).json("unable to register");
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        }).into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users').insert({
                name:name,
                email:loginEmail[0],
                joined:new Date,
            }).then(user=>{
                res.json("WOOHOO");
            })
        }).then(trx.commit)
        .catch(trx.rollback)
    }).catch(err=>res.status(400).json("unable to register"))
     
 })

 app.listen(3000,()=>{console.log("Server Listening");})