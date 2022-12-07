import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import StudyRoomListPage from '@pages/StudyRoomListPage';
import MainPage from '@pages/MainPage';
import InitPage from '@pages/InitPage';
import StudyRoomPage from '@pages/StudyRoomPage';
import SfuPage from '@pages/SfuPage';
import MeshPage from '@pages/MeshPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/study-room/:roomId" element={<StudyRoomPage />} />
        <Route path="/study-rooms" element={<StudyRoomListPage />} />
        <Route path="/study-room-sfu" element={<SfuPage />} />
        <Route path="/study-room-mesh" element={<MeshPage />} />
      </Routes>
    </BrowserRouter>
  );
}
