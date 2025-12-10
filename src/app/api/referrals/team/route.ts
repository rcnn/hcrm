import { NextRequest, NextResponse } from 'next/server';
import { Referral, ReferralStats } from '@/lib/types/referral';

// 模拟转诊数据存储
const mockReferrals: Referral[] = [];

// 获取团队转诊统计
export async function GET(request: NextRequest) {
  try {
    // TODO: 从认证中获取当前用户团队信息
    const currentUserTeamId = 'team_001';

    // 计算团队统计
    const totalReferrals = mockReferrals.length;
    const convertedReferrals = mockReferrals.filter(
      (r) => r.status === 'converted'
    ).length;
    const successRate =
      totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0;

    // 按科室统计
    const orthoReferrals = mockReferrals.filter(
      (r) => r.targetDepartment === 'orthokeratology'
    );
    const refractiveReferrals = mockReferrals.filter(
      (r) => r.targetDepartment === 'refractive'
    );

    const stats: ReferralStats = {
      totalReferrals,
      convertedReferrals,
      successRate,
      pendingReferrals: mockReferrals.filter((r) => r.status === 'pending')
        .length,
      departmentStats: {
        orthokeratology: {
          count: orthoReferrals.length,
          converted: orthoReferrals.filter((r) => r.status === 'converted')
            .length,
        },
        refractive: {
          count: refractiveReferrals.length,
          converted: refractiveReferrals.filter(
            (r) => r.status === 'converted'
          ).length,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching team referrals:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取团队转诊统计失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
