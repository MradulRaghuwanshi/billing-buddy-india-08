
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  change?: number;
  className?: string;
}

const StatCard = ({ title, value, icon, trend, change, className }: StatCardProps) => {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
          {trend && change !== undefined && (
            <div className="mt-2 flex items-center text-xs">
              {trend === "up" ? (
                <ArrowUpIcon className="mr-1 h-3 w-3 text-success" />
              ) : trend === "down" ? (
                <ArrowDownIcon className="mr-1 h-3 w-3 text-danger" />
              ) : null}
              <span
                className={cn(
                  trend === "up"
                    ? "text-success"
                    : trend === "down"
                    ? "text-danger"
                    : "text-gray-500"
                )}
              >
                {change}% {trend === "up" ? "increase" : trend === "down" ? "decrease" : ""}
              </span>
              <span className="ml-1 text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
