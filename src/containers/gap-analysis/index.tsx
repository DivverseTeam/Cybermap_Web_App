'use client';

import PageTitle from '~/components/PageTitle';

import { Select } from '@radix-ui/react-select';
import { Download, Settings2 } from 'lucide-react';
import { Button } from '~/app/_components/ui/button';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/_components/ui/select';
import { ISO27001Icon } from '~/components/svgs/gap-analysis/iso27001';
import { ComplianceStatus } from './components/compliance-status';
import ControlStatus from './components/control-status';
import { StatsOverview } from './components/stats-overview';

export default function GapAnalysisPage() {
  return (
    <div className="flex flex-col gap-5 px-4 [@media(min-width:1400px)]:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full gap-4">
          <PageTitle
            title="Gap"
            subtitle="Get a overview of your compliance and performance"
          />
          <Select defaultValue="iso27001">
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <ISO27001Icon />
                  <span>ISO 27001</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iso27001">ISO 27001</SelectItem>
              <SelectItem value="iso27002">ISO 27002</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated:</span>
          <span>a day ago</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Set checks interval
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <StatsOverview
        stats={{
          failing: 2,
          passing: 4,
          total: 6,
          pending: 0,
        }}
      />

      <ComplianceStatus
        stats={{
          failing: 2,
          passing: 4,
          total: 6,
          pending: 0,
        }}
      />

      <ControlStatus />
    </div>
  );
}
