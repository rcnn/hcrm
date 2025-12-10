import { Customer, ExaminationRecord, CustomerCategory, ProductType } from '@/lib/types/customer';

// 姓氏库
const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
// 名字库
const givenNames = ['小明', '小红', '小龙', '小美', '小刚', '小华', '小芳', '小军', '小丽', '小伟', '浩然', '子轩', '梓涵', '一诺', '欣怡', '雨萱', '宇轩', '思琪', '佳怡', '子墨'];

// 员工数据
const staff = [
  { id: '1', name: '张医生' },
  { id: '2', name: '李护士' },
  { id: '3', name: '王验光师' },
  { id: '4', name: '赵助理' },
  { id: '5', name: '孙销售' },
  { id: '6', name: '周医生' },
  { id: '7', name: '吴验光师' },
];

const hospitals = ['总部医院', '分院一', '分院二', '社区门诊'];
const categories: CustomerCategory[] = ['potential', 'converted', 'upgrade', 'referral', 'churn'];
const products: ProductType[] = ['角塑', '框架镜', '无'];

// 生成随机日期
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 生成随机检查记录（更真实的数据）
const generateExaminations = (customerId: string, count: number, startAge: number): ExaminationRecord[] => {
  const records: ExaminationRecord[] = [];
  const now = new Date();

  // 初始度数根据年龄设定
  let baseOdRefraction = -50 - startAge * 15 + (Math.random() - 0.5) * 50;
  let baseOsRefraction = -50 - startAge * 15 + (Math.random() - 0.5) * 50;
  let baseOdAxial = 22.5 + startAge * 0.15 + (Math.random() - 0.5) * 0.5;
  let baseOsAxial = 22.5 + startAge * 0.15 + (Math.random() - 0.5) * 0.5;

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i * 4); // 每4个月一次检查

    // 度数增长（每次增加15-40度）
    const odGrowth = 15 + Math.random() * 25;
    const osGrowth = 15 + Math.random() * 25;
    baseOdRefraction -= odGrowth;
    baseOsRefraction -= osGrowth;

    // 眼轴增长（每次增加0.05-0.15mm）
    const axialGrowth = 0.05 + Math.random() * 0.1;
    baseOdAxial += axialGrowth;
    baseOsAxial += axialGrowth + (Math.random() - 0.5) * 0.02;

    const isAbnormal = Math.abs(odGrowth) > 35 || Math.abs(osGrowth) > 35 || axialGrowth > 0.12;

    records.push({
      id: `${customerId}-exam-${count - i}`,
      customerId,
      date: date.toISOString(),
      odRefraction: Math.round(baseOdRefraction),
      osRefraction: Math.round(baseOsRefraction),
      odAxialLength: parseFloat(baseOdAxial.toFixed(2)),
      osAxialLength: parseFloat(baseOsAxial.toFixed(2)),
      odVisualAcuity: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
      osVisualAcuity: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
      odK1: parseFloat((42 + Math.random() * 3).toFixed(2)),
      odK2: parseFloat((43 + Math.random() * 3).toFixed(2)),
      osK1: parseFloat((42 + Math.random() * 3).toFixed(2)),
      osK2: parseFloat((43 + Math.random() * 3).toFixed(2)),
      intraocularPressure: Math.round(14 + Math.random() * 6),
      isAbnormal,
      notes: isAbnormal ? '度数增长较快，建议加强控制' : undefined,
      createdAt: date.toISOString(),
    });
  }

  return records;
};

// 生成单个客户
const generateCustomer = (index: number): Customer => {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
  const name = surname + givenName;

  const age = Math.floor(6 + Math.random() * 12); // 6-18岁
  const gender: 'M' | 'F' = Math.random() > 0.5 ? 'M' : 'F';

  const category = categories[Math.floor(Math.random() * categories.length)];
  const currentProduct = category === 'potential' ? '无' : products[Math.floor(Math.random() * 2)];

  const staffMember = staff[Math.floor(Math.random() * staff.length)];
  const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];

  const firstVisitDate = randomDate(new Date('2021-01-01'), new Date('2024-06-01'));
  const lastVisitDate = randomDate(firstVisitDate, new Date());

  const examCount = category === 'potential' ? 0 : Math.floor(3 + Math.random() * 8); // 3-10次检查

  const id = `C${String(index + 1).padStart(3, '0')}`;

  return {
    id,
    name,
    age,
    gender,
    parentName: surname + (gender === 'M' ? '爸爸' : '妈妈'),
    parentPhone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    category,
    currentProduct,
    owner: staffMember.id,
    ownerName: staffMember.name,
    hospital,
    firstVisitDate: firstVisitDate.toISOString(),
    lastVisitDate: lastVisitDate.toISOString(),
    lastCheckDate: examCount > 0 ? lastVisitDate.toISOString() : undefined,
    examinations: generateExaminations(id, examCount, age),
    createdAt: firstVisitDate.toISOString(),
    updatedAt: lastVisitDate.toISOString(),
  };
};

// 生成100+条客户数据
export const mockCustomers: Customer[] = Array.from({ length: 120 }, (_, i) => generateCustomer(i));

// 根据ID获取客户
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((customer) => customer.id === id);
};

// 根据归属人获取客户
export const getCustomersByOwner = (ownerId: string): Customer[] => {
  return mockCustomers.filter((customer) => customer.owner === ownerId);
};

// 根据分类获取客户
export const getCustomersByCategory = (category: CustomerCategory): Customer[] => {
  return mockCustomers.filter((customer) => customer.category === category);
};

// 搜索客户
export const searchCustomers = (keyword: string): Customer[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(lowerKeyword) ||
      customer.parentName.toLowerCase().includes(lowerKeyword) ||
      customer.parentPhone.includes(keyword)
  );
};

// 获取图表数据
export const getChartData = (customerId: string, metric: 'refraction' | 'axialLength') => {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  return customer.examinations.map((exam) => ({
    date: new Date(exam.date).toLocaleDateString('zh-CN', { year: '2-digit', month: '2-digit' }),
    odValue: metric === 'refraction' ? exam.odRefraction : exam.odAxialLength,
    osValue: metric === 'refraction' ? exam.osRefraction : exam.osAxialLength,
  }));
};

// 获取客户统计
export const getCustomerStats = () => {
  const stats = {
    total: mockCustomers.length,
    byCategory: {} as Record<CustomerCategory, number>,
    byProduct: {} as Record<string, number>,
  };

  categories.forEach((cat) => {
    stats.byCategory[cat] = mockCustomers.filter((c) => c.category === cat).length;
  });

  products.forEach((prod) => {
    stats.byProduct[prod] = mockCustomers.filter((c) => c.currentProduct === prod).length;
  });

  return stats;
};
