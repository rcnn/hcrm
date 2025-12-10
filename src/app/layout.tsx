import './globals.css';
import { ConfigProvider, theme } from 'antd';
import type { Metadata } from 'next';
import { medicalTheme } from '@/lib/config/theme';

export const metadata: Metadata = {
  title: 'HCRM客户长期价值管理系统',
  description: '基于数据驱动的客户全生命周期管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ConfigProvider theme={medicalTheme}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
