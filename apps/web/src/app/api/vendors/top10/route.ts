// File: apps/web/src/app/api/vendors/top10/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Aggregate and group invoices by vendor ID, summing the total_amount
    const topVendorsRaw = await prisma.invoice.groupBy({
      by: ['vendor_id'],
      _sum: {
        total_amount: true,
      },
      where: {
        status: { not: 'DRAFT' },
      },
      orderBy: {
        _sum: {
          total_amount: 'desc', // Order by highest spend
        },
      },
      take: 10, // Limit to Top 10
    });

    // 2. Fetch vendor names for the top 10 IDs
    const vendorIds = topVendorsRaw.map(v => v.vendor_id);
    const vendors = await prisma.vendor.findMany({
      where: {
        id: { in: vendorIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const vendorMap = new Map(vendors.map(v => [v.id, v.name]));

    // 3. Combine results
    const topVendors = topVendorsRaw.map(v => ({
      vendorName: vendorMap.get(v.vendor_id) || 'Unknown Vendor',
      totalSpend: parseFloat((v._sum.total_amount || 0).toFixed(2)),
    }));

    return NextResponse.json(topVendors);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch top vendors' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}