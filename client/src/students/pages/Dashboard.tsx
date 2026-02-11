import React from "react";
import StudentProfile from "../components/StudentProfile";
import PageHeader from "../components/PageHeader";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your learning progress"
      />
      <StudentProfile />
    </div>
  );
};

export default Dashboard;
