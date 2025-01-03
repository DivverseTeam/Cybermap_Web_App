import { ArrowRight } from 'lucide-react';
import { Card } from '~/app/_components/ui/card';
import { GitlabIcon } from '~/components/svgs/gap-analysis/gitlabicon';
import { GoogleIcon } from '~/components/svgs/gap-analysis/googleicon';
import { SupabaseIcon } from '~/components/svgs/gap-analysis/supabaseicon';
import { VercelIcon } from '~/components/svgs/gap-analysis/vercelicon';
import { IntegrationStatusCard } from './integrationstatuscard';
import EvidenceChart from './evidence-chart';
import ControlsChart from './ControlsChart';

interface StatsOverviewProps {
  stats: {
    total: number;
    passing: number;
    failing: number;
    pending: number;
  };
}

const integrationstats = [
  {
    title: 'Google Cloud',
    icon: GoogleIcon,
    connectionCount: 3,
  },
  {
    title: 'Gitlab',
    icon: GitlabIcon,
    connectionCount: 5,
  },
  {
    title: 'Supabase',
    icon: SupabaseIcon,
    connectionCount: 2,
  },
  {
    title: 'Vercel',
    icon: VercelIcon,
    connectionCount: 4,
  },
];

export function ComplianceStatus({ stats }: StatsOverviewProps) {
  return (
    <div className="flex items-start justify-start flex-col gap-4">
      <p>Compliance Status</p>

      <div className="grid grid-cols-3 gap-4 mb-8 bg-[#F9F9FB] p-6 rounded-lg shadow-sm w-full">
        <IntegrationStatusCard />
        <EvidenceChart />
        <ControlsChart />
      </div>
    </div>
  );
}
