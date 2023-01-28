const Calculator = {
    arithmetic: function( opr ) {
        let num = parseFloat( document.querySelector('.keypad-input').innerHTML );
        if ( num === 0 ) {
            return;
        }
        switch (opr) {
            case 'f':Calculator.pushresult( 1 / num );break;
            case 's':Calculator.pushresult( num * num );break;
            case 'r':Calculator.pushresult( Math.sqrt( num ) );break;
        }
    },
    percentage: function( num ) {
        let input = document.querySelector('.keypad-input');
        if ( input.dataset.ini === '1' ) {
            Calculator.pushresult( parseFloat( input.innerHTML ) / 100 );
        } else {
            Calculator.operation( 'c' );
        }
    },
    decimal: function() {
        let input = document.querySelector('.keypad-input');
        if ( !input.innerHTML.includes( '.' ) ) {
            input.innerHTML += '.';
        }
    },
    negative: function() {
        let negate = document.querySelector('.keypad-negate');
        if ( negate.innerHTML === '-' ) {
            negate.innerHTML = '';
        } else {
            negate.innerHTML = '-';
        }
    },
    number: function( num ) {
        let input = document.querySelector('.keypad-input');

        if ( input.dataset.eql === '1' ) {
            Calculator.operation( 'c' );
        }
        if (input.dataset.ini === '1' ) {
            input.dataset.ini = '0';
            input.innerHTML = '0';
        }
        if (input.dataset.one === '1' ) {
            input.dataset.one = '0';
        }
        if ( input.innerHTML === '0' ) {
            if ( num === '0' ) {
                return;
            }
            input.innerHTML = num;
            return;
        }
        input.innerHTML += num;
    },
    operation: function( index ) {
        let operate = document.querySelector('.keypad-operation');
        let negate = document.querySelector('.keypad-negate');
        let input = document.querySelector('.keypad-input');
        let hold = document.querySelector('.keypad-onhold');
        switch (index) {
            case 'e':
                input.innerHTML = '0';
                negate.innerHTML = '';
                input.dataset.eql = '0';
            break;
            case 'c':
                hold.innerHTML = '';
                input.innerHTML = '0';
                negate.innerHTML = '';
                operate.innerHTML = '';
                input.dataset.eql = '0';
            break;
            case 'b':
                if (input.dataset.eql === '1' ) {
                    input.innerHTML = '0';
                    input.dataset.eql = '0';
                } else if ( input.innerHTML.length > 1 ) {
                    input.innerHTML = input.innerHTML.slice(0, -1);
                } else {
                    input.innerHTML = '0';
                }
            break;
        }
    },
    pushresult: function( num , opr = 'c' ) {
        let input = document.querySelector('.keypad-input');
        Calculator.operation( opr );
        input.innerHTML = parseFloat( num );
        input.dataset.ini = '1';
        return num;
    },
    calculate: function( opr , equate = false ) {
        let operate = document.querySelector('.keypad-operation');
        let negate = document.querySelector('.keypad-negate');
        let input = document.querySelector('.keypad-input');
        let hold = document.querySelector('.keypad-onhold');
        let onhold = parseFloat( hold.innerHTML ) === NaN ? null : parseFloat( hold.innerHTML );
        let number = parseFloat( ( negate.innerHTML || '' ) + input.innerHTML ) ?? 0;
        let result = 0;
        let calc = operate.innerHTML;
        if ( input.dataset.one === '0' ) {
            input.dataset.one = '1';
            Calculator.pushresult( number , 'e' );
            switch ( calc ) {
                case '+': result = ( onhold || 0 ) + number; break;
                case '-': result = ( onhold || 2 * number ) - number; break;
                case '*': result = ( onhold || 1 ) * number; break;
                case '/': result = ( onhold || 0 ) / number; break;
                default:
                    hold.innerHTML = number;
                    Calculator.pushresult( number , 'e' );
                    operate.innerHTML = opr;
                    return;
            }
            if ( result === Infinity ) {
                Calculator.operation( 'c' );
                Calculator.pushresult( result );
                return;
            }
            hold.innerHTML = result;
            if ( equate ) {
                Calculator.pushresult( result );
                hold.innerHTML = `${onhold} ${calc} ${number}`;
                input.dataset.eql = '1';
                equate = 'y';
            }
        } else if ( opr === '=' ) {
            return;
        }
        operate.innerHTML = opr;
        if ( input.dataset.eql === '1' && equate !== 'y' ) {
            hold.innerHTML = input.innerHTML;
            input.dataset.eql = '0';
        }
    },
    equate: function() {
        let operate = document.querySelector('.keypad-operation');
        let negate = document.querySelector('.keypad-negate');
        let input = document.querySelector('.keypad-input');
        let hold = document.querySelector('.keypad-onhold');
        let onhold = parseFloat( hold.innerHTML ) === NaN ? null : parseFloat( hold.innerHTML );
        let number = parseFloat( ( negate.innerHTML || '' ) + input.innerHTML ) ?? 0;
        let result = 0;
        switch (operate.innerHTML) {
            case '+': result = ( onhold || 0 ) + number; break;
            case '-': result = ( onhold || 2 * number ) - number; break;
            case '*': result = ( onhold || 1 ) * number; break;
            case '/': result = ( onhold || 0 ) / number; break;
            default: return;
        }
        Calculator.pushresult( result );
    },
};
document.querySelectorAll('.keypad-button').forEach(( button , i ) => {
    button.addEventListener( 'click', function() {
        switch (this.dataset.type ) {
            case 'art': Calculator.arithmetic( this.dataset.key ); break;
            case 'per': Calculator.percentage(); break;
            case 'dec': Calculator.decimal(); break;
            case 'neg': Calculator.negative(); break;
            case 'smc': Calculator.calculate( this.dataset.bind ); break;
            case 'num': Calculator.number( this.dataset.key ); break;
            case 'opr': Calculator.operation( this.dataset.key ); break;
            case 'eql': Calculator.calculate( '=' , true ); break;
        }
    });
});

window.addEventListener( 'keydown', function( e ) {
    let button = document.querySelector(`.keypad-button[data-bind="${e.key.toLowerCase()}"]`);
    if ( button !== null && !( e.ctrlKey || e.shiftKey ) ) {
        button.click();
        button.focus();
    }
});
