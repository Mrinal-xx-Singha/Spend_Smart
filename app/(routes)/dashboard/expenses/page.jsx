"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema"; 
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

const ExpenseData = () => {
  const [expenseList, setExpenseList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      getAllExpenses();
    }
  }, [user]);

  const getAllExpenses = async () => {
    try {
      const res = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));
        
      setExpenseList(res);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div>
      <ExpenseListTable
        expensesLists={expenseList}
        refreshData={getAllExpenses} 
      />
    </div>
  );
};

export default ExpenseData;
