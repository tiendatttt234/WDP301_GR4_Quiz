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
        console.log(data);

        const formattedPlans = data.map(packageItem => ({
          name: packageItem.name,
          price: packageItem.price,
          durationDays: packageItem.durationDays,
          features: packageItem.features,
          description: packageItem.description,
          originalData: packageItem
        }));

        console.log(formattedPlans);
        
        setPlans(formattedPlans);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải gói premium:', error);
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
      const orderId = `ORDER_${Date.now()}`;
      const amount = selectedPlan.price;
      const orderInfo = `Nâng cấp lên gói ${selectedPlan.name}`;
      const createBy = localStorage.getItem('id');

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
        window.location.href = result.paymentUrl;
      } else {
        alert('Không thể tạo link thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo thanh toán:', error);
      alert('Có lỗi xảy ra khi khởi tạo thanh toán!');
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  if (loading) {
    return <div>Đang tải các gói...</div>;
  }

  return (
    <div className="upgrade-container">
      <h1>Nâng cấp lên Prime</h1>
      <p className="subtitle">
        Mở khóa các tính năng cao cấp và nâng tầm trải nghiệm học tập của bạn
      </p>

      <div className="plans-container">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`plan-card ${selectedPlan === plan ? 'selected' : ''}`}
            onClick={() => handlePlanSelect(plan)}
          >
            <h3>{plan.name}</h3>
            <div className="price">
              <div className="price-value">{formatPrice(plan.price)} VND</div>
              <span className="period">/ {plan.durationDays} ngày</span>
            </div>
            <p className="description">{plan.description}</p>
            <ul className="features">
              {plan.features.map((feature, idx) => (
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
        Tiếp tục với {selectedPlan ? selectedPlan.name : 'một gói'}
      </button>

      <p className="terms">
        Bằng việc nâng cấp, bạn đồng ý với{' '}
        <a href="#">Điều khoản Dịch vụ</a> và{' '}
        <a href="#">Chính sách Bảo mật</a> của chúng tôi
      </p>
    </div>
  );
};

export default UpgradePage;