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
// Admin verification
const showSetting = document.getElementById("showSetting")
const divQuestion = document.getElementById("questionSetting")
const divVerification = document.getElementById("adminVerification")
const showSettingFunc = () => {
    var input= document.getElementById("adminPassword").value
    console.log(input)
    if (input === 'admin'){
        console.log('Unhide')
        divQuestion.className='unhidden'
        divVerification.className='hidden'
    }
    }
showSetting.addEventListener('click', showSettingFunc)

// Show questions
const showBtn = document.getElementById("showButton")
const questionListContainer = document.querySelector('#question-list')
const questionTable = document.getElementById("questionTable");
const showQuestion = () => {
    axios.get("http://localhost:4004/api/questions/")
        .then(res => {
            createListCard(res.data)
            })
        .catch(err => {
            console.log(err)
            alert('Uh oh. Your request did not work.')
            // alert(res.data)
            })
        ;
};

function createListCard(data) {
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
    data.forEach( item => {
        let row = questionBody.insertRow();
        for (let j = 0; j<keyNames.length;j++) {
            var cell = row.insertCell(j)
            cell.innerHTML = item[keyNames[j]]
        }
    });
    // check if table is already exist
    if (questionTable.getElementsByTagName('tbody').length >0) {
        questionTable.replaceChildren(...[questionHeader,questionBody])
    }
    else {
        questionTable.appendChild(questionHeader)
        questionTable.appendChild(questionBody)
    }
}

showBtn.addEventListener('click', showQuestion)

// Add a strand
//creates the card for adding a fortune
const addBtn = document.getElementById("addButton")
const addQuestion = () => {
    var newStrand = document.getElementById('newStrand').value.toUpperCase()
    // check if the new strand is a DNA sequence
    invalidChars = newStrand.split('').filter((nucl)=>(!(nucleotides.includes(nucl))))
    // console.log(invalidChars)
    if (invalidChars.length === 0) {
        axios.post("http://localhost:4004/api/questions/",{
            strand: newStrand,
            comp: complementaryDNA(newStrand),
            hydBonds: calculateHydrogenBonds(newStrand)
        })
        .then(res => {
            alert('Submitted')
            showQuestion()
            })
        .catch(err => {
            console.log(err)
            alert('Uh oh. Your request did not work.')
            })
        ;
        }
    else {alert('It is not a DNA sequence!')}
};
addBtn.addEventListener('click', addQuestion)

// Feature 4
//creates the card for deleting a fortune
const deleteBtn = document.getElementById("deleteButton")
const deleteQuestion = () => {
    var id = document.getElementById('deleteQuestionId').value
    if (confirm(`Are you sure you want to delete the strand id ${id}?`)) {
        axios.delete(`http://localhost:4004/api/questions/${id}`)
        .then(res => {
            showQuestion()
            alert('Deleting Completed!')
            })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
            })
        ;
      } else {
        console.log('User cancelled the deletion');
      }
    
};
deleteBtn.addEventListener('click', deleteQuestion)
  
//creates the card for updating a fortune
const updateBtn = document.getElementById("updateButton")
const updateQuestion = () => {
    var id = parseInt(document.getElementById('updateQuestionId').value)
    var newStrand = document.getElementById('updateStrand').value.toUpperCase()
    // check if the new strand is a DNA sequence
    invalidChars = newStrand.split('').filter((nucl)=>(!(nucleotides.includes(nucl))))
    // console.log(invalidChars)
    if (invalidChars.length > 0) {alert('It is not a DNA sequence!')}
    else {
        // check if id is in the database
        axios.get("http://localhost:4004/api/questionids/")
        .then(res => {
            var idList = res.data
            idList = idList.map(a => a.id)
            // console.log(idList,id)
            // console.log((idList.includes(id)))
            if (!(idList.includes(id))) {alert('Id is not found!')}
            else {
                axios.put(`http://localhost:4004/api/questions/${id}`,
            {},
            {
            params: {strand: newStrand,
            comp: complementaryDNA(newStrand),
            hydBonds: calculateHydrogenBonds(newStrand)
            }}
        )
        .then(res => {
            console.log(res)
            alert('Updating completed!')
            showQuestion()
            })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
            })
        ;
            }
            })
        .catch(err => {
            console.log(err)
            alert('Uh oh. Your request did not work.')
            })
        ;
        }
};
updateBtn.addEventListener('click', updateQuestion)