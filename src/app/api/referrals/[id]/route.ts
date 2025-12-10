import { NextRequest, NextResponse } from 'next/server';
import { Referral } from '@/lib/types/referral';

// 模拟转诊数据存储
const mockReferrals: Referral[] = [];

// 获取转诊详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const referral = mockReferrals.find((r) => r.id === params.id);

    if (!referral) {
      return NextResponse.json(
        {
          success: false,
          message: '转诊记录不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: referral,
    });
  } catch (error) {
    console.error('Error fetching referral:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取转诊详情失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 更新转诊
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const referralIndex = mockReferrals.findIndex((r) => r.id === params.id);

    if (referralIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: '转诊记录不存在',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updatedReferral = {
      ...mockReferrals[referralIndex],
      ...body,
      updatedAt: new Date(),
    };

    mockReferrals[referralIndex] = updatedReferral;

    return NextResponse.json({
      success: true,
      data: updatedReferral,
    });
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新转诊失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
