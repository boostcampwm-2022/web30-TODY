import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import StudyRoomListPage from '@pages/StudyRoomListPage';
import MainPage from '@pages/MainPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/study-rooms" element={<StudyRoomListPage />} />
      </Routes>
    </BrowserRouter>
  );
}
