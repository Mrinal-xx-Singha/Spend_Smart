import React from "react";
import BudgetList from "./_components/BudgetList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Budgets = () => {
  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl ">My Budget</h2>
        <Link href={"/dashboard"}>
          <Button>Dashboard</Button>
        </Link>
      </div>
      <BudgetList />
    </div>
  );
};

export default Budgets;
