import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from '@components/common/Loader';

const InitPage = lazy(() => import('@pages/InitPage'));
const SfuPage = lazy(() => import('@pages/SfuPage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const SignupPage = lazy(() => import('@pages/SignupPage'));
const StudyRoomListPage = lazy(() => import('@pages/StudyRoomListPage'));
const MainPage = lazy(() => import('@pages/MainPage'));
const PrivateRoute = lazy(() => import('@components/common/PrivateRoute'));
const StudyRoomGuard = lazy(() => import('@components/common/StudyRoomGuard'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const ErrorPage = lazy(() => import('@pages/ErrorPage'));

export default function Router() {
  return (
    <Suspense fallback={<Loader />}>
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
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
