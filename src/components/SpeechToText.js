import React, { useState, useEffect } from 'react';
import axios from "axios";
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

const AudioCapture = ({setPromptDetails}) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [uploading, setUploading] = useState(false);
  async function init() {
    await register(await connect());
  }
  useEffect(() => {
    init().then(r => console.log('registered')).catch(e => console.log('encoder already registered'));
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setMediaStream(stream);
        const recorder = new MediaRecorder(stream,  { mimeType: 'audio/wav' });
        setMediaRecorder(recorder);
        recorder.ondataavailable = handleDataAvailable;
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });

    // Cleanup function to stop the media stream when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
      setAudioChunks([]); // Clear previous chunks
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunks(prevChunks => [...prevChunks, event.data]);
    }
  };

  const urlConvertSpeech = '//localhost:8000/process_audio/'
  const handleUpload = async () => {
    if (!audioChunks.length) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    audioChunks.forEach((chunk, index) => {
      formData.append('audio_files', chunk, `recording-${index}.wav`);
    });

    try {
      const response = await axios.post(urlConvertSpeech, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPromptDetails(response.data.text);
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording || uploading}>Start Recording</button>
      <button onClick={stopRecording} disabled={!recording || uploading}>Stop Recording</button>
      <button onClick={handleUpload} disabled={!audioChunks.length || uploading}>Upload Audio</button>
    </div>
  );
};

export default AudioCapture;