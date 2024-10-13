"use client";
import { db } from "@/utils/dbConfig";
import React, { useEffect, useState } from "react";
import { eq, sql, getTableColumns, desc } from "drizzle-orm"; // Import necessary functions
import { Budgets, Expenses, Expenses as ExpensesTable } from "@/utils/schema"; // Rename to avoid conflicts
import { useUser } from "@clerk/nextjs"; // Get user data with Clerk
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenBoxIcon, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";
import Link from "next/link";

const ExpenseList = ({ params }) => {
  const [budgetList, setBudgetList] = useState([]); // State to store budget data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State to store error message
  const { user } = useUser(); // Get the current logged-in user

  const route = useRouter();

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

  /**
   * Used to Delete Budget
   *
   */
  const deleteBudget = async () => {
    const deleteExpenseResult = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();
    if (deleteExpenseResult) {
      const res = await db
        .delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();
    }
    toast("Budget Deleted");
    route.replace("/dashboard/budgets");
  };
  return (
    <div className="p-10">
    <div className="flex justify-between gap-2 px-4 items-center mb-3">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        {/* Arrow icon and text on the same line */}
        <Link href={"/dashboard/budgets"} className="flex items-center text-3xl font-bold">
          <ArrowLeft className="mr-2" />
        </Link>
        My Expenses
      </h2>
  
      {/* Button to edit expenses */}
      <div className="flex gap-2 items-center">
        {/* Edit budget component */}
        <EditBudget budgetList={budgetList} refreshData={() => getBudgetInfo()} />
        {/* option to confirm delete using ShadCN alert dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2 bg-red-500" size="lg">
              <Trash className="text-white" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                current budget along with your expenses from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  
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
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <ExpenseListTable
        expensesLists={expensesLists}
        refreshData={() => getBudgetInfo()}
      />
    </div>
  </div>
  
  );
};

export default ExpenseList;
