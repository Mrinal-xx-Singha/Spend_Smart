"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { toast } from "sonner";

const AddExpense = ({ budgetId, user, refreshData }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for feedback

  const addNewExpense = async () => {
    if (!name || amount <= 0) {
      toast.error("Please provide a valid name and amount");
      return;
    }

    setLoading(true); // Start loading
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(), // Ensure no trailing spaces
          amount: parseFloat(amount), // Ensure amount is a valid number
          budgetId: budgetId,
          createdBy: user?.primaryEmailAddress?.emailAddress, // Record who created the expense
          createdAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }), // Add current timestamp
        })
        .returning({ insertedId: Expenses.id });

      if (result) {
        refreshData(); // Refresh the data to reflect the new expense
        toast.success("New Expense Added");
        setName(""); // Clear form
        setAmount(""); // Clear form
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading} // Disable input while loading
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading} // Disable input while loading
        />
      </div>
      <Button
        disabled={!(name && amount) || loading} // Disable if invalid or loading
        onClick={addNewExpense}
        className="w-full text-white font-semibold mt-3"
      >
        {loading ? "Adding..." : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
