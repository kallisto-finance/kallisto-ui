import React from "react";

type ToastStatus = "success" | "error";

const TransactionFeedbackToast = ({
  status,
  msg,
}: {
  status: ToastStatus;
  msg: string;
}) => (
  <div className="transaction-toast-container">
    <img className="transaction-toast-icon" src={`/assets/${status}.png`} />
    <div className="transaction-toast-text">{msg}</div>
  </div>
);

export default TransactionFeedbackToast;
