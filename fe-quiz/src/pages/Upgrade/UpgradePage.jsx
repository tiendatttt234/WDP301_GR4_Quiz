// UpgradePage.jsx
import React, { useState } from 'react';
import './UpgradePage.css';

const UpgradePage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      duration: '1 Month',
      price: 9.99,
      billing: 'Billed monthly',
      savings: ''
    },
    {
      duration: '3 Months',
      price: 24.99,
      billing: 'Billed every 3 months',
      savings: 'Save 15%'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      // Xử lý logic nâng cấp ở đây (gọi API, xử lý thanh toán, etc.)
      console.log(`Upgrading to ${selectedPlan.duration} plan`);
    }
  };

  return (
    <div className="upgrade-container">
      <h1>Upgrade to Prime</h1>
      <p className="subtitle">
        Unlock premium features and take your learning to the next level
      </p>

      <div className="plans-container">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`plan-card ${selectedPlan === plan ? 'selected' : ''}`}
            onClick={() => handlePlanSelect(plan)}
          >
            {plan.savings && <span className="savings-badge">{plan.savings}</span>}
            <h3>{plan.duration}</h3>
            <div className="price">
              ${plan.price}
              <span className="period">/{plan.duration.split(' ')[1]}</span>
            </div>
            <p className="billing">{plan.billing}</p>
            <ul className="features">
              <li>Unlimited access to all features</li>
              <li>Ad-free experience</li>
              <li>Offline access</li>
              <li>Priority support</li>
            </ul>
          </div>
        ))}
      </div>

      <button
        className="upgrade-button"
        disabled={!selectedPlan}
        onClick={handleUpgrade}
      >
        Continue with {selectedPlan ? selectedPlan.duration : 'a plan'}
      </button>

      <p className="terms">
        By upgrading, you agree to our{' '}
        <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>
      </p>
    </div>
  );
};

export default UpgradePage;