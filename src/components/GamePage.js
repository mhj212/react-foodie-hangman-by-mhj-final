import React from 'react';
import Button from './parts/Button';
import HangmanDrawing from './parts/HangmanDrawing';


class GamePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = Object.assign({}, DEFAULT_INITIAL_STATE, {
            words: [...DEFAULT_WORDS],
        });

        this.startGame = this.startGame.bind(this);
        this.guessLetter = this.guessLetter.bind(this);
        this.keyDownEvent = this.keyDownEvent.bind(this);
        this.hintFunc = this.hintFunc.bind(this);
        this.ifWinner = this.ifWinner.bind(this);
        this.giveUp = this.giveUp.bind(this);
        this.yesMobileTablet = this.yesMobileTablet.bind(this);
        this.noMobileTablet = this.noMobileTablet.bind(this);
        this.openKeyboard = this.openKeyboard.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyDownEvent, false);
    }

    // componentWillMount() {
        
    // }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDownEvent, false);
    }

    yesMobileTablet() {
        this.setState({ isMobileOrTablet: true, 
                        hideGameInterface: false,
                        hideChooseGameInterface: true});
    }

    noMobileTablet() {
        this.setState({ isMobileOrTablet: false, 
                        hideGameInterface: false,
                        hideChooseGameInterface: true });
    }

    keyDownEvent(event) {
        const noMetaKeysPressed = () => !event.metaKey && !event.ctrlKey && !event.altKey;

        if (noMetaKeysPressed() && this.state.gameIsHappening) {
            event.preventDefault();
            const input = String.fromCharCode(event.which);
            const guessedLetter = input.toLowerCase();

            if (guessedLetter.match(/[a-z]/)) {
                this.guessLetter(guessedLetter);
            } else {
                this.handleInvalidCharacter();
            }
        }
    }

    openKeyboard () {
        console.log('open keyboard');
        document.getElementById('keyboard-message').addEventListener('click', function(){
            var inputElement = document.getElementById('hidden-input');
            inputElement.style.visibility = 'visible'; // unhide the input
            inputElement.focus(); // focus on it so keyboard pops
            inputElement.style.visibility = 'hidden'; // hide it again
        });

    }

    handleInvalidCharacter() {
        this.setState({ messagesDivText: 'That character is invalid, please enter a letter!' });
    }

    hintFunc() {
        const toIndex = (_, idx) => idx;
        const stillBlank = index => this.state.blanksArray[index] === '-';
        const correctLetter = index => this.state.answer[index];

        const hintLetter =  getRandomCharFromArray(
                                this.state.blanksArray
                                    .map(toIndex)
                                    .filter(stillBlank)
                                    .map(correctLetter)
                            );

        const blanksArray = this.state.answer.split('')
                                .map((char, idx) => {
                                    if (char === hintLetter) return char;
                                    return this.state.blanksArray[idx];
                                });

        this.setState(prevState => ({
            guessedLetters: prevState.guessedLetters.concat(hintLetter),
            blanksArray,
            word: blanksArray.join(' '),
            tries: prevState.tries - 1
        }), () => {
            if (finishedGameFromHint(this.state)) {
                this.giveUp();
            }
        });
    }

    giveUp() {
        this.setState(Object.assign({}, RESET_STATE, {
            messagesDivText: "The correct answer was " + this.state.answer,
            tries: 0
        }));
    }

    guessLetter(guess) {
        if (alreadyGuessedLetter(this.state, guess)) {
            this.setState({
                messagesDivText: 'You already guessed the letter ' + guess,
            });
        } else if (!isIncorrectGuess(this.state, guess)) {
            this.handleCorrectGuess(guess);
        } else {
            this.handleIncorrectGuess(guess);
        }
    }

    handleCorrectGuess(guess) {
        const guessedLetters = this.state.guessedLetters.concat(guess);
        const blanksArray = this.state.answer.split('')
                                .map((char, idx) => {
                                    if (char === guess) return guess;
                                    return this.state.blanksArray[idx];
                                });
        const word = blanksArray.join(' ');

        this.setState({
            messagesDivText: 'The letter ' + guess + ' is in the word!',
            guessedLetters,
            blanksArray,
            word,
        }, () => {
            this.ifWinner();
        });
    }

    handleIncorrectGuess(guess) {
        if(onLastTry(this.state)){
            this.giveUp();
        } else {
            this.setState(prevState => ({
                messagesDivText: 'The letter ' + guess + ' is not in the word',
                guessedLetters: prevState.guessedLetters.concat(guess),
                tries: prevState.tries - 1,
                hideIncorrectLetters: false,
            }));
        }
    }

    ifWinner() {
        if (isWinner(this.state)) {
            this.setState(Object.assign({}, RESET_STATE, {
                messagesDivText: "You are a WINNER!!!",
                tries: 8
            }));
        }
    }

    startGame() {
        const answer = getRandomCharFromArray(this.state.words);
        const blanksArray = new Array(answer.length).fill(null).map(_ => '-');
        const word = blanksArray.join(' ');

        this.setState(Object.assign({}, START_GAME_INITIAL_STATE, {
            tries: 8,
            answer,
            blanksArray,
            word
        }));
    }

    renderTitle() {
        return (<h1>Foodie Hangman</h1>);
    }

    renderKeyBoardMessage() {
        if(isMobileOrTablet(this.state)){
            const className = this.state.hideUseKeyboard ? "hide" : "";
            return (<div><span id="keyboard-message" className={className} onClick={this.openKeyboard}>Click here to open keyboard</span>
                    <br></br><input id="hidden-input" type="text"></input></div>);

        } else {
            const className = this.state.hideUseKeyboard ? "hide" : "";
            return (<div id="keyboard-message" className={className}>Please use the keyboard</div>);
        }

    }

    renderMessages() {
        return (<div id="messages">{this.state.messagesDivText}</div>);
    }

    renderWord() {
        return (<div id="word">{this.state.word}</div>);
    }

    renderTriesLeftMessage() {
        const message = `You have ${this.state.tries} tries left`;
        const className = this.state.hideTries ? 'hide' : '';

        return (<div id="tries" className={className}>{message}</div>);
    }

    renderIncorrectTriesMessage() {
        const className = this.state.hideIncorrectLetters ? 'hide' : '';
        const incorrectLettersText = calculateIncorrectLettersFromState(this.state).join(', ');

        return (
            <div id="incorrect-letters" className={className}>
                incorrect letters: <span className="incorrect">{incorrectLettersText}</span>
            </div>
        );
    }

    renderBreak() {
        return (<br></br>);
    }

    renderButton(id, className, onClick, text) {
        return (<Button id={id} className={className} onClick={onClick} text={text} />);
    }

    renderHangmanDrawing() {
        return (<HangmanDrawing tries={this.state.tries}/>);
    }

    renderMobileTabletQuestion(){
        return(<h3>Are you playing on a mobile or tablet?</h3>);
    }
    

    render() {
        const startButtonClassName = this.state.startGameButtonHide ? "Btn hide" : "Btn";
        const giveUpButtonClassName = this.state.hideGiveUpButton ? "Btn hide" : "Btn";
        const hintButtonClassName = this.state.hideHintButton ? "Btn hide" : "Btn";

        const yesMobileTabletButtonClassName = this.state.hideYesMobileTabletButton ? "Btn hide" : "Btn";
        const noMobileTabletButtonClassName = this.state.hideNoMobileTabletButton ? "Btn hide" : "Btn";

        const chooseGameInterface = this.state.hideChooseGameInterface ? "hide" : "";
        const gameInterfaceClassName = this.state.hideGameInterface ? "hide" : "";


        return (
            <div id="container">
                <div id="innerContainer">
                    {this.renderTitle()}
                    <div id="choose-game-type" className={chooseGameInterface}>
                        {this.renderMobileTabletQuestion()}
                        {this.renderButton('yesmobilebutton',yesMobileTabletButtonClassName,this.yesMobileTablet,"Yes")}
                        {this.renderButton('nomobilebutton',noMobileTabletButtonClassName,this.noMobileTablet,"No")}
                    </div>
                    <div id="game-interface" className={gameInterfaceClassName}>
                        {this.renderKeyBoardMessage()}
                        {this.renderBreak()}
                        {this.renderMessages()}
                        {this.renderWord()}
                        {this.renderBreak()}
                        {this.renderTriesLeftMessage()}
                        {this.renderIncorrectTriesMessage()}
                        {this.renderButton("startgame", startButtonClassName, this.startGame, "Start a new game")}
                        {this.renderButton("giveupbutton", giveUpButtonClassName, this.giveUp, "Give Up")}
                        {this.renderButton("hintbutton", hintButtonClassName, this.hintFunc, "Hint")}
                        {this.renderHangmanDrawing()}
                    </div>
                </div>
            </div>
            
   
        );
    }
}

