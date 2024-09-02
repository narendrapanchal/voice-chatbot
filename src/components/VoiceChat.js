import React, { useState, useEffect } from 'react';
import '../styles/VoiceChat.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import GridBox from './GridBox';
import MarkdownRenderer from './MarkdownRendererProps';
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceChat = () => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'en-US';
    recognitionInstance.interimResults = false;

    recognitionInstance.onstart = () => {
      setIsSpeaking(true); // User started speaking
    };

    recognitionInstance.onend = async () => {
      setIsSpeaking(false); // User stopped speaking
      if (recognitionInstance.isFinal) {
        await fetchResponse(recognitionInstance.finalTranscript);
      }
    };

    recognitionInstance.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      recognitionInstance.finalTranscript = spokenText;
      recognitionInstance.isFinal = true;
    };
    setRecognition(recognitionInstance);

  }, []);
  useEffect(() => {
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };

    if (response) {
      speak(response);
    }
  }, [response]);

  const handleVoiceInput = () => {
    if (!isSpeaking) {
      recognition.start();
    } else {
      recognition.stop();
    }
  };

  const fetchResponse = async (promptText) => {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(promptText);
    setResponse(result.response.text());
  };


  
  return (
    <div className="container">
      <div className='centerBox'>
      <h1>Voice Chatbot</h1>
      <GridBox fetchResponse={fetchResponse} setTranscript={setTranscript}/>
      <button onClick={handleVoiceInput} >
        {isSpeaking ? 'Stop Listening' : 'Tell the topic'}
      </button>
      </div>
      <h2><strong>User:</strong> <p>{transcript}</p></h2>
      <div><h2>Bot:</h2> <MarkdownRenderer markdown={response}/>
    </div>
    </div>
  );
};

export default VoiceChat;