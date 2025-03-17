// UpgradePage.jsx
import React, { useState, useEffect } from 'react';
import './UpgradePage.css';

const UpgradePage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumPackages = async () => {
      try {
        const response = await fetch('http://localhost:9999/package/getAllPremiumPackages');
        const data = await response.json();
        
        const formattedPlans = data.map(packageItem => ({
          duration: `${packageItem.durationDays / 30} Month${packageItem.durationDays > 30 ? 's' : ''}`,
          price: packageItem.price,
          billing: `Billed every ${packageItem.durationDays} days`,
          savings: '',
          originalData: packageItem
        }));
        
        setPlans(formattedPlans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching premium packages:', error);
        setLoading(false);
      }
    };

    fetchPremiumPackages();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      // Tạo orderId duy nhất (có thể dùng timestamp hoặc UUID)
      const orderId = `ORDER_${Date.now()}`;
      const amount = selectedPlan.price;
      const orderInfo = `Upgrade to ${selectedPlan.duration} plan`;
      const createBy = localStorage.getItem('id');

      // Gửi request đến API create payment
      const response = await fetch('http://localhost:9999/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          orderInfo,
          createBy,
        }),
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // Redirect người dùng đến trang thanh toán VNPay
        window.location.href = result.paymentUrl;
      } else {
        alert('Không thể tạo link thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error during payment initiation:', error);
      alert('Có lỗi xảy ra khi khởi tạo thanh toán!');
    }
  };

  if (loading) {
    return <div>Loading packages...</div>;
  }

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
              {plan.originalData.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
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