export default GamePage;

const DEFAULT_WORDS = ["cheese", "tacos", "burrito", "carnitas", "chocolate", "rigatoni", "souffle", "coffee", "cappuccino", "ravioli", "tortellini", "eggplant", "tomato", "cherry", "apple", "orange", "carrot", "tiramisu", "strawberry", "mango", "clementine", "sushi", "noodles", "almond", "cashew", "walnut",'breakfast','lunch','dinner','cookie','scone','muffin','babka','doughnut','bacon'];

const DEFAULT_INITIAL_STATE = Object.freeze({
    guessedLetters: [],
    startGameButtonHide: false,
    gameIsHappening: false,
    tries: 0,
    answer: '',
    blanksArray: '',
    hideHintButton: true,
    hideGiveUpButton: true,
    hideUseKeyboard: true,
    hideIncorrectLetters: true,
    messagesDivText: '',
    hideTries: true,
    word: '',
    modalShow: false,
    hideYesMobileTabletButton: false,
    hideNoMobileTabletButton: false,
    isMobileOrTablet: false,
    hideGameInterface: true,
    hideChooseGameInterface: false
});

const RESET_STATE = Object.freeze({
    guessedLetters: [],
    startGameButtonHide: false,
    gameIsHappening: false,
    answer: '',
    blanksArray: '',
    hideHintButton: true,
    hideGiveUpButton: true,
    hideUseKeyboard: true,
    hideIncorrectLetters: true,
    messagesDivText: '',
    hideTries: true,
    word: '',
});

const START_GAME_INITIAL_STATE = Object.freeze({
    guessedLetters: [],
    startGameButtonHide: true,
    hideHintButton: false,
    hideGiveUpButton: false,
    gameIsHappening: true,
    hideTries: false,
    hideUseKeyboard: false,
    blanksArray: [],
    messagesDivText: '',
    hideIncorrectLetters: true,
});

const incorrectLetter = state => letter => state.answer.indexOf(letter) === -1;

const calculateIncorrectLettersFromState = state => {
    return state.guessedLetters.filter(incorrectLetter(state));
};

const isWinner = state => state.answer === state.blanksArray.join('');

const alreadyGuessedLetter = (state, guess) => state.guessedLetters.indexOf(guess) !== -1;

const isIncorrectGuess = (state, guess) => incorrectLetter(state)(guess);

const onLastTry = state => state.tries === 1;

const finishedGameFromHint = state => state.answer === state.blanksArray.join('');

const getRandomCharFromArray = array => array[Math.floor(Math.random() * array.length)];

const isMobileOrTablet = state => state.isMobileOrTablet;