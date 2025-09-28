//This file is part of the 08/08/2025 branch of this project. 

class TeletypeObject {
    constructor(etty, ectty, ectty_cur){
        this.tty = etty;
        this.ctty = ectty;
        this.ctty_cur = ectty_cur;

        this.curchar = "\u2588";
        this.tty_pip = ["", "", ""];
        this.doscrolls = true;
        this.hide_stack = [];
        this.curoff = 0;

        this.remember_font = this.tty.style.fontFamily;
    }
    set_curoff(n){
        this.curoff=n;
    }
    clear(){
        this.tty_pip = ["", "", ""];
        this.deadrefresh();
        this.scroll();
    }
    scroll(){
        if(this.doscrolls){
            this.ctty.scrollIntoView({behavior: 'instant', block: 'end'});
        }
    }
    deadrefresh(){
        this.ctty.textContent = this.generateCttyString(this.tty.textContent);
    }
    generateCttyString(s){
        /*let out = s;
        out = out.slice(0,out.length+curoff);
        return out;*/
        return s.slice(0,s.length+this.curoff);
    }
    set_hide(b){
        this.tty.hidden = b;
        this.ctty.hidden = b;
        this.ctty_cur.hidden = b;
    }
    set_hide_push(b){
        this.hide_stack.push(this.tty.hidden);
        this.set_hide(b);
    }
    set_hide_pop(){
        this.set_hide(this.hide_stack.pop());
    }
    out_sw([_pre,_in,_post]){
        this.tty_pip[0] += _pre;
        this.tty_pip[1] += _in;
        this.tty_pip[2] += _post;
        this.refresh();
    }
    set_sw(pip){
        this.tty_pip = pip;
        this.refresh();
    }
    set_pre(s){
        this.tty_pip[0] = s;
        this.refresh();
    }
    set_in(s){
        this.tty_pip[1] = s;
        this.refresh();
    }
    set_post(s){
        this.tty_pip[2] = s;
        this.refresh();
    }
    refresh(){
        this.tty.textContent = this.tty_pip[0] + this.tty_pip[1] + this.tty_pip[2];
        this.ctty.textContent = this.generateCttyString(this.tty.textContent);
        this.ctty_cur.textContent = this.curchar;
        //this.deadrefresh();
        this.scroll();
    }
    out(s){
        this.out_sw(["",s,""]);
    }
    set_font(s){
        this.tty.style.fontFamily = s;
        this.ctty.style.fontFamily = s;
        this.ctty_cur.style.fontFamily = s;
        this.remember_font = s;
    }
}

var Teletype = new TeletypeObject(document.getElementById("tty"),document.getElementById("ctty"),document.getElementById("ctty_cur"));
Teletype.clear();

class GraphicsObject {
    constructor(canvas_element){
        this.canvas = canvas_element;
        this.ctx = canvas_element.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.rem_font = "16px monospace";
        this.isVisible = true;
        this.visibility_stack = [];
    }
    autoresize(){
        if(self.innerWidth === this.width && self.innerHeight === this.height){
            return;
        }
        this.width = this.canvas.width = self.innerWidth;
        this.height = this.canvas.height = self.innerHeight;
    }
    setVisibility(b){
        this.isVisible = !(this.canvas.hidden = !b);
    }
    setVisibility_push(b){
        this.visibility_stack.push(this.isVisible);
        this.setVisibility(b);
    }
    setVisibility_pop(){
        this.setVisibility(this.visibility_stack.pop());
    }
    clear(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    whv(){
        return [this.width, this.height];
    }
    fill([r,g,b]){
        this.ctx.fillStyle = "rgb("+r+" "+g+" "+b+")";
    }
    background(){
        this.ctx.fillRect(0,0,this.width,this.height);
    }
    font(s){
        this.remember_font = s;
        this.ctx.font = s;
    }
    text(s,[x,y]){
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.font = this.remember_font;
        this.ctx.fillText(s,x,y);
    }
    rect([x,y],[w,h]){
        this.ctx.fillRect(x,y,w,h);
    }
    line([x0,y0],[x1,y1]){
        this.ctx.beginPath();
        this.ctx.moveTo(x0,y0);
        this.ctx.lineTo(x1,y1);
        this.ctx.stroke();
    }
    stroke([r,g,b]){
        this.ctx.strokeStyle = "rgb("+r+" "+g+" "+b+")";
    }
    strokeWeight(x){
        this.ctx.lineWidth = x;
    }
    circle([x,y],r){
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, r, r, 0, 0, Math.PI*2);
        this.ctx.fill();
    }
}

