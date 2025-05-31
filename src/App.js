import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from './component/Navigation';
import Login from './component/Login';
import Logout from './component/Logout';
import HomePage from './page/HomePage';
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import ReversePrivateRoute from './utils/ReversePrivateRoute';
import NotFound from './component/NotFound';
import TransactionPage from './page/TransactionPage';
import CustomersPage from './page/CustomersPage';
import DisputesPage from './page/DisputePage';
import BusinessPage from './page/BusinessPage';
import './App.css';


function App() {

  return (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/disputes" element={<DisputesPage />} />
                    <Route path="/transactions" element={<TransactionPage />} />
                    <Route path="/verifybiz" element={<BusinessPage />} />
                </Route>
                <Route path="/login" 
                    element={
                        <ReversePrivateRoute>
                            <Login />
                        </ReversePrivateRoute>
                        } 
                />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;