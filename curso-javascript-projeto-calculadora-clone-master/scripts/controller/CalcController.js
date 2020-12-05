class CalcController{

    constructor(){
        this._audio = new Audio("click.mp3");
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonEvents();
        this.initKeyBoard();
    }

    initialize(){        
        this.setdisplayDateTime();  
        setInterval(() =>{
           this.setdisplayDateTime();
        },1000);
        this.setLastNumberToDisplay();
        document.querySelectorAll('.btn-ac').forEach(btn =>{
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){

        //JEITO MAIS FÁCIL AINDA..BOOLEANO..SE ELE ERA FALSO, AGORA É TRUE
        this._audioOnOff = !this._audioOnOff;


        //COMO UTILIZAR OPERADOR TERNÁRIO
        //this._audioOnOff = (this._audioOnOff) ? false : true;
    
        //JEITO MAIOR DE FAZER
        /*if (this._audioOnOff){
            this._audioOnOff = false;
        }else{
            this._audioOnOff = true;
            }
        }*/
    }

    playAudio(){
        if (this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyBoard(){     
        document.addEventListener('keyup', e => {
            this.playAudio();
            console.log(e.key);
            switch (e.key){
                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
            }
    
        })
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
        this._lastOperator = ""
        this._lastNumber = ""
        this.setLastNumberToDisplay()
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay()
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
       return (['+','-','*','%','/'].indexOf(value) > -1);

    }

    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            })
        }
    }

    calc(){
        let last = "";
        this._lastOperator = this.getLastItem(true);
        if (this._operation.length < 3){
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber];  
        }

        if (this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if (this._operation.length == 3){
            this._lastNumber = this.getResult(false);
        }
        //console.log(this._lastOperator)
        //console.log(this._lastNumber)

        let result = this.getResult();
        if(last =="%"){
            //result = result / 100
            result /= 100
            this._operation = [result];
        }else{
            this._operation = [result];
            if(last) this._operation.push(last);
            //console.log(this._operation);
        }
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;
        for(let i = this._operation.length -1; i>=0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem){
            //operadores ternários
            //? significa ENTÃO
            //: significa SENÃO
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        //funcionamento do for
        /*
            for(let i = 100; i >=0; i--){
                console.log(i);
            }
        */

        let lastNumber = this.getLastItem(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    addOperation(value){
        //console.log("1",value, isNaN(this.getLastOperation()));
        if (isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){
                //trocar o operador
                this.setLastOperation(value);
                //console.log("a",this._operation)
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay()
                //console.log("c",this._operation)
            }
        }else{
            if (this.isOperator(value)){
                this.pushOperation(value);
            }else{
            //number
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue);
                ///console.log(this._operation)
                //atualizar dispaly
                this.setLastNumberToDisplay();
            }
        }
    }

    setError(){
        this.displayCalc = "Error";
    }
    
    addDot(){
        let lastOperation = this.getLastOperation();
        //ela existe E possui um ponto?
        if (typeof lastOperation === "string" && lastOperation.split("").indexOf('.') > -1) return;
        //console.log(lastOperation)
        // || significa OR
        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + ".")
        }
        this.setLastNumberToDisplay();
    }

    execBtn(value){
        this.playAudio();
        switch (value){
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "porcento":
                this.addOperation('%');
                break;
            case "divisao":
                this.addOperation('/');
                break;
            case "multiplicacao":
                this.addOperation('*');
                break;
            case "subtracao":
                this.addOperation('-');
                break;
            case "soma":
                this.addOperation('+');
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }

    }
    
    initButtonEvents(){
       let buttons = document.querySelectorAll("#buttons > g, #parts > g")
       buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                let txtBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(txtBtn);
                });
            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            })
        });
    }

    setdisplayDateTime(){
        this.displayDate = this._currentDate.toLocaleDateString(this._locale, {
            day:"2-digit", 
            month:"long",
            year:"numeric" })
        this.displayTime = this._currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if (value.toString().length > 10){
            this.setError();
            return false
        }
        this._displayCalcEl.innerHTML = value;
    }

    get _currentDate(){
        return new Date();
    }

    set _currentDate(value){
        this._currentDate = value;
    }


}
