import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal } from "antd";
import {
  fetchPendingTransactions,
  approveTransaction,
  rejectTransaction,
} from "../services/blockchain_service";

const TransactionApproval = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadPendingTransactions();
  }, []);

  const loadPendingTransactions = async () => {
    try {
      setLoading(true);
      const pendingTxs = await fetchPendingTransactions();
      setTransactions(pendingTxs);
    } catch (error) {
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      await approveTransaction(transactionId);
      message.success("Transaction Approved");
      loadPendingTransactions();
    } catch (error) {
      message.error("Failed to approve transaction");
    }
  };

  const handleReject = async (transactionId) => {
    try {
      await rejectTransaction(transactionId);
      message.success("Transaction Rejected");
      loadPendingTransactions();
    } catch (error) {
      message.error("Failed to reject transaction");
    }
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Recipient",
      dataIndex: "recipient",
      key: "recipient",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleApprove(record.id)}
            style={{ marginRight: 8 }}
          >
            Approve
          </Button>
          <Button type="danger" onClick={() => handleReject(record.id)}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="transaction-approval-container">
      <h2>Pending Transactions</h2>
      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default TransactionApproval;
