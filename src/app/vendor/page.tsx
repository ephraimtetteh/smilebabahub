'use client'

import FilterCards from './(components)/FilterCards'
import PerformanceMetrics from './(components)/PerformanceMetrics'
import React from 'react'
import ProtectedRoute from '@/src/components/ProtectRoute'


const page = () => {
  return (
    <ProtectedRoute>
      <div className="px-3">
        <FilterCards />
        <PerformanceMetrics />
      </div>
    </ProtectedRoute>
  );
}

export default page