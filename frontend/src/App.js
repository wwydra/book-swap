import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import BookDetails from './components/Book/BookDetails';
import UserAccount from './components/User/UserAccount';
import AccountSettings from './components/User/AccountSettings';
import UserPage from './components/User/UserPage';
import ExchangePage from './components/Exchange/ExchangePage';
import AddBook from './components/Book/AddBookForm';
import NewExchange from './components/Exchange/NewExchange';
import ExchangeDetails from './components/Exchange/ExchangeDetails';
import BookList from './components/Book/BookList';
import ExchangeList from './components/Exchange/ExchangeList';
import UserList from './components/User/UserList';
import EditBook from './components/Book/EditBook';

import './styles/HomePage.css';
import './styles/LoginRegisterPage.css';
import './styles/Book/BookDetails.css';
import './styles/Exchange/ExchangeDetails.css';
import './styles/Exchange/ExchangeList.css';
import './styles/Exchange/ExchangePage.css';
import './styles/Exchange/NewExchange.css';
import './styles/User/UserAccount.css';
import './styles/User/UserList.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/user/:userIdPage" element={<UserPage />} />
        <Route path="/exchanges" element={<ExchangePage />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/exchange/:bookId" element={<NewExchange />} />
        <Route path="/exchange-details/:id" element={<ExchangeDetails />} />
        <Route path="/booklist" element={<BookList />} />
        <Route path="/exchangelist" element={<ExchangeList />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
      </Routes>
    </Router>
  );
};

export default App;