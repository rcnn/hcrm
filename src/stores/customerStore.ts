import { create } from 'zustand';
import { Customer, CustomerCategory, ProductType } from '@/lib/types/customer';
import { mockCustomers, getCustomerById, getCustomersByOwner, searchCustomers } from '@/lib/mock/customers';

interface CustomerState {
  // 数据
  customers: Customer[];
  currentCustomer: Customer | null;
  selectedCustomers: string[]; // 当前选中的客户ID列表

  // 加载状态
  loading: boolean;

  // 分页状态
  currentPage: number;
  pageSize: number;
  total: number;

  // 筛选状态
  searchKeyword: string;
  selectedCategory: CustomerCategory | undefined;
  selectedProduct: ProductType | undefined;
  ageRange: [number, number];

  // 排序状态
  sortField: string;
  sortOrder: 'ascend' | 'descend' | null;

  // 方法
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  searchCustomers: (keyword: string) => void;
  getCustomersByOwner: (ownerId: string) => Customer[];

  // 筛选方法
  setCategoryFilter: (category: CustomerCategory | undefined) => void;
  setProductFilter: (product: ProductType | undefined) => void;
  setAgeRangeFilter: (range: [number, number]) => void;
  setSearchKeyword: (keyword: string) => void;

  // 分页方法
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // 排序方法
  setSorting: (field: string, order: 'ascend' | 'descend' | null) => void;

  // 选择方法
  setSelectedCustomers: (ids: string[]) => void;
  clearSelectedCustomers: () => void;

  // 重置方法
  resetFilters: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  // 初始状态
  customers: mockCustomers,
  currentCustomer: null,
  selectedCustomers: [],
  loading: false,

  // 分页初始值
  currentPage: 1,
  pageSize: 20,
  total: mockCustomers.length,

  // 筛选初始值
  searchKeyword: '',
  selectedCategory: undefined,
  selectedProduct: undefined,
  ageRange: [0, 20],

  // 排序初始值
  sortField: '',
  sortOrder: null,

  // 获取过滤后的客户列表
  fetchCustomers: async () => {
    set({ loading: true });
    // TODO: 调用API获取客户列表
    await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟API延迟
    set({ loading: false });
  },

  fetchCustomerById: async (id: string) => {
    set({ loading: true });
    const customer = getCustomerById(id);
    set({ currentCustomer: customer || null, loading: false });
  },

  searchCustomers: (keyword: string) => {
    set({ searchKeyword: keyword, currentPage: 1 });
    const results = keyword ? searchCustomers(keyword) : mockCustomers;
    set({ customers: results, total: results.length });
  },

  getCustomersByOwner: (ownerId: string) => {
    return getCustomersByOwner(ownerId);
  },

  // 筛选方法
  setCategoryFilter: (category) => {
    set({ selectedCategory: category, currentPage: 1 });
  },

  setProductFilter: (product) => {
    set({ selectedProduct: product, currentPage: 1 });
  },

  setAgeRangeFilter: (range) => {
    set({ ageRange: range, currentPage: 1 });
  },

  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword, currentPage: 1 });
  },

  // 分页方法
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
  },

  // 排序方法
  setSorting: (field, order) => {
    set({ sortField: field, sortOrder: order });
  },

  // 选择方法
  setSelectedCustomers: (ids) => {
    set({ selectedCustomers: ids });
  },

  clearSelectedCustomers: () => {
    set({ selectedCustomers: [] });
  },

  // 重置方法
  resetFilters: () => {
    set({
      searchKeyword: '',
      selectedCategory: undefined,
      selectedProduct: undefined,
      ageRange: [0, 20],
      sortField: '',
      sortOrder: null,
      currentPage: 1,
    });
  },
}));
