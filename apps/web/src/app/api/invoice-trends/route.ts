// File: apps/web/src/app/api/invoice-trends/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // SQL query to extract year and month, and aggregate count and sum
    // We cast the results to standard types (int and float) for easier handling in JS
    const rawResults = await prisma.$queryRaw`
      SELECT
        EXTRACT(YEAR FROM issue_date) AS year,
        EXTRACT(MONTH FROM issue_date) AS month,
        COUNT("id")::int AS volume,
        SUM(total_amount)::float AS value
      FROM "Invoice"
      WHERE status != 'DRAFT'
      GROUP BY 1, 2
      ORDER BY year ASC, month ASC
    `;

    // Map the results to a clean JSON format
    const trends = (rawResults as any[]).map(r => ({
      // Creates a clean period string, e.g., "2024-01"
      period: `${r.year}-${String(r.month).padStart(2, '0')}`, 
      volume: r.volume,
      value: r.value ? parseFloat(r.value.toFixed(2)) : 0,
    }));

    return NextResponse.json(trends);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice trends' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}