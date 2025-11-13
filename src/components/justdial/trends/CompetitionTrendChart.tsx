
'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trendsChartData } from '@/lib/justdial-data';

type CompetitionTrendChartProps = {
  activeTab: 'searches' | 'calls';
  onTabChange: (tab: 'searches' | 'calls') => void;
};

export function CompetitionTrendChart({ activeTab, onTabChange }: CompetitionTrendChartProps) {
  const data = trendsChartData[activeTab];
  const ChartComponent = activeTab === 'searches' ? BarChart : LineChart;
  
  return (
    <Card className="bg-white">
      <CardHeader>
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'searches' | 'calls')}>
          <TabsList>
            <TabsTrigger value="searches">Searches</TabsTrigger>
            <TabsTrigger value="calls">Call</TabsTrigger>
          </TabsList>
        </Tabs>
        <CardTitle className="text-sm font-normal text-gray-600 pt-2">
            {activeTab === 'searches' ? 'Users searched for your categories in last 3 months in your area' : 'Users called for similar businesses like yours in last 3 months in your area'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ChartComponent data={data.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const isProjected = payload[0].payload.projected;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                       <p className="font-bold">{`${payload[0].value}`}</p>
                       <p className="text-xs text-muted-foreground">{label}</p>
                       {isProjected && <p className="text-xs text-accent">Projected</p>}
                    </div>
                  );
                }
                return null;
              }}
            />
            {activeTab === 'searches' ? (
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.data.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
            ) : (
                <Line type="monotone" dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2} dot={{r: 6, fill: "var(--color-chart-1)"}} activeDot={{r: 8, fill: "var(--color-chart-1)"}}/>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
