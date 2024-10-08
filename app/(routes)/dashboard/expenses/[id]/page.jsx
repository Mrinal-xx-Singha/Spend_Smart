"use client";
import { db } from "@/utils/dbConfig";
import React, { useEffect, useState } from "react";
import { eq, sql, getTableColumns, desc } from "drizzle-orm"; // Import necessary functions
import { Budgets, Expenses, Expenses as ExpensesTable } from "@/utils/schema"; // Rename to avoid conflicts
import { useUser } from "@clerk/nextjs"; // Get user data with Clerk
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";

const ExpenseList = ({ params }) => {
  const [budgetList, setBudgetList] = useState([]); // State to store budget data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State to store error message
  const { user } = useUser(); // Get the current logged-in user

  const [expensesLists, setExpensesLists] = useState([]);
  // Fetch budget info when component mounts or when user/params.id changes
  useEffect(() => {
    if (user && params.id) {
      getBudgetInfo(); // Fetch budget info when both user and budget ID are available
    }
  }, [user, params.id]);

  // Function to fetch budget and expense data from the database
  const getBudgetInfo = async () => {
    setLoading(true); // Show loading state
    setError(null); // Reset error state before fetching
    try {
      // Fetch budget and associated expenses data
      const result = await db
        .select({
          ...getTableColumns(Budgets), // Select all columns from Budgets table
          totalSpend: sql`SUM(${ExpensesTable.amount})`.mapWith(Number), // Calculate total spend per budget
          totalCount: sql`COUNT(${ExpensesTable.id})`.mapWith(Number), // Count total expenses per budget
        })
        .from(Budgets)
        .leftJoin(ExpensesTable, eq(Budgets.id, ExpensesTable.budgetId)) // Join Expenses table with Budgets table
        .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress)) // Filter by the logged-in user
        .where(eq(Budgets.id, params.id)) // Filter by budget ID
        .groupBy(Budgets.id); // Group by budget to get correct totals

      setBudgetList(result); // Set the fetched data into state
      getExpenseInfo();
    } catch (error) {
      console.error("Error fetching budget info:", error); // Log error for debugging
      setError("Failed to fetch budget information."); // Set error state
    } finally {
      setLoading(false); // Stop loading state after fetching
    }
  };

  // Function to fetch latest expenses
  const getExpenseInfo = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesLists(result);
  };
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">My Expenses</h2>
      {loading ? (
        <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div> // Skeleton loader
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error message
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Render a BudgetItem for each budget */}
          {budgetList.map((budget, index) => (
            <BudgetItem key={index} budget={budget} />
          ))}
          {/* Render the AddExpense component and pass required props */}
          <AddExpense
            refreshData={getBudgetInfo} // Pass the function to refresh the budget list
            budgetId={params.id} // Pass the current budget ID
            user={user} // Pass the logged-in user
          />
        </div>
      )}
      <div className="mt-4">
        <h2 className="font-bold text-lg ">Latest Expenses</h2>
        <ExpenseListTable 
        expensesLists={expensesLists}
        refreshData={()=>getBudgetInfo()}
        />
      </div>
    </div>
  );
};

export default ExpenseList;
