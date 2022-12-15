import { Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import StudyRoomListPage from '@pages/StudyRoomListPage';
import MainPage from '@pages/MainPage';
import InitPage from '@pages/InitPage';
import SfuPage from '@pages/SfuPage';
import MeshPage from '@pages/MeshPage';
import PrivateRoute from '@components/common/PrivateRoute';
import StudyRoomGuard from '@components/common/StudyRoomGuard';
import NotFoundPage from '@pages/NotFoundPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<InitPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/study-room/:roomId"
        element={
          <PrivateRoute>
            <StudyRoomGuard>
              <SfuPage />
            </StudyRoomGuard>
          </PrivateRoute>
        }
      />
      <Route
        path="/study-rooms"
        element={
          <PrivateRoute>
            <StudyRoomListPage />
          </PrivateRoute>
        }
      />
      <Route path="/study-room-mesh" element={<MeshPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}
