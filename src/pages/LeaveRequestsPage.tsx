import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Layout } from '../components/layout/Layout';
import { LeaveRequestList } from '../components/leave/LeaveRequestList';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { mockLeaveRequests } from '../data/mockData';

const LeaveRequestsPage: React.FC = () => {
  const { showToast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [isCreating, setIsCreating] = useState(false);

  const handleNewRequest = () => {
    setIsCreating(true);
  };

  const handleSubmitRequest = (newRequest: any) => {
    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Permintaan Cuti</h1>
          <p className="text-gray-500">Ajukan dan kelola permintaan cuti serta waktu libur</p>
        </div>

        {isCreating ? (
          <LeaveRequestForm onSubmit={handleSubmitRequest} onCancel={handleCancel} />
        ) : (
          <LeaveRequestList leaveRequests={leaveRequests} onNewRequest={handleNewRequest} />
        )}
      </div>
    </Layout>
  );
};

export default LeaveRequestsPage;