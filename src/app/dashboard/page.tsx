'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHub from '@/components/dashboard/DashboardHub';

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardHub />
    </MainLayout>
  );
}
