import { apiGet, apiPost } from "./api_service";

export const fetchPendingTransactions = async () => {
  try {
    return await apiGet("/blockchain/pending-transactions");
  } catch (error) {
    console.error("Error fetching pending transactions", error);
    throw error;
  }
};

export const approveTransaction = async (transactionId) => {
  try {
    return await apiPost("/blockchain/approve-transaction", {
      transactionId,
    });
  } catch (error) {
    console.error("Error approving transaction", error);
    throw error;
  }
};

export const rejectTransaction = async (transactionId) => {
  try {
    return await apiPost("/blockchain/reject-transaction", {
      transactionId,
    });
  } catch (error) {
    console.error("Error rejecting transaction", error);
    throw error;
  }
};

export const getBlockchainStats = async () => {
  try {
    return await apiGet("/blockchain/stats");
  } catch (error) {
    console.error("Error fetching blockchain stats", error);
    throw error;
  }
};
