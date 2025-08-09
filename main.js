//Example script

DeltaTime.framerate = 60;

let x = 0;
let y = 0;
let u = 0;
let v = 0;

Teletype.out_sw(["","Teletype test !!! !!! \n",""]);

Graphics.fill([250,20,35]);
Graphics.background();    

var X = 0;
var SPEED = 2;

var inprompt = new PromptStream();

function frameUpdate(){
    for(let i=0;i<2*SPEED;i++){
    //x += 2*50*Math.random()/DeltaTime.GetDeltaTime();
    //y += 2*50*Math.random()/DeltaTime.GetDeltaTime();
    let r = Math.random()*2*Math.PI;
    u += Math.cos(r)/DeltaTime.GetDeltaTime();
    v += Math.sin(r)/DeltaTime.GetDeltaTime();
    x = (u*DeltaTime.GetDeltaTime() + x + Graphics.width) % Graphics.width;
    y = (v*DeltaTime.GetDeltaTime() + y + Graphics.height) % Graphics.height;
    Graphics.autoresize();
    Graphics.fill([255*X,255*X,255*(1-X)]);
    X = 1 - X;
    Graphics.circle([x,y],15);
    Graphics.text('Graphics is working.',[Graphics.width/2,Graphics.height/2]);
    u = (-DeltaTime.GetDeltaTime()*0.01 + 1) * u;
    v = (-DeltaTime.GetDeltaTime()*0.01 + 1) * v;
    }

    DeltaTime.Update(); //keep track of time delta

    //Teletype.out_sw(["",Keyboard.stdflush(),""]);
    inprompt.Update();
    Teletype.set_post(inprompt.file);
    Teletype.set_curoff(inprompt.curoff);
}

setInterval(frameUpdate, 1000/DeltaTime.framerate); //run frameUpdate (DeltaTime.framerate === 60) times per second (1000 milliseconds)
