import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherBot from './TeacherBot';
import WindowsBot from './WindowsBot';
import KaliBot from './KaliBot';
import CodeBot from './CodeBot';
import AssistantAdmin from './AssistantAdmin';
import EmailManager from './EmailManager';
import ContentManager from './ContentManager';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AssistantAdmin />} />
      <Route path="/teacher" element={<TeacherBot />} />
      <Route path="/windows" element={<WindowsBot />} />
      <Route path="/kali" element={<KaliBot />} />
      <Route path="/code" element={<CodeBot />} />
      <Route path="/emails" element={<EmailManager />} />
      <Route path="/contents" element={<ContentManager />} />
    </Routes>
  );
}

export default AdminRoutes;