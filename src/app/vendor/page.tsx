'use client'

import FilterCards from './(components)/FilterCards'
import PerformanceMetrics from './(components)/PerformanceMetrics'
import React from 'react'


const page = () => {
  return (
    <div className="px-3">
      <FilterCards />
        <PerformanceMetrics />
    </div>
  );
}

export default page