// src/pages/About.js
import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About me 👋</h1>
        <p>성장하는 개발자 한승준입니다.</p>
      </div>

      <div className="about-section">
        <h2>프로필</h2>
        <div className="profile-container">
          <div className="profile-image-container">
            <img 
              src="/images/about-profile.jpeg"   
              alt="프로필 사진" 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f4f8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%234a6fa5'%3E프로필 사진%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="profile-image-placeholder">
              <p>프로필 사진을 추가하려면</p>
              <p>public/images 폴더에 profile.png 파일을 넣어주세요</p>
            </div>
          </div>
          <div className="profile-info">
            <div className="social-links">
              <a href="https://blog.dosawas.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                블로그
              </a>
              <a href="https://youtube.com/@dosawas" className="social-link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
                유튜브
              </a>
            </div>
            <div className="profile-links">
              <a href="https://solved.ac/profile/dosawas" className="profile-link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                solved.ac 프로필
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Problem Solving</h2>
        <div className="profile-links">
          <a href="https://codeforces.com/profile/dosaseung" className="profile-link" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Codeforces
          </a>
          <a href="https://www.acmicpc.net/user/dosawas" className="profile-link" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            Baekjoon Online Judge
          </a>
          <a href="https://solved.ac/profile/dosawas" className="profile-link" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            solved.ac
          </a>
          <a href="https://atcoder.jp/users/dosawas" className="profile-link" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            AtCoder
          </a>
        </div>
      </div>

      <div className="about-section">
        <h2>Studying</h2>
        <div className="skills-container">
          <div className="skill-item">Rust</div>
        </div>
      </div>

      <div className="about-section">
        <h2>Skills</h2>
        <div className="skills-container">
          <div className="skill-item">Python</div>
          <div className="skill-item">C</div>
          <div className="skill-item">C++</div>
        </div>
      </div>

      <div className="about-section">
        <h2>Achievements</h2>
        <ul className="achievements-list">
          <li className="achievement-item">
            <div className="achievement-year">2022</div>
            <div className="achievement-content">
              <p>2022 홍익대학교 프로그래밍 경진대회 은상(3위)</p>
              <p>2022 Summer ICPC Sinchon Camp Contest 중급 7위</p>
            </div>
          </li>
          <li className="achievement-item">
            <div className="achievement-year">2023</div>
            <div className="achievement-content">
              <p>2023 Winter ICPC Sinchon Camp Contest 중급 3위</p>
              <p>2023 Summer ICPC Sinchon Camp Contest 중급 2위</p>
              <p>SCPC 1차 예선 통과 (4솔)</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="about-section">
        <h2>관심 분야</h2>
        <div className="interests-container">
          <div className="interest-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span>알고리즘</span>
          </div>
          <div className="interest-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>웹 개발</span>
          </div>
          <div className="interest-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>백엔드 개발</span>
          </div>
          <div className="interest-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>보안</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>하고 싶은 말</h2>
        <div className="message-container">
          <p>
            <b>안녕하세요! 저는 알고리즘에 관심이 많은 개발자입니다.</b> <br/>
            항상 새로운 기술을 배우고 적용하는 것을 좋아하며, 
            문제 해결 능력을 향상시키기 위해 알고리즘 문제를 꾸준히 풀고 있습니다.
          </p>
        </div>
        <div className="message-container">
          <p>
            앞으로도 다양한 프로젝트를 통해 실력을 키우고, 
            더 나은 개발자가 되기 위해 노력하겠습니다.
          </p>
        </div>
        <div className="message-container">
          <p>
            함께 성장하는 개발자가 되고 싶습니다. 
            관심 있으신 분들과 함께 프로젝트를 진행하거나 
            기술적인 이야기를 나누면 좋겠습니다.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;