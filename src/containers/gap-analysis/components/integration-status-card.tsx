import { ArrowRight } from 'lucide-react';
import { GitlabIcon } from '~/components/svgs/gap-analysis/gitlabicon';
import { GoogleIcon } from '~/components/svgs/gap-analysis/googleicon';
import { SupabaseIcon } from '~/components/svgs/gap-analysis/supabaseicon';
import { VercelIcon } from '~/components/svgs/gap-analysis/vercelicon';

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

export function IntegrationStatusCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-[#202020]">
          Integration Status
        </h3>
        <button className="text-[#838383] text-base font-medium flex items-center gap-1">
          View more
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {integrationstats.map((integration, idx) => {
          const Icon = integration.icon;
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon />
                <span>{integration.title}</span>
              </div>
              <div className="text-base font-medium text-[#646464]">
                <span className="text-black">
                  {integration.connectionCount}
                </span>{' '}
                Connections
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
