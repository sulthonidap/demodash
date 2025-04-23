import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Layout } from '../components/layout/Layout';
import { TicketList } from '../components/tickets/TicketList';
import { TicketForm } from '../components/tickets/TicketForm';
import { mockTickets } from '../data/mockData';

const TicketsPage: React.FC = () => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState(mockTickets);
  const [isCreating, setIsCreating] = useState(false);

  const handleNewTicket = () => {
    setIsCreating(true);
  };

  const handleSubmitTicket = (newTicket: any) => {
    setTickets([newTicket, ...tickets]);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">IT Ticket</h1>
          <p className="text-gray-500">Kelola dan lacak permintaan dukungan IT</p>
        </div>

        {isCreating ? (
          <TicketForm onSubmit={handleSubmitTicket} onCancel={handleCancel} />
        ) : (
          <TicketList tickets={tickets} onNewTicket={handleNewTicket} />
        )}
      </div>
    </Layout>
  );
};

export default TicketsPage;