const tileDisplay= document.querySelector('.tile-container')
const keyboard= document.querySelector('.key-container')
const messageDisplay= document.querySelector('.message-container')

let wordle
const getWordle=()=>{
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json=>{
        wordle = json.toUpperCase()

    }).catch(err=>console.log(err))
}
getWordle()
const keys =[
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<<',
]
const guessRows=[
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','','']
]

let currentRow=0
let currentTile =0
let isGameOver =false

guessRows.forEach((guessRow, guessRowIndex) =>{
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id','guessRow-'+guessRowIndex)
    guessRow.forEach((guess,guessIndex)=>{
        const tileElement= document.createElement('div')
        tileElement.setAttribute('id','guessRow-'+guessRowIndex+'-tile-'+guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
})


keys.forEach(key =>{
    const buttonElement= document.createElement('button')
    buttonElement.textContent=key
    buttonElement.setAttribute('id',key)
    buttonElement.addEventListener('click',() => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (key) =>{

   if(!isGameOver){
    
    if(key=== "<<"){
        deleteLetter()
        return
    }
    if (key === "ENTER"){
        chechRow()
        return
    }
    addLetter(key)
   }
}

const addLetter = (key)=>{
    if (currentTile<5 && currentRow<6){
    const tile = document.getElementById('guessRow-'+currentRow+'-tile-'+currentTile)
    tile.textContent=key
    guessRows[currentRow][currentTile]=key
    tile.setAttribute('data',key)
    currentTile++
    
    }
}

const deleteLetter = () =>{
    if(currentTile>0){
    currentTile--
    const tile = document.getElementById('guessRow-'+currentRow+'-tile-'+currentTile)
    tile.textContent =''
    guessRows[currentRow][currentTile]=''
    tile.setAttribute('data','')
    }
}

const chechRow= ()=>{
    const guess= guessRows[currentRow].join('')
    if (currentTile>4){
        fetch(`http://localhost:8000/check/?word=${guess}`)
        .then(response=>response.json())
        .then(json=>{
            console.log(json)
            if(json=="Entry word not found"){
                showMessage('word not in the list')
            }
            else{
               
                flipTile()
                if(guess==wordle){
                    showMessage('Magnificient')
                    isGameOver=true
                    return
                }else{
                    if(currentRow>=5){
                        isGameOver=true
                        showMessage("Game Over")
                    }
                    if(currentRow<5){
                        currentRow++
                        currentTile=0
                    }
                }
            }
        }).catch(err => console.log(err))
        
      
    }
}
const showMessage=(message)=>{
    const messageElement = document.createElement('p')
    messageElement.textContent= message
    messageDisplay.append(messageElement)
    setTimeout(()=> messageDisplay.removeChild(messageElement),2000)
}
const addColorToKey = (keyLetter,color)=>{
    const keyed= document.getElementById(keyLetter)
    keyed.classList.add(color)

}
const flipTile=()=>{
    const rowTiles= document.querySelector('#guessRow-'+currentRow).childNodes
    let checkWordle=wordle
    const guess=[]
    rowTiles.forEach((tile,index)=>{
        const dataLetter= tile.getAttribute('data')
        rowTiles.forEach(tile =>{
            guess.push({letter: tile.getAttribute('data'),color:'grey-overlay'})

        })
        guess.forEach((guess, index)=>{
            if(guess.letter==wordle[index]){
                guess.color='green-overlay'
                checkWordle=checkWordle.replace(guess.letter,'')
            }
        })
        guess.forEach(guess=>{
            if(checkWordle.includes(guess.letter)){
                guess.color='yellow-overlay'
                checkWordle=checkWordle.replace(guess.letter,'')
            }
        })
        setTimeout(()=> {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter,guess[index].color)
      
        },400*index)
    })
}
