import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import axios from 'axios';
import '../styles/VoiceChat.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const handleVoiceInput = () => {
    if (!isSpeaking) {
      recognition.start();
    } else {
      recognition.stop();
    }
  };

  const fetchResponse = async (text) => {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = text;
    
    const result = await model.generateContent(prompt);
    console.log("result",result.response.text())
    
    const videoId=await createTalk(result.response.text());
    videoLink(videoId);
  };

  const createTalk = async (talk) => {
    const url = process.env.REACT_APP_API_URL; 
    const requestBody = {
      script: {
        type: 'text',
        input: talk,
      },
      source_url: 'https://t3.ftcdn.net/jpg/06/71/26/32/360_F_671263227_lV2c9WN7yNA9q6IIm99ndaGh3QN30ebt.jpg',
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic bmFyZW5kcmFwYW5jaGFsMDIwQGdtYWlsLmNvbQ:8qYGORahUYo-cPVdH0CfI',
        },
      });

      return response.data.id;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const videoLink=async(id)=>{
    const url = process.env.REACT_APP_API_URL+id; 
    const authHeader = `Basic ${process.env.REACT_APP_LLM_API_KEY}`;
    let response 
    try {
      response = await axios.get(url, {
        headers: {
          'Authorization': authHeader,
        },
      });
    }catch(err){
      console.log(err.message);
    }
    setResponse(response.data.result_url)
  }

  
  return (
    <div className="container">
      <h1>Voice Chatbot with Avatar</h1>
      <button onClick={handleVoiceInput}>
        {isSpeaking ? 'Stop Listening' : 'Speak'}
      </button>
      <p>User: {transcript}</p>
      
      <Avatar response={response} />
    </div>
  );
};

export default VoiceChat;