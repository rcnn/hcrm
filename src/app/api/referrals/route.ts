import { NextRequest, NextResponse } from 'next/server';
import {
  Referral,
  CreateReferralRequest,
  ReferralStats,
} from '@/lib/types/referral';

// 模拟转诊数据存储
const mockReferrals: Referral[] = [];

// 创建转诊
export async function POST(request: NextRequest) {
  try {
    const body: CreateReferralRequest = await request.json();

    // TODO: 验证用户权限
    // TODO: 验证客户是否存在

    // 创建新的转诊记录
    const newReferral: Referral = {
      id: `REF${Date.now()}`,
      sourceCustomerId: body.sourceCustomerId,
      referrerId: 'current_user_id', // TODO: 从认证中获取
      referrerRole: 'optometrist', // TODO: 从认证中获取
      targetDepartment: body.targetDepartment,
      status: 'pending',
      reason: body.reason,
      notes: body.notes,
      clinicalIndicators: body.clinicalIndicators,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockReferrals.push(newReferral);

    return NextResponse.json({
      success: true,
      data: newReferral,
    });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建转诊失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 获取转诊列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const targetDepartment = searchParams.get('targetDepartment');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // TODO: 从认证中获取当前用户ID和角色
    const currentUserId = 'current_user_id';

    // 筛选转诊（目前返回所有，后续需要根据用户权限过滤）
    let filteredReferrals = mockReferrals;

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
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取转诊列表失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
