import { NextRequest, NextResponse } from 'next/server';
import {
  PersonalCommissionStats,
  DepartmentType,
} from '@/lib/types/referral';

export const dynamic = 'force-dynamic';

// 模拟业绩数据
const mockCommissions = [];

// 获取我的业绩统计
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';
    const year = searchParams.get('year') || '2024';
    const month = searchParams.get('month') || '12';

    // TODO: 从认证中获取当前用户ID
    const currentUserId = 'current_user_id';

    // 模拟业绩数据
    const stats: PersonalCommissionStats = {
      period: `${year}-${month}`,
      totalReferrals: 28,
      convertedReferrals: 18,
      successRate: 64.3,
      commissions: {
        pending: 3200,
        confirmed: 5600,
        estimated: 2800,
      },
      breakdown: [
        {
          department: 'orthokeratology' as DepartmentType,
          referrals: 15,
          conversions: 10,
          commission: 4200,
        },
        {
          department: 'refractive' as DepartmentType,
          referrals: 13,
          conversions: 8,
          commission: 4600,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching my commissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取我的业绩失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
