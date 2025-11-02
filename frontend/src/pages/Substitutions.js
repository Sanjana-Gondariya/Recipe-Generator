import React, { useState } from 'react';
import api from '../services/api';
import './Substitutions.css';

function Substitutions() {
  const [formData, setFormData] = useState({
    ingredient: '',
    context: '',
    dietary_restrictions: '',
    cooking_method: ''
  });
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubstitutions([]);
    setLoading(true);

    try {
      const response = await api.post('/substitutions', formData);
      
      if (response.data && response.data.substitutions) {
        setSubstitutions(Array.isArray(response.data.substitutions) 
          ? response.data.substitutions 
          : [response.data.substitutions]);
        
        if (response.data.message) {
          setError(response.data.message);
        } else {
          setError('');
        }
      } else {
        setError('No substitutions found for this ingredient');
        setSubstitutions([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to get substitution suggestions';
      setError(errorMessage);
      setSubstitutions([]);
      console.error('Substitution error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="substitutions-page">
      <div className="container">
        <div className="page-header">
          <h1>Ingredient Substitutions</h1>
          <p>Find alternatives for ingredients you don't have</p>
        </div>

        <form onSubmit={handleSubmit} className="substitution-form">
          <div className="form-group">
            <label className="form-label">Ingredient to Substitute *</label>
            <input
              type="text"
              className="form-input"
              value={formData.ingredient}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredient: e.target.value }))}
              required
              placeholder="e.g., eggs, butter, milk"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Context/Dish</label>
              <input
                type="text"
                className="form-input"
                value={formData.context}
                onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                placeholder="e.g., baking, stir fry"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Restrictions</label>
              <input
                type="text"
                className="form-input"
                value={formData.dietary_restrictions}
                onChange={(e) => setFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                placeholder="e.g., vegan, gluten-free"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cooking Method</label>
            <input
              type="text"
              className="form-input"
              value={formData.cooking_method}
              onChange={(e) => setFormData(prev => ({ ...prev, cooking_method: e.target.value }))}
              placeholder="e.g., frying, baking"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Finding Substitutions...' : 'Find Substitutions'}
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching for the best substitutions...</p>
          </div>
        )}

        {substitutions.length > 0 && (
          <div className="substitutions-results">
            <h2>Substitution Options for "{formData.ingredient}"</h2>
            <div className="substitutions-grid">
              {substitutions.map((sub, index) => (
                <div key={index} className="substitution-card">
                  <h3>{sub.substitute_name}</h3>
                  
                  {sub.ratio && (
                    <div className="sub-ratio">
                      <strong>Ratio:</strong> {sub.ratio}
                    </div>
                  )}

                  {sub.reason && (
                    <div className="sub-reason">
                      <strong>Why it works:</strong>
                      <p>{sub.reason}</p>
                    </div>
                  )}

                  {sub.best_for && (
                    <div className="sub-best">
                      <strong>Best for:</strong> {sub.best_for}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Substitutions;

