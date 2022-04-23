import React, { Component } from "react";
import "./style.css";

class App extends Component {
  state = {
    timeElapsed: 0,
    wordsPerMinute: 0,
    splitedText: [],
    started: false,
    selectedText: "",
    currentInputValue: "",
    startTime: undefined,
    lastLetter: "",
    completedWords: [],
    endedText: false,
    progressLevel: 0
  };

  selectRandomText = () => {
    const textsList = [
     // '123 123 123 123',
      'test test test test',
      "Fabuła Harry'ego Pottera osadzona jest w świecie magii, istniejącym równolegle do świata niemagicznego, tak zwanego mugolskiego. Świat magii tworzy społeczność czarodziejów, czyli ludzi obdarzonych zdolnością używania magii. W większości są to przedstawiciele rodzin czarodziejskich. "
    ]; 
    const selectedText = textsList[Math.floor(Math.random() * textsList.length)];
    const splitedText = selectedText.split(" ");

    this.setState({
      splitedText: splitedText,
      selectedText: selectedText,
      completedWords: []
    });
  };

  startGame = () => {
    this.selectRandomText();

    this.setState({
      startTime: Date.now(),
      endedText: false,
      started: true,
      progressLevel: 0
    });
  };

  actionOnChange = e => {
    const { splitedText, completedWords } = this.state;
    const currentInputValue = e.target.value;
    const lastLetterFromInput = currentInputValue[currentInputValue.length - 1];

    const currentWord = splitedText[0];
    // console.log(currentWord, "currentWord");

    // jeżeli ostatnia litera to spacja albo . sprawdzamy słowo
    if (lastLetterFromInput === " " || lastLetterFromInput === ".") {
      // sprawdzamy czy słowo w inpucie zgadza się z aktualnym słowem
      // trim aby usunąć spacje
      if (currentInputValue.trim() === currentWord) {
        // usuwmy poprawnie wpisane słowo z tablicy
        // czyścimy input text
        const newWords = [...splitedText.slice(1)];
        // console.log(newWords, "newWords");
        // console.log(newWords.length, "newWords.length");
        const newCompletedWords = [...completedWords, currentWord];
        // console.log(newCompletedWords, "newCompletedWords");

        // Aktualizacja prograsu poprzez sprawdzenie ile zostało jeszcze słów
        const progressLevel =
          (newCompletedWords.length /
            (newWords.length + newCompletedWords.length)) *
          100;
        this.setState({
          splitedText: newWords,
          completedWords: newCompletedWords,
          currentInputValue: "",
          endedText: newWords.length === 0,
          progressLevel: progressLevel
        });
      }
    } else {
      this.setState({
        currentInputValue: currentInputValue,
        lastLetterFromInput: lastLetterFromInput
      });
      // console.log(this.state.currentInputValue, "this.state.currentInputValue");
      // console.log(this.state.lastLetterFromInput, "this.state.lastLetterFromInput");
    }

    this.calculatewordsPerMinute();
  };

  calculatewordsPerMinute = () => {
    const { startTime, completedWords } = this.state;
    const now = Date.now();
    const difference = (now - startTime) / 1000 / 60; // 1000 ms / 60 s
    // console.log(now, "now");
    // console.log(startTime, "startTime");
    // console.log(difference, "difference");

    // every word is considered to have 5 letters
    // so here we are getting all the letters in the words and divide them by 5
    // "my" shouldn't be counted as same as "deinstitutionalization"
    const wordsTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
    );
    // console.log(completedWords, "completedWords");
    // console.log(wordsTyped, "wordsTyped");

    // Obliczanie słów na minutę
    const wordsPerMinute = Math.ceil(wordsTyped / difference);

    this.setState({
      wordsPerMinute: wordsPerMinute,
      timeElapsed: difference
    });
  };

  render() {
    const {
      selectedText,
      currentInputValue,
      completedWords,
      wordsPerMinute,
      timeElapsed,
      started,
      endedText,
      progressLevel
    } = this.state;

    if (!started)
      return (
        this.startGame()
      );

    if (endedText) {
      return (
        <div className="wrapper">
          <h1>Gratulacje!
          </h1>
          <h2>
            Wskaźnik słów na minutę: <strong>{wordsPerMinute}</strong>
          </h2>
          <button className="start-btn" onClick={this.startGame}>
            Jeszcze raz?
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="wrapper">
        <strong>Słów na minutę: </strong>
          {wordsPerMinute}
          <br />
          <strong>Czas: </strong>
          {Math.floor(timeElapsed * 60)}s
          <progress value={progressLevel} max="100" />
          <p className="text">
            {selectedText.split(" ").map((word, word_id) => {
              let highlight = false;
              let currentWord = false;

              // Słowo poprawnie przepisane , więc kolorujemy na zielono
              if (completedWords.length > word_id) {
                highlight = true;
              }

              if (completedWords.length === word_id) {
                currentWord = true;
              }
              // Kolorowanie słowa
              return (
                <span
                  className={`word 
                                ${highlight && "green"} 
                                ${currentWord && "underline"}`}
                  key={word_id}
                >
                  {word.split("").map((letter, letter_id) => {
                    const isCurrentWord = word_id === completedWords.length;
                    const isWronglyTyped = letter !== currentInputValue[letter_id];
                    const shouldBeHighlighted = letter_id < currentInputValue.length;
                    // Kolorowanie litery
                    return (
                      <span
                        className={`letter ${
                          isCurrentWord && shouldBeHighlighted
                            ? isWronglyTyped
                              ? "red"
                              : "green"
                            : ""
                        }`}
                        key={letter_id}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
          <input
            type="text"
            onChange={this.actionOnChange}
            value={currentInputValue}
            autoFocus={true}
          />
        </div>
      </div>
    );
  }
}

export default App;
