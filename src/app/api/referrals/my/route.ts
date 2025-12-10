import { NextRequest, NextResponse } from 'next/server';
import { Referral } from '@/lib/types/referral';

export const dynamic = 'force-dynamic';

// 模拟转诊数据存储
const mockReferrals: Referral[] = [];

// 获取我的转诊
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const targetDepartment = searchParams.get('targetDepartment');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // TODO: 从认证中获取当前用户ID
    const currentUserId = 'current_user_id';

    // 筛选我的转诊
    let filteredReferrals = mockReferrals.filter(
      (r) => r.referrerId === currentUserId
    );

    if (status) {
      filteredReferrals = filteredReferrals.filter((r) => r.status === status);
    }

    if (targetDepartment) {
      filteredReferrals = filteredReferrals.filter(
        (r) => r.targetDepartment === targetDepartment
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReferrals = filteredReferrals.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        total: filteredReferrals.length,
        items: paginatedReferrals,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching my referrals:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取我的转诊失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
