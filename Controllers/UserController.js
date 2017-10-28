'use strict'

const User = require ('../Models/User')

/*
CODIGOS DE ERROR A APLICAR EN RES.STATUS:
500 - Internal Server Error, fallo del servidor, generalmente es que no se ha podido acceder a la BBDD por lo que sea.
404 - Not found, esto quiere decir que no se encuentra la información (el usuario que se busca no existe).
400 - Forbidden, no se disponen de credenciales para acceder a la info, o ésta es privada.
200 - OK, se devuelve la info solicitada junto con este código.

Hay muchos más, pero no los necesitamos en este caso concreto. Todos los métodos deben tratar estas excepciones.

(Es el único y último comentario
rs que os pongo en español, pero quería asegurarme de que lo entendiérais).
*/
function getUsers (req, res) {
  User.find({}, (err, users) => {
    if(err) return res.status(500).send({message: `Error while processing request`})
    if(!users) return res.status(404).send({message: `No users found`})

    res.status(200).send({ users })
  })
}

function getUser (req, res) {
  let nickName = req.query.nickName
  console.log(nickName)
  User.find({nickName: nickName}, (err, user) => {
    if(err) return res.status (500).send({message:`Error while processing request`})
    if(!user) return res.status(404).send({message: `No user found`});
    console.log(user)
    res.status(200).send({user})
  })
}

function createUser (req, res) {
  let user = new User ()
  user.lp= 100,
  user.nickName= req.body.nickName,
  user.point= 0,
  //user.IdG= null
  console.log(user)
  user.save(function (err, userSaved) {
    if(err) res.status(500).send({message: `Error while processing request: ${err}`});
    else{
      res.status(200).send({message: `User created`})
    }
  })
}


module.exports = {
  getUsers,
  getUser,
  createUser
}
