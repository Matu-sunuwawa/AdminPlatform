
import '../style/css/HomePage.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function HomePage() {

    return (
        <div className="homepage-container">
        <header className="homepage-header">
            <h1 className="homepage-title">Welcome to Mela Admin Dashboard</h1>
            <p className="homepage-subtitle">Your all-in-one platform to manage customers, disputes, transactions, and businesses with ease.</p>
            <Link to="/logout">
                    <Button variant="danger" className="logout-button">
                        Logout
                    </Button>
            </Link>
        </header>
        <main className="homepage-main">
            <div className="homepage-cards">
            <div className="card">
                <svg className="card-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 className="card-title">Customers</h2>
                <p className="card-description">Manage individual customer profiles, view detailed activities, and send messages.</p>
                <a href="/customers" className="card-link">Go to Customers</a>
            </div>
            <div className="card">
                <svg className="card-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7h-4a2 2 0 00-2-2h-4a2 2 0 00-2 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 7h4M12 14h.01"
                    />
                </svg>
                <h2 className="card-title">Business Customers</h2>
                <p className="card-description">Manage business and enterprise profiles, verify legitimacy, and track revenue.</p>
                <a href="/verifybiz" className="card-link">Go to Business Customers</a>
            </div>
            <div className="card">
                <svg className="card-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="card-title">Disputes</h2>
                <p className="card-description">Track, review, and resolve disputes with comprehensive insights.</p>
                <a href="/disputes" className="card-link">Go to Disputes</a>
            </div>
            <div className="card">
                <svg className="card-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
                </svg>
                <h2 className="card-title">Transactions</h2>
                <p className="card-description">Monitor real-time financial activities and transaction histories.</p>
                <a href="/transactions" className="card-link">Go to Transactions</a>
            </div>
            </div>
        </main>
        
        </div>
    );
}

export default HomePage;

