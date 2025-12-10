import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { debounce } from '@/utils/performance';

const { Search } = Input;

interface DebouncedSearchProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  delay?: number;
  style?: React.CSSProperties;
  defaultValue?: string;
}

/**
 * 防抖搜索组件
 * 用于搜索和筛选时减少频繁请求，提高性能
 */
const DebouncedSearch: React.FC<DebouncedSearchProps> = ({
  placeholder = '请输入搜索关键词',
  onSearch,
  delay = 300,
  style,
  defaultValue = '',
}) => {
  const [value, setValue] = useState(defaultValue);

  // 创建防抖函数
  const debouncedSearch = debounce((searchValue: string) => {
    onSearch(searchValue);
  }, delay);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  // 处理搜索按钮点击
  const handleSearch = (searchValue: string) => {
    onSearch(searchValue);
  };

  return (
    <Search
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      placeholder={placeholder}
      style={style}
      allowClear
    />
  );
};

export default DebouncedSearch;
