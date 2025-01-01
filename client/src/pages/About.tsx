import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function About() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8787/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="min-h-screen font-inter">
      <Navbar activeTab="About Us" />
      <div className="p-4">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload File</button>
      </div>
    </div>
  );
}