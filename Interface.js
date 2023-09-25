var MaximumLines = Math.round(screen.availWidth/33.4);
var MaximumRows = Math.round(screen.availHeight/34.5);
var Lines = 30;
var Rows = MaximumRows;
var DistanceXbetweenGrids=17*2;
var DistanceYbetweenGrids=17*2;
var BoxWidth = 15*2;
var BoxHeight = 15*2;
var TakenFromFullSc = Math.floor((MaximumLines-Lines)/2)//full screen is 28 lines, to make the Grid on the middle of the screen we must know how many Lines were taken
var ObjectsArray = [];
var Floors = 1//how many Rows that are floors 
var TimeToCreate = 1.2;
var TimeToFall =0.1;
var TimeToMove =0.03;
var bonusLines=5;
var bonusRows=3;
var score=0;
var lastscore;
var emptyPlaceForNewBlock=true;
var ColorForObjects = "Red"
var ColorForBG = "Violet"
var ColorForFloor = "Blue"
var StateOfKeyboard=null;
var FirstOnFloorINDX = (Lines*Rows)-(Lines*Floors)
var StateOfKeyboard;
var FirstLine=[]
var lastInterval;
var atBordersRight=[];
var atBordersLeft=[];//borders to the right decrease every value by one and you'll get the borders to the left
var DeadBlocks=[];
(function(){
    for (var i = 1; i <= Rows; i++) {
        var calcu = (Lines)*i
        atBordersRight.push(calcu)
        atBordersLeft.push(calcu-1)
    }
    for(var n =Lines*3;n<=Lines*6-1;n++){//the game ends if there is a block between line 3-5
        FirstLine.push(n)
    }
}())


document.onkeydown=function(key){
    if(key.keyCode==37){ 
        StateOfKeyboard=1//left is 1 zero is right
    }else if (key.keyCode==39){
        StateOfKeyboard=0//right
    }
}

document.onkeyup=function(key){
//left:37/right:39
if(key.keyCode==37||key.keyCode==39)
    StateOfKeyboard=null
}
function accessArray(LineMinus1, Row) {//A way to make a 1d array like a 2d on its gonna make everything a lot easier, this is how to access its elements
    return (LineMinus1 * Lines) + Row
}
var Grid = new Array(Rows * Lines)//we make the whole game mathematically then we draw it, this is the grid array
for(var i=0;i<Grid.length; i++){
    if (i<FirstOnFloorINDX) {
        Grid[i]=1//////////////////empty the spaces
    }
    else if(i>=FirstOnFloorINDX&&i<Grid.length){
        Grid[i]=2
        
    }
}
function ReachedTop(func){
    if(FirstLine.some(
    function(x){
         return (Grid[x]==2)                              
    })){console.log("GAMEOVER")
        func()}
}
function constructGrid(Lines, Rows) {//first draw of the grid system, then will just change the colors of the grid boxes to represent movement
    var middleL = screen.width / 2
    var middleT = (screen.height / 2)
    var arr = []

    for (var y = 0; y < Lines; y++) {
        for (var x = 0; x < Rows; x++) {
            var div = document.createElement("div")
            div.className = "Grid"
            div.style.width = BoxWidth+"px"
            div.style.height = BoxHeight+"px"
            div.style.left = (x * DistanceXbetweenGrids+TakenFromFullSc*BoxWidth) + "px"//Stuck at the middle
            div.style.top = (y * DistanceYbetweenGrids-100) + "px"//-100 so the construction starts 2 blocks up the screen giving the player more time to think
            // document.body.appendChild(div)
            arr.push(div)

        }
    }
    return arr
}

