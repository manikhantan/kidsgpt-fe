import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/utils/constants';

// Lazy load pages for better performance
const ParentLoginPage = lazy(() => import('@/pages/auth/ParentLoginPage'));
const KidLoginPage = lazy(() => import('@/pages/auth/KidLoginPage'));
const ParentRegisterPage = lazy(() => import('@/pages/auth/ParentRegisterPage'));
const ParentDashboardPage = lazy(() => import('@/pages/parent/ParentDashboardPage'));
const ContentControlPage = lazy(() => import('@/pages/parent/ContentControlPage'));
const InsightsDashboardPage = lazy(() => import('@/pages/parent/InsightsDashboardPage'));
const ChildManagementPage = lazy(() => import('@/pages/parent/ChildManagementPage'));
const ParentChatPage = lazy(() => import('@/pages/parent/ParentChatPage'));
const AllParentChatsPage = lazy(() => import('@/pages/parent/AllParentChatsPage'));
const KidChatPage = lazy(() => import('@/pages/kid/KidChatPage'));
const AllChatsPage = lazy(() => import('@/pages/kid/AllChatsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.PARENT_LOGIN} replace />}
          />
          <Route path={ROUTES.PARENT_LOGIN} element={<ParentLoginPage />} />
          <Route path={ROUTES.KID_LOGIN} element={<KidLoginPage />} />
          <Route path={ROUTES.PARENT_REGISTER} element={<ParentRegisterPage />} />

          {/* Parent Protected Routes */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<ParentDashboardPage />} />
                    <Route path="content-control" element={<ContentControlPage />} />
                    <Route path="chat-history" element={<Navigate to={ROUTES.PARENT_INSIGHTS} replace />} />
                    <Route path="insights" element={<InsightsDashboardPage />} />
                    <Route path="children" element={<ChildManagementPage />} />
                    <Route path="chat" element={<ParentChatPage />} />
                    <Route path="all-chats" element={<AllParentChatsPage />} />
                    <Route
                      path="*"
                      element={<Navigate to={ROUTES.PARENT_DASHBOARD} replace />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Kid Protected Routes */}
          <Route
            path="/kid/*"
            element={
              <ProtectedRoute allowedRoles={['child']}>
                <Layout>
                  <Routes>
                    <Route path="chat" element={<KidChatPage />} />
                    <Route path="all-chats" element={<AllChatsPage />} />
                    <Route
                      path="*"
                      element={<Navigate to={ROUTES.KID_CHAT} replace />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
