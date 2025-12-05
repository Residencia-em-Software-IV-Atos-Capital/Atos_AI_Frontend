import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ChartBar from '@/components/chartbar/chatbar'; // ajuste o caminho
import { getStaticBarChart, type BarResponse } from '@/services/dashboards';

export default function SalesOverviewCard() {
  const [barData, setBarData] = useState<BarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState('2025');

  // Anos disponíveis para o select
  const years = ['2025', '2024', '2023', '2022'];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getStaticBarChart();
        setBarData(data);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedYear]); // Recarrega quando o ano muda

  // Formatar labels dos meses (2025-01 -> Jan/2025)
  const formatMonthLabel = (monthLabel: string) => {
    const [year, month] = monthLabel.split('-');
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]}/${year}`;
  };

  // Normalizar valores (alguns vêm como objeto com source/parsedValue)
  const normalizeValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && value.parsedValue) return value.parsedValue;
    if (typeof value === 'object' && value.source) return parseFloat(value.source);
    return 0;
  };

  // Preparar dados para o ChartBar
  const chartLabels = barData?.data.map(d => formatMonthLabel(d.month_label)) || [];
  const chartValues = barData?.data.map(d => normalizeValue(d.total_sales)) || [];

  // Calcular totais para exibição
  const totalSales = chartValues.reduce((sum, val) => sum + val, 0);
  const averageSales = chartValues.length > 0 ? totalSales / chartValues.length : 0;

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow dark:shadow-md dark:hover:shadow-lg border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Visão Geral
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Últimos 12 meses</p>
          </div>
          <div className="w-32">
            <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow dark:shadow-md dark:hover:shadow-lg border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Visão Geral
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Últimos 12 meses</p>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex justify-center items-center h-64">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow dark:shadow-md dark:hover:shadow-lg border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-foreground">
            Visão Geral
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {barData?.message || 'Últimos 12 meses'}
          </p>
        </div>
        <div className="w-32">
          <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartBar 
          labels={chartLabels} 
          values={chartValues}
          xAxisLabel={barData?.x_axis || 'Mês/Ano'}
          yAxisLabel={barData?.y_axis || 'Total de Vendas'}
        />
        
        {/* Estatísticas adicionais */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total do Período</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {formatCurrency(totalSales)}
            </p>
          </div>
          <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Média Mensal</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {formatCurrency(averageSales)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}