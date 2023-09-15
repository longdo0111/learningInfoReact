import React, { useState, useEffect } from 'react'
import '../../css/WFDComponent.css';
import QuestionService from '../../services/QuestionService';
import VoiceService from '../../services/VoiceService';

function WFDComponent() {

  const [questions, getQuestions] = useState([]);
  const [voiceSpeed, setSpeed] = useState([]);
  const [voices, initializeVoices] = useState([]);
  const [currentVoice, setVoice] = useState([]);
  const [currentQuestion, setQuestion] = useState([]);

  useEffect(() => {
    getVoiceList();
    let questions = [];
    QuestionService.getAllQuestion().then((res) => {
      res.data.forEach((question, index) => {
        question["order"] = index + 1;
        questions.push(question);
      });
      getQuestions(questions);
      setQuestion(questions[0]);
    });
  }, []);

  const getVoiceList = () => {
    VoiceService.getVoiceList().then((res) => {
      initializeVoices(res);
      chooseVoice(res[0].name)
    }).catch((err) => {
      console.log("Voice list error: " + err);
    });
  };

  const getTitle = () => {
    let title = "Write from dictation";
    return title;
  }

  const chooseVoice = (voice) => {
    setVoice(voice);
  }

  const playAudio = () => {
    VoiceService.playAudio(currentQuestion.content, currentVoice);
  }

  const chooseQuestion = (question) => {
    setQuestion(question);
  }

  return (
    <div className="container">
        <div className="col-md-8 offset-md-2">
          <h2 className="text-center uppercase">{getTitle()}</h2>
          <div className='mb-3 row'>
            <label className='col-sm-2 col-form-label'>Select Voices : </label>
            <div className='col-sm-10'>
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{ currentVoice }</button>
                <ul className="dropdown-menu">
                  {
                    voices.map(voice => 
                      <li className="dropdown-item" key={voice.name} onClick={() => chooseVoice(voice.name)}>{voice.name}</li>
                    )
                  }                
                </ul>
              </div>
            </div>
          </div>
          <div className='mb-3 row'>
            <label className='form-label col-sm-2'>Voices speed : { voiceSpeed }</label>
            <span id="sliderValue" className='col-sm-1' style={{"fontSize": "bold", "color": "red"}}>1.1</span>
            <div className="slidecontainer col-sm-8">
              <input type="range" min="0" max="5" className="slider form-range" id="slider" /></div>
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => playAudio("I am human", currentVoice)}>Play the sentence</button>
            <button className="btn btn-info" style={{"marginLeft": "10px"}}>Repeat</button>
          </div>
          <div>
            <p>Type Answer Here :</p>
            <textarea rows="3" cols="45" type="text" id="txtInput"></textarea>
          </div>
          <div>
            <button className="btn btn-success">Show the answer</button>
            <button className="btn btn-warning" style={{"marginLeft": "10px"}}>Count incorrect words</button>
          </div>
          <div>
            <p>Answer : </p>
            <textarea rows="3" cols="45" type="text" id="txtAnswer"></textarea>
          </div>
          <div>

            <div className='mb-3 row'>
              <label className='col-sm-2 col-form-label'>Select sentence: </label>
              <div className='col-sm-10'>
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{ currentQuestion.order}</button>
                  <ul className="dropdown-menu">
                    {
                      questions.map(question => 
                        <li className="dropdown-item" key={question.id} onClick={() => chooseQuestion(question)}>{question.order}</li>
                      )
                    }                
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div>
            <input type="checkbox" id="chkIgnoreGroupTitle" /> <label htmlFor="chkIgnoreGroupTitle"> Ignore Group Title</label>
            <input type="checkbox" id="chkAlwaysShowAnswer" /> <label htmlFor="chkAlwaysShowAnswer"> Show Answer</label>
            <input type="checkbox" id="chkRandomQuestion" /> <label htmlFor="chkRandomQuestion">Random question</label>
            <input type="checkbox" id="chkReverseQuestion" /> <label htmlFor="chkReverseQuestion">Reverse questions</label>
          </div>
        </div>        
    </div>
  )
}
export default WFDComponent