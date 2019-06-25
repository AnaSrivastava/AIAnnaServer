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
         db.select('email','hash').from('users').where(
                'email','=',email
            ).then(user=>{
              if(user[0]===undefined)
              {
                console.log("ghjgfhjfghf");
               return res.status(400).json("User Not Found");
            }
                console.log("adsasdfg");
                const isValid=bcrypt.compareSync(password, user[0].hash);
                if(isValid){
                    console.log("pooiuuuytt");
                   return db('users').where( 'email','=', email )
                        .increment('entries',1)
                        .returning(['entries','name'])
                        .then(response1=>{
                            res.status(200).json(response1[0])
                        }).catch(err=>{res.status(400).json("Wrong Credentials")})    
                    }
                    else{
                      console.log("ghjgfhjfghf");
                     return res.status(400).json("User Not Found");
                  }
                
            })
 })

 app.post('/signup',(req,res)=>{
    const { name,email,password }=req.body;
    console.log("Before if");
    if(!email || !password || !name)
    {
        console.log("!!!");
      return  res.status(400).json("unable to register!!!");
    }
    console.log("Before hash");
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log(hash);
    db.transaction(trx=>{
    trx.insert({
            name:name,
            email:email,
            hash:hash,
            joined:new Date()
        }).into('users')
        .then(trx.commit)
        .catch( trx.rollback)})
        .then(user=>{
              return  res.status(200).json("WOOHOO");
            }).catch(err=>{return res.status(400).json(err)});
          
 })
app.get('/',(req,res)=>{res.send("Heroku Working")})
 app.listen(process.env.PORT || 3000,()=>{console.log("Server Listening");})