var Graphics = new GraphicsObject(document.getElementById("canvas_element"));

class DeltaTime {
    static last = Date.now();
    static framerate; //just so that you can keep track of it easily, it can't be changed by any method right now
    static Update(){
        this.last = Date.now();
    }
    static GetDeltaTime(){
        return Date.now() - this.last;
    }
}

class Keyboard {
    static keybuffer = [];
    static wasbs = 0;
    static keybuffer_backlog;
    static kbpush(e){
        this.keybuffer.push(e.key);
    }
    static flush(KeyHandler){ //ex: str += Keyboard.flush((s) => Tools.StdKeyHandler((specstr) => "", s));
        let out = "";
        this.keybuffer_backlog = [];
        for(let i=0;i<this.keybuffer.length;i++){
            out += KeyHandler(this.keybuffer[i]);
        }
        this.keybuffer = [...this.keybuffer_backlog];
        return out;
    }
    static stdflush(){
        let out = "";
        this.keybuffer_backlog = [];
        for(let i=0;i<this.keybuffer.length;i++){
            out += Tools.StdKeyHandler((specstr) => "", this.keybuffer[i]);
        }
        this.keybuffer = [...this.keybuffer_backlog];
        return out;
    }
}

class Mouse {

}

document.addEventListener("keydown", (event) => {
event.preventDefault();
    //if(isMobile){
          //cout("[dbg]: keydown\n");
      //}
    //keybuffer.push(event.key);
    Keyboard.kbpush(event);
    //alert(event.key);
    Keyboard.wasbs = Math.max(0, Keyboard.wasbs + 1);
});

document.addEventListener("keyup", (event) => {
if(Keyboard.wasbs===0){
        //keybuffer.push(event.key);alert("keypress:"+event.key);
        Keyboard.kbpush(event);
    }else{
        Keyboard.wasbs--;
    }
});

class Tools {
    static StdKeyHandler(SpecialKeyCallback, InputStream){
        if(InputStream.length === 1){
            return InputStream;
        }
        switch(InputStream){
            case "Tab":
                return "\t";
            case "Enter":
                return "\n";
            default:
                return SpecialKeyCallback(InputStream);
        }
    }
    static PromptStreamKeyHandler(callback, s){

    }
    static clamp(min, x, max){
        return Math.max(min, Math.min(max, x));
    }
}

class PromptStream {
    constructor(){
        this.file = "";
        this.curoff = 0; //- for left, + for right (towards EOF)
        this.backspacequeue = 0;
        this.curoffchange = 0;
        this.callback = (keystr) => {}; //THIS DOES NOT GET RESET !!! !!!
    }
    ResetFile(){
        this.file = "";
        this.curoff = 0; //- for left, + for right (towards EOF)
        this.backspacequeue = 0;
        this.curoffchange = 0;
    }
    Update(){
        this.file = this.file.slice(0,this.file.length+this.curoff) + Keyboard.flush((str) => Tools.StdKeyHandler((spec) => this.kbfcallback(spec), str)) + this.file.slice(this.file.length+this.curoff,this.file.length);
        this.file = this.file.slice(0,Math.max(0,this.file.length+this.curoff-this.backspacequeue)) + this.file.slice(Math.max(0,this.file.length+this.curoff),this.file.length);
        this.backspacequeue = 0;
        this.curoff = Tools.clamp(-this.file.length,this.curoff+this.curoffchange,0);
        this.curoffchange = 0;
    }
    SetSpecialHandleCallback(callback){
        this.callback = callback;
    }
    kbfcallback(key){
        switch(key){
            case "Backspace":
                this.backspacequeue++;
                return "";
            case "ArrowLeft":
                this.curoffchange--;
                return "";
            case "ArrowRight":
                this.curoffchange++;
                return "";
            case "ArrowDown":
                return "";
            case "ArrowUp":
                return "";
            default:
                this.callback(key);
                return "";
        }
    }
}
