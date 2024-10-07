"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { db } from "@/utils/dbConfig";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";

const BudgetList = ({ refreshData }) => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Error state to handle failures

  useEffect(() => {
    // Only fetch budgets if the user is available
    if (user) {
      getBudgetList();
    }
  }, [user]); // Re-run when user changes

  /**
   * Fetch the list of budgets along with total spend and total expenses count for each budget.
   */
  const getBudgetList = async () => {
    setLoading(true); // Set loading to true before fetching data
    setError(null); // Clear any previous errors
    try {
      // Perform the SQL query to get the budgets along with their total spend and total count
      const result = await db
        // Select all columns from the Budgets table
        .select({
          ...getTableColumns(Budgets),

           // Calculate the total spend from the Expenses table for each budget
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          // Count the total number of expenses related to each budget
          totalCount: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets) // Select from the Budgets table
        // Join the Expenses table on matching budgetId with Budgets.id
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))

        .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
        // Group the results by Budgets.id so that totals are calculated per budget
        .groupBy(Budgets.id)

      // Set the fetched data into state
      setBudgetList(result);
    } catch (error) {
      // Handle any errors that occur during the query
      console.error("Error fetching budget list:", error);
      setError("Failed to fetch budget list."); // Set error state
    } finally {
      setLoading(false); // Stop loading when fetching is complete
    }
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget
          // immediately add the budget to the screen after creation
          refreshData={() => getBudgetList()} // Pass down the refresh function
        />
        {/* Show skeleton loader if data is loading */}
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
            ></div>
          ))
        ) : error ? (
          <p className="text-red-500">Error: {error}</p> // Show error message if an error occurs
        ) : budgetList.length > 0 ? (
          budgetList.map((budget, index) => (
            <BudgetItem key={index} budget={budget} />
          ))
        ) : (
          <p>No budgets found.</p> // Show this message when no budgets are available
        )}
      </div>
    </div>
  );
};

export default BudgetList;
