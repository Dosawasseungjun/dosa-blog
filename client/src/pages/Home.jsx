// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/animations.css';
import '../styles/slick.css';
import '../styles/home.css';

const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false
  };

  const slides = [
    {
      image: '/images/slide1.png',
      title: '환영합니다',
      description: '제 블로그에 오신 것을 환영합니다'
    },
    {
      image: '/images/slide2.png',
      title: '최신 포스트',
      description: '새로운 이야기를 만나보세요'
    },
    {
      image: '/images/slide3.png',
      title: '카테고리',
      description: '관심 있는 주제를 찾아보세요'
    }
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <div 
                className="slide-background"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-content">
                  <h1 className="slide-title animate-fade-in">{slide.title}</h1>
                  <p className="slide-description animate-slide-up">{slide.description}</p>
                  <Link to="/posts" className="slide-button animate-bounce-subtle">
                    포스트 보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section className="home-about-section">
        <div className="about-content">
          <h2 className="animate-slide-right">About Me</h2>
          <p className="animate-slide-left">
            안녕하세요! 저는 블로그를 통해 다양한 이야기를 공유하고 있습니다.
          </p>
          <Link to="/about" className="about-button animate-bounce-subtle">
            더 알아보기
          </Link>
        </div>
        <div className="about-image animate-slide-left">
          <img src="/images/about-placeholder.jpeg" alt="About Me" />
        </div>
      </section>

      <section className="recent-posts-section">
        <div className="recent-posts-image animate-slide-right">
          <img src="/images/posts-placeholder.png" alt="Recent Posts" />
        </div>
        <div className="recent-posts-content">
          <h2 className="animate-slide-left">최신 포스트</h2>
          <p className="animate-slide-right">
            최근에 작성한 포스트들을 확인해보세요.
          </p>
          <Link to="/posts" className="recent-posts-button animate-bounce-subtle">
            모든 포스트 보기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;