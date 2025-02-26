import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="card">
      <div className="card-left">
        <img
          alt="Profile picture of Marie Horwitz with a colorful flower crown and sunglasses"
          src="https://storage.googleapis.com/a1aa/image/MhA3Y8KQ6G0G1v2tVd3peeE90xroFHiBY-qaFlRUXNs.jpg"
        />
        <h2>Marie Horwitz</h2>
        <p>Web Designer</p>
        <i className="fas fa-edit edit-icon"></i>
      </div>
      <div className="card-right">
        <h3>Information</h3>
        <div className="info">
          <div>
            <p>Email</p>
            <p>info@example.com</p>
          </div>
          <div>
            <p>Phone</p>
            <p>123 456 789</p>
          </div>
        </div>
        <h3>Projects</h3>
        <div className="projects">
          <div>
            <p>Recent</p>
            <p>Lorem ipsum</p>
          </div>
          <div>
            <p>Most Viewed</p>
            <p>Dolor sit amet</p>
          </div>
        </div>
        <div className="social-icons">
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
