"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CardInfo from "./_components/CardInfo";
import { desc, sql } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import BarChartDashBoard from "./_components/BarChartDashBoard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user]);

  /**
   * Fetch the list of budgets along with total spend and total expenses count for each budget.
   */
  const getBudgetList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select({
          id: Budgets.id,
          name: Budgets.name,
          createdBy: Budgets.createdBy,
          amount: Budgets.amount,
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          totalCount: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.id);

      setBudgetList(result);
      getAllExpenses();
    } catch (error) {
      console.error("Error fetching budget list:", error);
      setError("Failed to fetch budget list.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Used to get all expenses belonging to user
   */

  const getAllExpenses = async () => {
    const res = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(res);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl md:text-2xl lg:text-3xl">Hi, {user?.fullName} 👋</h2>
        {/* Link to Budget Section */}
        <Link href="/dashboard/budgets"
        >
          <button className="bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-lg w-full md:w-auto text-sm md:text-base
          flex justify-center items-center gap-2
          ">
          <Plus /> Create Budgets
          </button>
        </Link>
      </div>
      <p className="text-gray-500 mt-2">
        Insights about your money, expenses, and budget
      </p>

      {/* Conditional rendering for loading, error, or displaying content */}
      {loading ? (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              key={index}
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <CardInfo budgetList={budgetList} />
          <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-6">
            <div className="col-span-2">
              <BarChartDashBoard budgetList={budgetList} />
              <h1 className="text-lg font-bold p-2 mt-2">Latest Expenses</h1>
              <ExpenseListTable
                expensesLists={expensesList}
                refreshData={() => getBudgetList()}
              />
            </div>
            {/* Budget items other content */}
            <div className="grid gap-5">
              <h2 className="font-bold text-lg">Latest Budget</h2>
              {budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