function lookDown(AnArray){
    return AnArray.every(function(x){return Grid[x+Lines]!=2})
}
function lookLR(Bottom){
    var Further;
    var lesser;
    var left=false;//intially cant
    var right=false;
    Bottom.reduce(function(a,b){
        return Further = Math.max(a,b)
    })
    Bottom.reduce(function(a,b){
       return lesser = Math.min(a,b)
    })
    if(isIn(atBordersLeft,lesser-1)){
        left = false
         
    }else{ left = true

    }
     if(isIn(atBordersRight,Further+1)){
        right = false
        
    }else{ right = true

    }
     if(Grid[Further+1]==2){
        right=false
     }
     if(Grid[lesser-1]==2){
        console.log("Cantweqwe")
        left=false
     }

    return {
        right : right,left:left
    }
}

function CreateBlock(SomewhereOnTheGrid){
 var ran = Math.round(Math.random()*4)
    switch (ran) {
    case(0)://we make the Block top to bottowm, this is shape l but flipped
    this.GridPlaceHolder=["darkred",SomewhereOnTheGrid,SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines*2,SomewhereOnTheGrid+Lines*2-1]// make an array that has index on the Grid array
    this.BottomElements=[SomewhereOnTheGrid+Lines*2,SomewhereOnTheGrid+Lines*2-1]
    break;
    case(1):
    this.GridPlaceHolder=["indianred",SomewhereOnTheGrid,SomewhereOnTheGrid-1,SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines-1]
    this.BottomElements=[SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines-1]
    break;
    case(2):
    this.GridPlaceHolder=["blueviolet",SomewhereOnTheGrid,SomewhereOnTheGrid-1,SomewhereOnTheGrid-2,SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines-1,SomewhereOnTheGrid+Lines-2]
    this.BottomElements=[SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines-1,SomewhereOnTheGrid+Lines-2]
    break;
    case(3):
    this.GridPlaceHolder=["cadetblue",SomewhereOnTheGrid,SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines*2,SomewhereOnTheGrid+Lines*2-1,SomewhereOnTheGrid+Lines*2-2]
    this.BottomElements=[SomewhereOnTheGrid+Lines*2,SomewhereOnTheGrid+Lines*2-1,SomewhereOnTheGrid+Lines*2-2]
    break;
    case(4):
    this.GridPlaceHolder=["darkmagenta",SomewhereOnTheGrid,SomewhereOnTheGrid+Lines,SomewhereOnTheGrid+Lines*2]
    this.BottomElements=[SomewhereOnTheGrid+Lines*2]
    break;
  }

    this.GridPlaceHolder.forEach(function(x,i,a){//we represent this object on the Grid
        if(typeof a[i] =="number" )
            Grid[a[i]] =3  //three numbers representing the box 1:Empty, 2:NotAllowed, 3:Used
        })
    this.Destroyed = false
    this.destroyMe=function(){
        this.GridPlaceHolder.forEach(function(x,i,a){
        if(typeof a[i] =="number" )
            Grid[a[i]] =1  
        })
    }
    this.moveDown = function(){
        
        var PHlength = this.GridPlaceHolder.length
        if(lookDown(this.BottomElements)==true){
            for(var i=1;i<PHlength;i++){ //reset the places the box take
                Grid[this.GridPlaceHolder[i]] = 1
            }
            for(var i=1;i<PHlength;i++){ //We assign the new values 
                this.GridPlaceHolder[i]=this.GridPlaceHolder[i]+Lines
                Grid[this.GridPlaceHolder[i]] = 3 
            }
            var TEMPOBJ = Object.create(this)//We created a TempObject since we can't access 'this' object in the forEach function 
            var TEMPOBJ = TEMPOBJ.GridPlaceHolder//
            this.BottomElements.forEach(function(x,i,a){
                
                a[i]=TEMPOBJ[PHlength-i-1]//will assign the last elements to the bottomElements according to how many bottom elements there is
            })
            return "Moved"
        }
        else
        return"Can't"//IF THE FUNCTION THAT CALLED MOVE DETECTS "CAN'T" THEN IT WILL FIRE THE METHOD FREEZE AND then DELETE THE OBJECT
        
    }

    this.moveRight= function(){
        if(lookDown(this.BottomElements)==true){
            if(lookLR(this.BottomElements).right == true){
                this.GridPlaceHolder.forEach(
                    function (x,i,a){
                        if(typeof a[i]=="number"){
                            Grid[a[i]]=1
                            Grid[a[i]+1]=3
                            return a[i]++
                        }
                    }
                )
                this.BottomElements.forEach(function(x,i,a){return a[i]++})
            }
            else return "NO "+lookLR(this.BottomElements).right

        }
}
   this.moveLeft= function(){
        if(lookDown(this.BottomElements)==true){
            if(lookLR(this.BottomElements).left == true){
                this.GridPlaceHolder.forEach(
                    function (x,i,a){
                        if(typeof a[i]=="number"){
                            Grid[a[i]]=1
                            Grid[a[i]-1]=3
                            return a[i]--
                        }
                    }
                )
                this.BottomElements.forEach(function(x,i,a){
                    Grid[a[i]]=1
                    Grid[a[i]-1]=3
                    return a[i]--
                })
            }
            else return "NO "+lookLR(this.BottomElements).left

        }
}
    this.Freeze = function(){
         this.GridPlaceHolder.forEach(function(x,i,a){//we "NotAllow" the places on the Grid represented by the OBJECT 
        if(typeof a[i] =="number" )
            Grid[a[i]] =2 
        })
    }
}
function Cleaner(){
    var oldArr = ObjectsArray;
    ObjectsArray = ObjectsArray.filter(function(x){return x.Destroyed==false})
    if(oldArr.length>ObjectsArray){
        oldArr=oldArr.filter(function(x){return x.Destroyed==true})
        oldArr.forEach(function(x,i,a){DeadBlocks.push(a[i])})
        emptyPlaceForNewBlock=true
    }
}
function randomBlock(){
    if(emptyPlaceForNewBlock==true){
        emptyPlaceForNewBlock=false
        score++
        var math = Math.round(Math.random()*Lines-1)//To 14 
         if(math<=1){math=2}
            var Block = new CreateBlock(math) //old and buggy
            ObjectsArray.push(Block)//added to the ObjectsArray
    }
}
function Bonuser(){
    Grid.forEach(function(x,i,a){//i=50
        var HowManyChecked=0;
        var iChecked=[]
        var DeadBlockies=[]
        for(var n =i;n<i+3+(Lines*0);n++){
            if(Grid[n]==2){
                HowManyChecked++
                iChecked.push(n)
            }
        }
        for(var n =i+Lines;n<i+3+(Lines*1);n++){
            if(Grid[n]==2){
                HowManyChecked++
                iChecked.push(n)
            }
        }
        for(var n =i+Lines*2;n<i+3+(Lines*2);n++){///2 iss the lines of bonuses
            if(Grid[n]==2){
                HowManyChecked++
                iChecked.push(n)
            }
        }
        for(var n =i+Lines*3;n<i+3+(Lines*3);n++){///3 iss the lines of bonuses
            if(Grid[n]==2){
                HowManyChecked++
                iChecked.push(n)
            }
        }
        if(HowManyChecked>=12){//////////add a new array called dead blocks then compare it to these then delete the dead blocks
            destry(iChecked)
                  /* iChecked.forEach(function(R,T,D){
                    //Grid[a[i]]=1//NO DON'T DO IT !
                    DeadBlocks.forEach(function(X,I,A){
                        var arrrr = A[I].GridPlaceHolder
                        console.log(arrrr)
                            if(D[T] in arrrr){
                                console.log("its in",arrrr)
                            for(var N=1;N<arrrr;N++){
                                console.log(arrrr[N])
                                DeadBlockies.push(arrrr[N])

                        }
                    }
                    })
                })*/

                   // DeadBlockies.forEach(function(O,K,D){
                     //    Grid[D[K]]=1
                   // })
                   // console.log(DeadBlockies);
                    }

                })
            }
            function destry(erray){
                var ar = []
                erray.forEach(function(x,i,a){
                    for(var n=0;n<DeadBlocks.length;n++){
                        var R=DeadBlocks[n]
                        if(isIn(R.GridPlaceHolder,a[i])){
                             setTimeout(R.destroyMe(),10)

                        }
                    }
                })
            }


