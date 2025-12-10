import {
  LeadPoolItem,
  DepartmentType,
  ReferralStatus,
} from '@/lib/types/referral';
import { User } from '@/lib/types/user';
import { mockUsers } from '@/lib/mock/users';

/**
 * 线索池服务
 */
export class LeadPoolService {
  // 模拟线索池数据
  private leadPool: Map<string, LeadPoolItem> = new Map();

  // 模拟用户负载数据
  private userWorkload: Map<string, number> = new Map();

  /**
   * 添加线索到线索池
   */
  addToPool(referralId: string, customerId: string, customerName: string, targetDepartment: DepartmentType): LeadPoolItem {
    const leadItem: LeadPoolItem = {
      id: `LEAD_${Date.now()}`,
      referralId,
      customerId,
      customerName,
      targetDepartment,
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(),
      notes: undefined,
    };

    this.leadPool.set(leadItem.id, leadItem);
    return leadItem;
  }

  /**
   * 从线索池分配线索
   */
  assignLead(leadId: string, userId: string): boolean {
    const lead = this.leadPool.get(leadId);
    if (!lead) {
      return false;
    }

    // 获取用户信息
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return false;
    }

    // 验证用户是否属于目标科室
    if (!this.isUserInDepartment(user, lead.targetDepartment)) {
      return false;
    }

    // 分配线索
    lead.assignedTo = userId;
    lead.assignedToName = user.name;
    lead.status = 'contacted';
    lead.lastContactAt = new Date();

    this.leadPool.set(leadId, lead);

    // 更新用户负载
    const currentLoad = this.userWorkload.get(userId) || 0;
    this.userWorkload.set(userId, currentLoad + 1);

    return true;
  }

  /**
   * 自动分配线索
   */
  autoAssign(leadId: string): string | null {
    const lead = this.leadPool.get(leadId);
    if (!lead) {
      return null;
    }

    // 获取目标科室的所有可用员工
    const availableStaff = this.getAvailableStaff(lead.targetDepartment);

    if (availableStaff.length === 0) {
      return null;
    }

    // 按负载均衡选择员工
    const selectedUser = this.selectByWorkload(availableStaff);

    if (selectedUser) {
      this.assignLead(leadId, selectedUser.id);
      return selectedUser.id;
    }

    return null;
  }

  /**
   * 获取目标科室的可用员工
   */
  private getAvailableStaff(department: DepartmentType): User[] {
    // 根据科室筛选员工
    // TODO: 实际应用中应该根据科室字段筛选
    return mockUsers.filter((user) => {
      if (department === 'orthokeratology') {
        return ['optometrist', 'orthokeratology_staff', 'medical_assistant'].includes(
          user.role
        );
      } else {
        return ['optometrist', 'refractive_staff', 'medical_assistant'].includes(
          user.role
        );
      }
    });
  }

  /**
   * 按负载均衡选择员工
   */
  private selectByWorkload(users: User[]): User | null {
    if (users.length === 0) {
      return null;
    }

    // 计算每个员工的当前负载
    const userLoad = users.map((user) => ({
      user,
      load: this.userWorkload.get(user.id) || 0,
    }));

    // 按负载升序排序
    userLoad.sort((a, b) => a.load - b.load);

    // 返回负载最低的员工
    return userLoad[0].user;
  }

  /**
   * 验证用户是否属于指定科室
   */
  private isUserInDepartment(user: User, department: DepartmentType): boolean {
    // TODO: 实际应用中应该根据用户的科室字段判断
    if (department === 'orthokeratology') {
      return ['optometrist', 'orthokeratology_staff', 'medical_assistant'].includes(
        user.role
      );
    } else {
      return ['optometrist', 'refractive_staff', 'medical_assistant'].includes(
        user.role
      );
    }
  }

  /**
   * 获取线索池列表
   */
  getLeadPool(department?: DepartmentType, status?: ReferralStatus): LeadPoolItem[] {
    let leads = Array.from(this.leadPool.values());

    if (department) {
      leads = leads.filter((lead) => lead.targetDepartment === department);
    }

    if (status) {
      leads = leads.filter((lead) => lead.status === status);
    }

    return leads;
  }

  /**
   * 获取我的线索
   */
  getMyLeads(userId: string, status?: ReferralStatus): LeadPoolItem[] {
    let leads = Array.from(this.leadPool.values()).filter(
      (lead) => lead.assignedTo === userId
    );

    if (status) {
      leads = leads.filter((lead) => lead.status === status);
    }

    return leads;
  }

  /**
   * 更新线索状态
   */
  updateLeadStatus(leadId: string, status: ReferralStatus, notes?: string): boolean {
    const lead = this.leadPool.get(leadId);
    if (!lead) {
      return false;
    }

    lead.status = status;
    if (notes) {
      lead.notes = notes;
    }

    if (status === 'contacted') {
      lead.lastContactAt = new Date();
    }

    if (status === 'visited' || status === 'converted') {
      lead.nextFollowUpAt = undefined;
    }

    this.leadPool.set(leadId, lead);
    return true;
  }

  /**
   * 设置下次跟进时间
   */
  setNextFollowUp(leadId: string, followUpAt: Date): boolean {
    const lead = this.leadPool.get(leadId);
    if (!lead) {
      return false;
    }

    lead.nextFollowUpAt = followUpAt;
    this.leadPool.set(leadId, lead);
    return true;
  }

  /**
   * 获取超时线索
   */
  getOverdueLeads(hoursThreshold: number = 48): LeadPoolItem[] {
    const now = new Date();
    const threshold = new Date(now.getTime() - hoursThreshold * 60 * 60 * 1000);

    return Array.from(this.leadPool.values()).filter((lead) => {
      if (lead.status !== 'pending' && lead.status !== 'contacted') {
        return false;
      }

      const lastContact = lead.lastContactAt || lead.createdAt;
      return lastContact < threshold;
    });
  }

  /**
   * 获取待跟进线索
   */
  getPendingFollowUp(): LeadPoolItem[] {
    const now = new Date();

    return Array.from(this.leadPool.values()).filter((lead) => {
      if (!lead.nextFollowUpAt) {
        return false;
      }
      return lead.nextFollowUpAt <= now && lead.status !== 'converted';
    });
  }

  /**
   * 获取线索统计
   */
  getStats(): {
    total: number;
    pending: number;
    contacted: number;
    visited: number;
    converted: number;
    failed: number;
    byDepartment: Record<DepartmentType, number>;
  } {
    const leads = Array.from(this.leadPool.values());

    const stats = {
      total: leads.length,
      pending: 0,
      contacted: 0,
      visited: 0,
      converted: 0,
      failed: 0,
      byDepartment: {
        orthokeratology: 0,
        refractive: 0,
      } as Record<DepartmentType, number>,
    };

    leads.forEach((lead) => {
      // 按状态统计
      switch (lead.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'contacted':
          stats.contacted++;
          break;
        case 'visited':
          stats.visited++;
          break;
        case 'converted':
          stats.converted++;
          break;
        case 'failed':
          stats.failed++;
          break;
      }

      // 按科室统计
      stats.byDepartment[lead.targetDepartment]++;
    });

    return stats;
  }
}

// 导出单例
export const leadPoolService = new LeadPoolService();
