import DashboardPage from '~/containers/gap-analysis';
import type { Metadata } from 'next';
import { api } from '~/trpc/server';

export const metadata: Metadata = {
  title: 'Gap Analysis',
};

export default function GapAnalysis() {
  void api.integrations.get.prefetch();
  void api.frameworks.getWithCompletion.prefetch();

  return <DashboardPage />;
}