function moveAllBlocksLR(){

    if(ObjectsArray.length>0){
        ObjectsArray.forEach(function(x,i,a){
            if(StateOfKeyboard==1){
                a[i].moveLeft()
            }
            else  if(StateOfKeyboard==0){
                a[i].moveRight()
            }
        })
    }
 //  else 
      //  throw new Error("No blocks to move anywhere!")
}
function moveAllBlocksDown(){

    if(ObjectsArray.length>0){
        ObjectsArray.forEach(function(x,i,a){
        if(a[i].moveDown()=="Can't"){//if the object found a Blocker
           a[i].Freeze()
           a[i].Destroyed = true
        }
        })
    }
   // else 
    //    throw new Error("No blocks to move down.")
}
function isIn(arrr,something){
    var Yes = false
    Yes = arrr.some(function(x){
        return x==something
    })
    return Yes
}
//////////////////////////////////////////////////////////HERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRE MIGHT CAUSE PROBLEMS
// function isIn(arrr,something){
//     var Yes = false
//     Yes = arrr.reduce(function(x,y){
//        return x==something||y==something
//     })
// return Yes
// }
function Draw(){
var Blocks = document.getElementsByClassName("Grid")
    Array.prototype.forEach.call(Blocks,function(x,i,a){//because document object doesn't return a real type Array so we gonna have to call the forEach method from the Array's prototype
        if (Grid[i]==1){
            a[i].style.backgroundColor=ColorForBG
        }
        else if (Grid[i]==2){
            a[i].style.backgroundColor=ColorForFloor
        }
        else if (Grid[i]==3){
            var leng = ObjectsArray.length
            for(var n = 0 ; n<leng ; n++){
                //a[i].style.backgroundColor=ObjectsArray[n].GridPlaceHolder[0]
                    if(isIn(ObjectsArray[n].GridPlaceHolder,i)){
                        ObjectsArray[n].GridPlaceHolder.forEach(function(z,y,n){
                            if(y!=0){
                                  Blocks[z].style.backgroundColor=n[0]
                            }
                        })

                    
                    
                }

            }
        }
    })
}

