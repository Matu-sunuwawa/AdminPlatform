
import React, { useState, useEffect } from 'react';
import '../style/css/customersPage.css';
import { useNavigate } from 'react-router-dom';

function SideBar({ activePath }) {

    const navigate = useNavigate();

    const menuItems = [
        {
          path: "/",
          icon: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          )
        },
        {
          path: "/customers",
          icon: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )
        },
        {
          path: "/disputes",
          icon: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          )
        },
        {
          path: "/transactions",
          icon: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
              />
            </svg>
          )
        },
        {
          path: "/verifybiz",
          icon: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7h-4a2 2 0 00-2-2h-4a2 2 0 00-2 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 7h4M12 14h.01"
              />
            </svg>
          )
        }
      ];

    return (
        <div className={`sidebar`}>
            <div className="sidebar-header">
                <h1>Mela</h1>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li
                    key={item.path}
                    className={`menu-item ${activePath === item.path ? "active" : ""}`}
                    onClick={() => navigate(item.path)}
                    >
                    {item.icon}
                    <span>{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SideBar
