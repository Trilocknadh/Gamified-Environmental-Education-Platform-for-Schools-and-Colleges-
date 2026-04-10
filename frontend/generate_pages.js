import fs from 'fs';

const pages = [
  'StudentDashboard',
  'EcoActivities',
  'Quiz',
  'Subjects',
  'Leaderboard',
  'Profile',
  'TeacherDashboard',
  'AdminPanel'
];

pages.forEach(page => {
  const code = `import React from 'react';

const ${page} = () => {
  return (
    <div className="flex justify-center flex-col items-center min-h-screen p-8 text-slate-100">
      <h1 className="text-4xl font-bold text-emerald-400 mb-4">${page}</h1>
      <p className="text-slate-400">Coming Soon</p>
    </div>
  );
};

export default ${page};
`;
  fs.writeFileSync(`./src/pages/${page}.jsx`, code);
});
