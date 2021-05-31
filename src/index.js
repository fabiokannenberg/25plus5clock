import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let intervalID = "";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: "paused",
      timerType: "Session",
      timer: 1500,
      wasResetted: true
    };
    this.setBreakLength = this.setBreakLength.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);
    this.lengthEditor = this.lengthEditor.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toMMSS = this.toMMSS.bind(this);
    this.playOrPause = this.playOrPause.bind(this);
  }

  setBreakLength(event) {
    this.lengthEditor(
      this.state.breakLength,
      "breakLength",
      event.currentTarget.value
    );
  }

  setSessionLength(event) {
    this.lengthEditor(
      this.state.sessionLength,
      "sessionLength",
      event.currentTarget.value
    );
  }

  lengthEditor(currentLength, stateToModify, sign) {
    if (this.state.timerState === "running") {
      return;
    }
    switch (stateToModify) {
      case "sessionLength":
        if (sign === "+" && currentLength !== 60) {
          this.setState({
            [stateToModify]: currentLength + 1,
            timer: currentLength * 60 + 60
          });
        }
        if (sign === "-" && currentLength !== 1) {
          this.setState({
            [stateToModify]: currentLength - 1,
            timer: currentLength * 60 - 60
          });
        }
        break;
      default:
        if (sign === "+" && currentLength !== 60) {
          this.setState({
            [stateToModify]: currentLength + 1
          });
        }
        if (sign === "-" && currentLength !== 1) {
          this.setState({
            [stateToModify]: currentLength - 1
          });
        }
        break;
    }
  }

  resetTimer() {
    clearInterval(intervalID);
    this.setState({
      timerType: "Session",
      timerState: "paused",
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      wasResetted: true
    });
    this.beep.pause();
    this.beep.currentTime = 0;
  }

  toMMSS(timer) {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;
    //seconds < 10 ? (seconds = `0${seconds}`) : seconds;
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    //minutes < 10 ? (minutes = `0${minutes}`) : minutes;
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    return `${minutes}:${seconds}`;
  }

  switchTimerType() {
    //if (countdown <= 0)
    if (this.state.timerType === "Session") {
      const timer = this.state.breakLength * 60;
      this.setState({
        timer: timer,
        timerType: "Break"
      });
      this.startCountdown();
    } else if (this.state.timerType === "Break") {
      const timer = this.state.sessionLength * 60;
      this.setState({
        timer: timer,
        timerType: "Session"
      }); // arrumar algo aqui, pois não está se comportando direito
      this.startCountdown();
    }
  }

  startCountdown() {
    this.setState({
      timerState: "running"
    });
    let currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + this.state.timer);
    console.log("timer :" + this.state.timer);
    let date = currentDate.getTime();
    let now = new Date().getTime();
    let countdown = Math.round((date - now) / 1000);
    intervalID = setInterval(() => {
      if (countdown > 0 && this.state.timerState === "running") {
        now = new Date().getTime();
        countdown = Math.round((date - now) / 1000);
        this.setState({
          timer: countdown
        });
        console.log(countdown);
      } else {
        this.playAudio();
        clearInterval(intervalID);
        this.switchTimerType();
      }
    }, 1000);
  }

  stopCountdown() {
    clearInterval(intervalID);
    this.setState({
      timerState: "paused"
    });
  }

  playOrPause() {
    if (this.state.timerState === "paused") {
      this.startCountdown();
    } else if (this.state.timerState === "running") {
      this.stopCountdown();
    }
  }

  playAudio() {
    if (this.state.timer === 0) {
      this.beep.volume = 0.1;
      this.beep.play();
    }
  }

  render() {
    return (
      <div id="wrapper">
        <div className="timer">
          <div id="timer-label">{this.state.timerType}</div>
          <div id="time-left">{this.toMMSS(this.state.timer)}</div>
          <div className="timer-control">
            <button id="start_stop" onClick={this.playOrPause}>
              <i className="fa fa-play" /> <i className="fa fa-pause" />
            </button>
            <button id="reset" onClick={this.resetTimer}>
              {" "}
              <i className="fa fa-sync" />
            </button>
            <audio
              id="beep"
              src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
              ref={(audio) => {
                this.beep = audio;
              }}
            />
          </div>
        </div>
        <div id="container">
          <LengthControl
            labelID="break-label"
            label="Break Length"
            decrementID="break-decrement"
            incrementID="break-increment"
            lengthID="break-length"
            length={this.state.breakLength}
            onClick={this.setBreakLength}
          />
          <LengthControl
            labelID="session-label"
            label="Session Length"
            decrementID="session-decrement"
            incrementID="session-increment"
            lengthID="session-length"
            length={this.state.sessionLength}
            onClick={this.setSessionLength}
          />
        </div>
      </div>
    );
  }
}

const LengthControl = (props) => {
  return (
    <div className="length-control">
      <div id={props.labelID}>{props.label}</div>
      <button
        className="button-level"
        id={props.decrementID}
        value="-"
        onClick={props.onClick}
      >
        <i className="fa fa-arrow-down" />
      </button>
      <div id={props.lengthID}>{props.length}</div>
      <button
        className="button-level"
        id={props.incrementID}
        value="+"
        onClick={props.onClick}
      >
        <i className="fa fa-arrow-up" />
      </button>
    </div>
  );
};

ReactDOM.render(<Timer />, document.getElementById("App"));


