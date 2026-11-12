export interface ProductQuarterMetric {
  product: string;
  unitType: 'No. of Transactions' | 'No. of Deposit Accounts' | 'No. of Subscriber';
  q1: { complaints: number; volume: number; cdr: number };
  q2: { complaints: number; volume: number; cdr: number };
  q3: { complaints: number; volume: number; cdr: number };
  trendStatus: 'RED_UP' | 'YELLOW_RIGHT' | 'GREEN_DOWN';
}

export const QUARTERLY_PRODUCT_METRICS: ProductQuarterMetric[] = [
  {
    product: "Debit Card",
    unitType: "No. of Transactions",
    q1: { complaints: 2178, volume: 2048663, cdr: 1.06 },
    q2: { complaints: 996,  volume: 2192760, cdr: 0.45 },
    q3: { complaints: 1236, volume: 2218898, cdr: 0.56 },
    trendStatus: 'RED_UP'
  },
  {
    product: "IB/Mobile banking",
    unitType: "No. of Transactions",
    q1: { complaints: 2287, volume: 2150051, cdr: 1.06 },
    q2: { complaints: 794,  volume: 2516540, cdr: 0.32 },
    q3: { complaints: 937,  volume: 2789714, cdr: 0.34 },
    trendStatus: 'YELLOW_RIGHT'
  },
  {
    product: "Branch Banking",
    unitType: "No. of Deposit Accounts",
    q1: { complaints: 726, volume: 1726567, cdr: 0.42 },
    q2: { complaints: 439, volume: 1783573, cdr: 0.25 },
    q3: { complaints: 648, volume: 1854542, cdr: 0.35 },
    trendStatus: 'RED_UP'
  },
  {
    product: "RAAST",
    unitType: "No. of Transactions",
    q1: { complaints: 2313, volume: 1700011, cdr: 1.36 },
    q2: { complaints: 2451, volume: 1980102, cdr: 1.24 },
    q3: { complaints: 1448, volume: 2402230, cdr: 0.60 },
    trendStatus: 'GREEN_DOWN'
  },
  {
    product: "SMS Alerts",
    unitType: "No. of Subscriber",
    q1: { complaints: 247, volume: 743944, cdr: 0.33 },
    q2: { complaints: 143, volume: 759355, cdr: 0.19 },
    q3: { complaints: 149, volume: 770973, cdr: 0.19 },
    trendStatus: 'YELLOW_RIGHT'
  }
];
