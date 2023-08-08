// basic functions
// function to generate a random Integer between min and max (including)
function getRandomInt(min,max) {
    return Math.floor(min+Math.random() * (max+1-min));
  }
const nucleotides = ['A','C','G','T']
function getRandomDNA(){
    var strand = []
    for (let i=0;i<=getRandomInt(5,10);i++){
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
// Start the test
const showTestBtn = document.getElementById("startTesting")
const divInitial = document.getElementById("initialSection")
const divTest = document.getElementById("questionSection")
const showTest = () => {
    divTest.className='unhidden'
    // divInitial.className='hidden'
    axios.get("http://localhost:4004/api/questions/")
        .then(res => {
            createListQuestions(res.data)
            })
        .catch(err => {
            console.log(err)
            alert('Uh oh. Your request did not work.')
            })
        ;
    }
const questionList = document.getElementById("questionList");
function createListQuestions(data) {
    // Prepare header
    var questionHeader = document.createElement('thead')
    questionHeader.style.cssText = 'text-align: center;font-weight:bold;background-color: #04AA6D'
    var headerRow = questionHeader.insertRow();
    var keyNames = Object.keys(data[0]);
    // console.log(keyNames)
    for (let i = 0; i<keyNames.length;i++) {
        var cell = headerRow.insertCell(i)
        cell.innerHTML = keyNames[i].toUpperCase()
    }
    var questionBody = document.createElement('tbody')
    var questionNum = 0
    while (questionNum < 5){
        var dataIndex = getRandomInt(0,data.length-1)
        var item = data[dataIndex]
        data.splice(dataIndex,1)
        let row = questionBody.insertRow();
        for (let j = 0; j<keyNames.length;j++) {
            var cell = row.insertCell(j)
            if (j < 2) {
            if (j===0){cell.id = `question_${item[keyNames[j]]}`}
            cell.innerHTML = item[keyNames[j]]
            }
            else {
                inputCell = document.createElement('input')
                inputCell.id = `cell_${item.id}_${keyNames[j]}`
                cell.appendChild(inputCell)
            }
        }
        questionNum++
    }
    ;
    questionList.appendChild(questionHeader)
    questionList.appendChild(questionBody)
}
    
showTestBtn.addEventListener('click', showTest)

// Grading
const showScoreBtn = document.getElementById("finishTesting")
const divScore = document.getElementById("scoreSection")

const showResult = () => {
    divTest.className='unhidden'
    // divInitial.className='hidden'
    showScoreBtn.className='hidden'
    axios.get("http://localhost:4004/api/questions/")
        .then(res => {
            createListAnswers(res.data)
            divScore.className='unhidden'
            })
        .catch(err => {
            console.log(err)
            alert('Uh oh. Your request did not work.')
            })
        ;
    }
const answerList = document.getElementById("answerList");
const userName = document.getElementById("userName");
console.log(userName)
function createListAnswers(data) {
    // Prepare header
    var answerHeader = document.createElement('thead')
    answerHeader.style.cssText = 'text-align: center;font-weight:bold;background-color: #04AA6D'
    var headerRow = answerHeader.insertRow();
    var keyNames = Object.keys(data[0]);
    keyNames.push('SCORE')
    // console.log(keyNames)
    for (let i = 0; i<keyNames.length;i++) {
        var cell = headerRow.insertCell(i)
        cell.innerHTML = keyNames[i].toUpperCase()
    }
    var answerBody = document.createElement('tbody')
    // Get Id list from the question table
    var all_questions = document.querySelectorAll('[id^="question_"]')
    // console.log(all_questions)
    var totalScore = 0
    for (var i=0;i<5;i++){
        var questionId = parseInt(all_questions[i].textContent)
        // console.log(questionId)
        // get anwser
        var all_answers = document.querySelectorAll(`[id^= "cell_${questionId}"]`)
        // console.log(all_answers)
        var compAnswer = all_answers[0].value
        var bondsAnswer = parseInt(all_answers[1].value)
        // console.log(compAnswer,bondsAnswer)
        var item = data.find(x => x.id === questionId)
        let row = answerBody.insertRow();
        var rowScore = 0
        for (let j = 0; j<keyNames.length;j++) {
            var cell = row.insertCell(j)
            if (j < 4){
            cell.innerHTML = item[keyNames[j]]
            }
            else {
                if (item['complementary']===compAnswer){
                    rowScore += 10
                }
                if (item['hydrogen_bonds']===bondsAnswer){
                    rowScore += 10
                }
                cell.innerHTML = rowScore
                if (rowScore < 20){
                    cell.className = 'incorrect'
                }
                else {cell.className = 'correct'}
            }
        }
        totalScore += rowScore
    }
    ;
    var scoreCard = document.createElement('h3')
    scoreCard.innerHTML = `${userName.value}'s score is ${totalScore}`
    answerList.appendChild(answerHeader)
    answerList.appendChild(answerBody)
    answerList.appendChild(scoreCard)
}
showScoreBtn.addEventListener('click', showResult)

const resetBtn = document.getElementById('againTesting')
function refreshPage(){
    window.location.reload();
} 
resetBtn.addEventListener('click',refreshPage)
