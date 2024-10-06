"use client";
import { useEffect } from "react";
import { db } from "@/utils/dbConfig";
import DashboardHeader from "./_components/DashboardHeader";
import SideNav from "./_components/SideNav";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const checkUserBudgets = async () => {
        try {
          const result = await db
            .select()
            .from(Budgets)
            .where(
              eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)
            );

          // If no budgets are found, redirect
          if (result.length === 0) {
            router.replace("/dashboard/budgets");
          }

          console.log(result);
        } catch (error) {
          console.error("Error fetching budgets:", error);
        }
      };

      checkUserBudgets();
    }
  }, [user, router]);

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
