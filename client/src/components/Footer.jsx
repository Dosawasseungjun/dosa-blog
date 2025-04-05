// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer id="footer" className="bg-gray-100 p-4 text-center text-sm text-gray-500 mt-12">
    © {new Date().getFullYear()} dosawas 블로그. 모든 권리 보유.
  </footer>
);

export default Footer;