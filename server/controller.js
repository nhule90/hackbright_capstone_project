// function to generate a random Integer between min and max (including)
function getRandomInt(min,max) {
    return Math.floor(min+Math.random() * (max+1-min));
  }
const nucleotides = ['A','C','G','T']
function getRandomDNA(){
    var strand = []
    for (let i=0;i<=getRandomInt(3,6);i++){
        strand.push(nucleotides[getRandomInt(0,3)])
      }
    return strand.join('')   
}
// dnaSample  = getRandomDNA() 
// console.log(dnaSample)
function complementaryDNA(str) {
    return str.split('').map(l => l === 'A' ? 'T' : l === 'T' ? 'A' : l === 'G' ? 'C' : l === 'C' ? 'G' : '').join('');
}
// console.log(complementaryDNA(dnaSample))

function calculateHydrogenBonds(str){
    let strArr = str.split('')
    let totalBonds = ['A','T'].reduce((total,nuc) => total + strArr.filter((nucl) => nucl === nuc)
    .reduce((sum,_) => sum + 2,0),0 )
    totalBonds += ['G','C'].reduce((total,nuc) => total + strArr.filter((nucl) => nucl === nuc)
    .reduce((sum,_) => sum + 3,0),0 )
    return totalBonds
}
// console.log(calculateHydrogenBonds(dnaSample))
data = []
for (let j=0;j<=14;j++){
    // console.log(j)
    let dnaSample  = getRandomDNA()
    // console.log(dnaSample)
    let comp = complementaryDNA(dnaSample)
    let hydBonds = calculateHydrogenBonds(dnaSample)
    let sqlString = `('${dnaSample}','${comp}','${hydBonds}')`
    data.push(sqlString)
}
// console.log(data.join(', '))

require('dotenv').config()
console.log(process.log)
const {CONNECTION_STRING} = process.env
console.log(CONNECTION_STRING)
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            drop table if exists users;
            drop table if exists questions;
            drop table if exists scores;

            create table users (
                id serial primary key, 
                name varchar
            );

            create table questions (
                id serial primary key,
                strand varchar,
                complementary varchar,
                hydrogen_bonds int
            );
            create table scores (
                id serial primary key,
                user_id int,
                question_id int,
                score int
            );

            insert into questions (strand,complementary,hydrogen_bonds)
            values ${data};
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },
    getQuestions: (req, res) => {
        sequelize.query(`select * from questions;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }, 
    getQuestionIds: (req, res) => {
        sequelize.query(`select distinct id from questions;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }, 
    createQuestion: (req, res) => {
        let {strand,comp,hydBonds} = req.body
        sequelize.query(`insert into questions (strand,complementary,hydrogen_bonds)
        values ('${strand}','${comp}','${hydBonds}')
        ;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }, 
    updateQuestion: (req, res) => {
        const { id } = req.params;
        const { strand,comp,hydBonds } = req.query;
        sequelize.query(`update questions set strand='${strand}',complementary='${comp}',hydrogen_bonds=${hydBonds} where id='${id}'
        ;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },  
    deleteQuestion: (req, res) => {
        console.log(req.params)
        let {id} = req.params
        sequelize.query(`delete from questions where id = ${id};`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }, 
}