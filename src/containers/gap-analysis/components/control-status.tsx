'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '~/app/_components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '~/app/_components/ui/tabs';
import { Badge } from '~/app/_components/ui/badge';

import { CheckCheck, X, Hourglass, Clock, Link } from 'lucide-react';
import { Button } from '~/app/_components/ui/button';

type Control = {
  title: string;
  description: string;
  status: 'Passing' | 'Failing' | 'Pending';
  evidence: string;
  date: string;
};

export default function ControlStatus() {
  const [activeTab, setActiveTab] = useState('all');

  const controls: Control[] = [
    ...Array(3)
      .fill(null)
      .map(
        (): Control => ({
          title: 'Employee background checks performed',
          description:
            'The employee performs background checks on new employees',
          status: 'Passing',
          evidence: '2 Documents',
          date: '01/01/2023',
        })
      ),
    // Failing controls
    ...Array(4)
      .fill(null)
      .map(
        (): Control => ({
          title: 'Employee background checks performed',
          description:
            'The employee performs background checks on new employees',
          status: 'Failing',
          evidence: 'Not yet Provided',
          date: '01/01/2023',
        })
      ),
    // Pending controls
    ...Array(2)
      .fill(null)
      .map(
        (): Control => ({
          title: 'Employee background checks performed',
          description:
            'The employee performs background checks on new employees',
          status: 'Pending',
          evidence: '2 Documents',
          date: '01/01/2023',
        })
      ),
  ];

  const filteredControls = controls.filter(
    (control) =>
      activeTab === 'all' || control.status.toLowerCase() === activeTab
  );

  const passingControls = controls.filter((c) => c.status === 'Passing');
  const failingControls = controls.filter((c) => c.status === 'Failing');
  const pendingControls = controls.filter((c) => c.status === 'Pending');

  return (
    <div className="p-6 bg-[#F9F9FB] rounded-lg shadow-sm w-full">
      <h1 className="text-xl font-semibold mb-6">Control Status Overview</h1>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="all" className="text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="passing" className="text-sm">
                Passing
              </TabsTrigger>
              <TabsTrigger value="failing" className="text-sm">
                Failing
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-sm">
                Pending
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a control"
              className="pl-8 w-[300px]"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 text-sm text-muted-foreground font-medium">
                CONTROL
              </th>
              <th className="text-left py-2 px-4 text-sm text-muted-foreground font-medium">
                STATUS
              </th>
              <th className="text-left py-2 px-4 text-sm text-muted-foreground font-medium">
                EVIDENCE
              </th>
              <th className="text-left py-2 px-4 text-sm text-muted-foreground font-medium">
                LAST REVIEWED DATE
              </th>
            </tr>
          </thead>

          <tbody>
            {(activeTab === 'all' || activeTab === 'passing') &&
              passingControls.length > 0 && (
                <>
                  <tr className="border-b bg-[#F9F9FB]">
                    <td colSpan={3} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Passing</span>
                          <CheckCheck className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </td>

                    <td>
                      <Button variant="ghost" className="text-sm">
                        {passingControls.length} Controls
                      </Button>
                    </td>
                  </tr>

                  {passingControls.map((control, index) => (
                    <tr key={`passing-${index}`} className="border-b">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{control.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {control.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {control.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link />
                          {control.evidence}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {control.date}
                      </td>
                    </tr>
                  ))}
                </>
              )}

            {(activeTab === 'all' || activeTab === 'failing') &&
              failingControls.length > 0 && (
                <>
                  <tr className="border-b bg-[#F9F9FB]">
                    <td colSpan={3} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Failing</span>
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                    </td>

                    <td>
                      <Button variant="ghost" className="text-sm">
                        {failingControls.length} Controls
                      </Button>
                    </td>
                  </tr>

                  {failingControls.map((control, index) => (
                    <tr key={`failing-${index}`} className="border-b">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{control.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {control.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          {control.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {control.evidence === 'Not yet Provided' ? (
                            control.evidence
                          ) : (
                            <>
                              <Link />
                              {control.evidence}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {control.date}
                      </td>
                    </tr>
                  ))}
                </>
              )}

            {(activeTab === 'all' || activeTab === 'pending') &&
              pendingControls.length > 0 && (
                <>
                  <tr className="border-b bg-[#F9F9FB]">
                    <td colSpan={3} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Pending</span>
                          <Hourglass className="h-4 w-4 text-orange-500" />
                        </div>
                      </div>
                    </td>

                    <td>
                      <Button variant="ghost" className="text-sm">
                        {pendingControls.length} Controls
                      </Button>
                    </td>
                  </tr>

                  {pendingControls.map((control, index) => (
                    <tr key={`pending-${index}`} className="border-b">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{control.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {control.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          {control.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link />
                          {control.evidence}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {control.date}
                      </td>
                    </tr>
                  ))}
                </>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
