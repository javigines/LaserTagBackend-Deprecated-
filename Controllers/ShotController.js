'use strict'

const Shot = require ('../Models/Shot')
const Match = require ('../Models/Match')
const Users = require ('../Models/User')

function getShots (req, res) {
  Shot.find({}, (err, shots) => {
    if(err) return res.status(500).send({message: `Error while processing request`})
    if(!shots) return res.status(404).send({message: `No shots found`})

    res.status(200).send({shots})
  })
}


function getShot (req,res){
  Shot.find({idEmisor: req.query.idEmisor},(err, shot)=> {
    if(err) return res.status(500).send({message: `Error while processing request`})
    if(!shot) return res.status(404).send({message: `No shots found`})
    res.status(200).send({shot})
  })
}


function createShot (req, res) {
  let shot = new Shot ()
  shot.idEmisor=req.body.idEmisor;
  shot.idReceptor=req.body.idReceptor;

  if(canModify(shot.idEmisor)) {
    shot.save(function (err, userSaved) {
      if(err) res.status(500).send({message: `Error while processing request: ${err}`});
      else{
        console.log(Match.find().sort({time: 1}).limit(1));
        res.status(200).send({message: `Shot created`})
      }
    })
  } else
    res.status(200).send({message: `Match not in progress or user death`})
}


function deleteShot (req, res) {
  let idEmisor = req.body.idEmisor

  if(idEmisor == undefined)
  return res.status(404).send({message: 'Error shot undefined'})

  Shot.findOne({idEmisor: idEmisor}, (err, shots) => {
    if(err) return res.status (500).send({message:`Error while processing request`})
    if(!shots) return res.status(404).send({message: 'Shot not in database'})

    Shot.remove({idEmisor: idEmisor}).exec((err, shotDeleted) => {
      if(err) return res.status(500).send({message: `Error while processing request: ${err}`})
      if(!shotDeleted) return res.status(404).send({message: ''})

      res.status(200).send({message: `Shot deleted`})
    })
  })
}


function deleteAllShot (req, res) {

  Shot.find({}, (err, shots) => {
    if(err) return res.status (500).send({message:`Error while processing request`})
    if(!shots) return res.status(404).send({message: 'Shot not in database'})

    Shot.remove(shots).exec((err, shotDeleted) => {
      if(err) return res.status(500).send({message: `Error while processing request: ${err}`})
      if(!shotDeleted) return res.status(404).send({message: 'Not shot in database'})

      res.status(200).send({message: `All shot deleted`})
    })
  })
}

function canModify(idEmisor) {
  var encontrado = false
  var i = 0

  //Match is live????
  var gun="teams."+i+".idGun"

  Match.findOne({
    "startTime": { $lte: Date.now()},
    "finishTime": { $gte: Date.now()},
    "teams.0.idGun": { $eq: idEmisor}

  }, (err, match) => {
    if(!err && match) {
      encontrado = true

      console.log("test");

      var userId = match.teams.find(o => o.idUser == idEmisor)

      //User is live????
      Users.findOne({_id: userId}, (err, user) => {
        if(err || !user) return false

        if(!user.lp || user.lp <= 0) return false
        //Player is alive
        return true

      })
    }
  })

}

function Decrease (){
  match.find({},(err,match)=>{
    while(!find){
      if(match.team[i].idGun==idReceptor)
      find=true
      else
      i++
    }
    if(i<match.teams.length){
      var id=match.teams[i].idUser
      user.find({_id:id},(err,user)=>{
        user.lp-=damage
      })
    }
  })
}


module.exports = {
  getShots,
  getShot,
  createShot,
  deleteShot,
  deleteAllShot
}
