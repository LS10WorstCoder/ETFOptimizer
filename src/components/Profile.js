import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase.js'; // Firestore reference
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore imports
import './Profile.css'; // Use Profile.css for styling

const ETF_CATEGORIES = [
  'Blockchain', 'Real Estate', 'Semiconductors', 'QQQ', 'Dividends',
  'Alt Energy', 'Biotech', 'China', 'Crude Oil', 'Commodities',
  'Leveraged', 'Technology', 'Gold', 'India', 'Travel', 'Healthcare',
  'Aggressive Growth', 'VOO', 'VTI', 'FAANG', 'Inverse Equity',
  'AI', 'Leveraged Equity', 'ARKK', 'Bonds', 'Lithium', 'Gaming',
  'Water', 'Marijuana', 'Europe'
];

const Profile = ({ userId }) => {
  const [preferences, setPreferences] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Track visibility of preference selector
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories
  const [newETF, setNewETF] = useState({ Ticker: '', Type: '', FundFlow: '', Details: '' });

  // Fetch saved preferences and ETF portfolio from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'Users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.preferences) {
            setPreferences(data.preferences);
            setSelectedCategories(data.preferences); // Set selected categories on load
          }
          if (data.portfolio) setPortfolio(data.portfolio);
        } else {
          console.log('No user document found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Toggle modal visibility
  const toggleEditPreferences = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal state
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Save preferences to Firestore and hide modal
  const handleSavePreferences = async () => {
    if (selectedCategories.length === 5) {
      try {
        const userDocRef = doc(db, 'Users', userId);
        await updateDoc(userDocRef, { preferences: selectedCategories });
        setPreferences(selectedCategories); // Set saved preferences
        setIsModalVisible(false); // Hide the popup after saving
      } catch (error) {
        console.error('Error updating preferences:', error);
      }
    }
  };

  // Add new ETF to portfolio and save to Firestore
  const handleAddETF = async () => {
    if (newETF.Ticker && newETF.Type && newETF.FundFlow && newETF.Details) {
      const updatedPortfolio = [...portfolio, newETF];
      setPortfolio(updatedPortfolio);
      setNewETF({ Ticker: '', Type: '', FundFlow: '', Details: '' });

      try {
        const userDocRef = doc(db, 'Users', userId);
        await updateDoc(userDocRef, { portfolio: updatedPortfolio });
      } catch (error) {
        console.error('Error updating portfolio:', error);
      }
    }
  };

  // Handle ETF form input changes
  const handleETFChange = (e) => {
    const { name, value } = e.target;
    setNewETF((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="profile-container">
        {/* Saved ETF Preferences Section */}
        <section className="preferences-section">
          <h2>Saved ETF Preferences</h2>

          {/* Display saved preferences as bubbles */}
          <div className="preferences-bubbles">
            {preferences.map((etf, index) => (
              <span key={index} className="preference-bubble">
                {etf}
              </span>
            ))}
          </div>

          <button className="edit-btn" onClick={toggleEditPreferences}>
            Edit Preferences
          </button>

          {/* Inline preference selector box (only visible if modal is active) */}
          {isModalVisible && (
            <div className="preferences-box">
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
                onClick={handleSavePreferences} // Triggers save and hides box
                disabled={selectedCategories.length !== 5} // Disable unless 5 categories are selected
              >
                Submit Preferences
              </button>
            </div>
          )}
        </section>

        {/* ETF Portfolio Section */}
        <section className="portfolio-section">
          <h2>Your ETF Portfolio</h2>
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Type</th>
                <th>Fund Flow</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((etf, index) => (
                <tr key={index}>
                  <td>{etf.Ticker}</td>
                  <td>{etf.Type}</td>
                  <td>{etf.FundFlow}</td>
                  <td>{etf.Details}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <input
                    type="text"
                    name="Ticker"
                    value={newETF.Ticker}
                    onChange={handleETFChange}
                    placeholder="Ticker"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="Type"
                    value={newETF.Type}
                    onChange={handleETFChange}
                    placeholder="Type"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="FundFlow"
                    value={newETF.FundFlow}
                    onChange={handleETFChange}
                    placeholder="Fund Flow"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="Details"
                    value={newETF.Details}
                    onChange={handleETFChange}
                    placeholder="Details"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="add-btn" onClick={handleAddETF} disabled={!newETF.Ticker || !newETF.Type || !newETF.FundFlow || !newETF.Details}>
            Add ETF
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
