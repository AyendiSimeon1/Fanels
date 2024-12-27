import React from 'react';
import DashboardLayout from '@/components/Dashboard/layout'
import { DashboardView } from '@/components/Dashboard/DashboardTypes';
import { DashboardNav } from '@/components/Dashboard/Nav';
const DashboardPage: React.FC = () => {
    return (
        <div>
            <DashboardLayout children={<DashboardView />} />
        </div>
    );
};

export default DashboardPage;