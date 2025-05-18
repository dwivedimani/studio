
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, FileText, Users } from 'lucide-react'; // Example icons

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalPostsTitle')}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div> {/* Replace with dynamic data */}
            <p className="text-xs text-muted-foreground">
              {t('totalPostsDescription')}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('siteVisitorsTitle')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div> {/* Replace with dynamic data */}
            <p className="text-xs text-muted-foreground">
              {t('siteVisitorsDescription')}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('symptomAnalysesTitle')}
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+75</div> {/* Replace with dynamic data */}
            <p className="text-xs text-muted-foreground">
              {t('symptomAnalysesDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>{t('welcomeAdminTitle')}</CardTitle>
          <CardDescription>{t('welcomeAdminDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('dashboardOverviewContent')}</p>
          {/* More dashboard content can be added here */}
        </CardContent>
      </Card>
    </div>
  );
}
