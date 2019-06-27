const ACTION_ADD = 'ACTION_ADD';
const ACTION_REPLACE = 'ACTION_REPLACE';

class AsyncWritter {
    textContentArr;
    numTicks = 3;
    isInfiniteLoop = true;

    constructor(selector, messages){
      let element = document.querySelector(selector);
      
      this.textContentArr = messages;

      Rx.Observable.concat(
        ...this.textContentArr.map( (x) => 
          this.write(x).finally( ()=> element.textContent = '')
        )
      )
      .repeat( this.isInfiniteLoop ? null : 1)
      .subscribe(
        (val) => {
          //console.log(val)
          switch(val.action){
            case ACTION_ADD : element.textContent += val.value; break;
            case ACTION_REPLACE : element.textContent = element.textContent.slice(0, element.textContent.length - 1); break;
          }
        }
      )
    }

    write(text){
      return Rx.Observable
        .concat(
          ...Array
            .from(text).map( (val) =>{

              let { 
                  action = ACTION_ADD
                , value = val
              } = val;

              let obs = (action === ACTION_ADD 
                ? this.add(value) : this.replace() )

              return Rx.Observable
                .concat( obs, this.add('|'), this.replace() )
            }), 
          this.tick().repeat(this.numTicks),
          this.replaceWithTick().repeat(text.length)
        )
    }

    randomDelay(bottom, top) {
      return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
    }

    tick(start = 1200, end = 1200){
      return Rx.Observable.concat(
        this.add('|'),
        this.replace(start, end)
      )
    }

    add(value, start = 10, end = 100){
      return Rx.Observable
        .of({ action : ACTION_ADD, value })
        .delay( this.randomDelay(start, end) );
    }

    replace(start = 10, end = 100){
      return Rx.Observable
        .of({ action : ACTION_REPLACE })
        .delay( this.randomDelay(start, end) );
    }

    replaceWithTick(){
      return Rx.Observable.concat(
        this.replace(), this.tick(10, 100)
      )
    }

}


let messages = [
    'JEJEJEJEJ',
 [
      ...Array.from('Hola que'),
      {action : 'ACTION_REPLACE', value : 1},
      'é',
      ...Array.from(' tal?')
    ]
  ];

new AsyncWritter('div', messages);



function writing(str){

    //let writing = srt => {
  
  let arrFromStr = str.split('');

  let i = 0;

  let printStr = setInterval(function(){

   document.body.style.fontSize = '30px';

   document.body.innerHTML += arrFromStr[i];

   i++;

   if (i === arrFromStr.length){

    clearInterval(printStr);
    document.body.style.fontSize = '60px';
    document.body.style.color = 'steelblue';
   }
  },300);
 };


 writing('Me como el mundo con JS');