//////////////////////////Now the game Constructor//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Game(){

    document.body.style.background="white"
    Array.prototype.forEach.call(document.body.children,function(x,i,a){
        document.body.removeChild(a[i])
    })
    setTimeout( Array.prototype.forEach.call(document.body.children,function(x,i,a){
        document.body.removeChild(a[i])
    }),1000)
    var arr = constructGrid(Rows, Lines)
    setTimeout(function() {
        arr.forEach(function(_, i, Arrayy) {
            document.body.appendChild(Arrayy[i])
        })
    }, 200)
    randomBlock()
    this.Creator = setInterval(randomBlock,TimeToCreate*1000)
    this.Faller = setInterval(moveAllBlocksDown,TimeToFall*1000)
    this.ArrowMover = setInterval(moveAllBlocksLR,TimeToMove*1000)
    this.Drawer = setInterval(Draw,TimeToFall*100)
    this.Cleaner = setInterval(Cleaner,10)
    this.Bonuser = setInterval(Bonuser,1000)
    lastInterval = this.Cleaner
    this.GAMEOVER = setInterval(ReachedTop.bind(null,function(){
        console.log("GAMEOVER")
        clearInterval(lastInterval-4)
        clearInterval(lastInterval-3)
        clearInterval(lastInterval-2)
        clearInterval(lastInterval-1)
        clearInterval(lastInterval)
        lastscore = score;
        score = 0;
        document.write("<h1><b>GAMEOVER, SCORE :"+lastscore+" </b></h1>")
        clearInterval(lastInterval+2)
        
        setTimeout(()=>document.location.reload(),5000)
    }),10)
}