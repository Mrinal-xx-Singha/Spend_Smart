import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ExpenseListTable = ({ expensesLists, refreshData }) => {
  const [deleting, setDeleting] = useState(null); // Track which expense is being deleted

  const deleteExpense = async (expense) => {
    try {
      setDeleting(expense.id); // Set the current expense as "deleting"
      // Delete query
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success("Expense deleted successfully!");
        refreshData(); // Refresh data after deletion
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    } finally {
      setDeleting(null); // Reset the deleting state
    }
  };

  return (
    <div className="mt-6">
      {/* Header Row */}
      <div className="grid grid-cols-4 bg-slate-300 p-3 rounded-t-lg text-left">
        <h2 className="font-semibold text-gray-800">Name</h2>
        <h2 className="font-semibold text-gray-800">Amount</h2>
        <h2 className="font-semibold text-gray-800">Date</h2>
        <h2 className="font-semibold text-gray-800 text-center">Action</h2>
      </div>

      {/* Expenses Rows */}
      <div className="divide-y divide-gray-200">
        {expensesLists.map((expense) => (
          <div
            key={expense.id} // Use a unique key based on the expense ID
            className="grid grid-cols-4 bg-white p-3 hover:bg-gray-50 transition-colors duration-150 text-left"
          >
            {/* Expense Name */}
            <h2 className="text-gray-700">{expense.name}</h2>

            {/* Expense Amount */}
            <h2 className="text-gray-700">
              ${parseFloat(expense.amount).toFixed(2)}
            </h2>

            {/* Formatted Date */}
            <h2 className="text-gray-700">{expense.createdAt}</h2>

            {/* Action: Delete Icon */}
            <h2 className="flex justify-center">
              <button
                aria-label="Delete expense"
                className={`text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-150 ${
                  deleting === expense.id ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={deleting === expense.id} // Disable the button while deleting
                onClick={() => deleteExpense(expense)}
              >
                {deleting === expense.id ? (
                  <span className="loader animate-spin w-5 h-5 border-2 border-t-2 border-gray-200 border-t-red-600 rounded-full"></span> // Show loading spinner while deleting
                ) : (
                  <Trash size={20} />
                )}
              </button>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseListTable;
