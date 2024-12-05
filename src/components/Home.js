import React, { useState } from 'react';
import '../App.css'; // Import styles

const ETF_CATEGORIES = [
  'Blockchain', 'Real Estate', 'Semiconductors', 'QQQ', 'Dividends',
  'Alt Energy', 'Biotech', 'China', 'Crude Oil', 'Commodities',
  'Leveraged', 'Technology', 'Gold', 'India', 'Travel', 'Healthcare',
  'Aggressive Growth', 'VOO', 'VTI', 'FAANG', 'Inverse Equity',
  'AI', 'Leveraged Equity', 'ARKK', 'Bonds', 'Lithium', 'Gaming',
  'Water', 'Marijuana', 'Europe'
];

function Home() {
  const [response, setResponse] = useState(''); // State to store ChatGPT's response
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [selectedCategories, setSelectedCategories] = useState([]); // State for selected categories
  const [selectedFile, setSelectedFile] = useState(null); // State for uploaded CSV file

  // Handle category selection (toggle selection)
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      // If already selected, deselect it
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else if (selectedCategories.length < 5) {
      // Select a category only if less than 5 are selected
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Function to handle CSV file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      console.log('CSV file selected:', file.name); // Placeholder logic for now
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  // Function to handle the button click and make an API call
  const handleOptimizePortfolio = async () => {
    setLoading(true); // Set loading state to true when making the call

    try {
      // Call ChatGPT's API here (this is just a placeholder; you'll need actual API integration)
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_API_KEY`, // Replace with your API key
        },
        body: JSON.stringify({
          model: 'gpt-4', // Replace with your desired model
          messages: [{ role: 'system', content: 'Optimize the portfolio.' }],
        }),
      });

      const data = await apiResponse.json();
      const gptResponse = data.choices[0].message.content; // Get the response content from API

      setResponse(gptResponse); // Set the response in the state to display in the text area
    } catch (error) {
      setResponse('Error: Unable to optimize portfolio. Please try again.'); // Error handling
    } finally {
      setLoading(false); // Set loading to false when the API call is done
    }
  };

  return (
    <div className="home-container">
      {/* Left Side */}
      <div className="left-section">
        <img src="/images/logo-no-background.png" alt="ETF Optimizer Logo" className="home-logo" />

        <div className="recommended-text-box">
          <textarea
            className="recommended-text-area"
            value={response}
            readOnly // Make the text area read-only
          />
        </div>

        <button className="optimize-btn" onClick={handleOptimizePortfolio} disabled={loading}>
          {loading ? 'Optimizing...' : 'Optimize Portfolio'}
        </button>

        {/* CSV Upload Section */}
        <div className="csv-upload-section">
          <input
            type="file"
            accept=".csv"
            id="csvFileInput"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="csvFileInput" className="upload-btn">
            {selectedFile ? `Uploaded: ${selectedFile.name}` : 'Upload CSV File'}
          </label>
        </div>
      </div>

      {/* Right Side - ETF Categories Checklist */}
      <div className="right-section">
        <h3>Select 5 ETF Categories:</h3>
        <div className="categories-checklist">
          {ETF_CATEGORIES.map((category) => (
            <label key={category} className={`category-label ${selectedCategories.includes(category) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                value={category}
                onChange={() => handleCategorySelect(category)}
                checked={selectedCategories.includes(category)}
                disabled={!selectedCategories.includes(category) && selectedCategories.length === 5}
              />
              {category}
            </label>
          ))}
        </div>

        <button
          className={`save-btn ${selectedCategories.length === 5 ? '' : 'disabled'}`}
          disabled={selectedCategories.length !== 5}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default Home;
