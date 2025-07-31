interface MonthlyData {
  month: number;
  monthName: string;
  orderCount: number;
}

interface MonthlyProfit {
  month: number;
  monthName: string;
  profit: number;
}

export interface OrderSummaryModel {
  totalOrderAmount: number;
  totalOrderLastMonth: number;
  totalOrdersYearToDate: number;
  totalOrderCount: number;
  currentMonthOrderCount: number;
  lastMonthOrderCount: number;
  yearToDateProfit: number;
  currentMonthProfit: number;
  orderCountByMonth: MonthlyData[];
  profitByMonth: MonthlyProfit[];
}
