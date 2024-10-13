import { UserButton } from "@clerk/nextjs";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="p-5 shadow-sm border-b flex justify-between">
      <div className="flex items-center justify-center">
        <h1 className="font-bold text-lg"><span
        className="text-primary "
        >Spend</span>{" "}Smart</h1>
        <img src="/logo.svg" className="w-10 h-5"/>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
