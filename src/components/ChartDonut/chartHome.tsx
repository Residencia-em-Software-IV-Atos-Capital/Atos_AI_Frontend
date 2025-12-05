import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChartDonut from '@/components/ChartDonut/chartdonut';
import { getStaticPieChart, type PieResponse } from '@/services/dashboards';

export default function ClientCaptureCard() {
  const [pieData, setPieData] = useState<PieResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getStaticPieChart();
        setPieData(data);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Preparar dados para o ChartDonut
  const chartLabels = pieData?.data_clients.map(c => c.client_name) || [];
  const chartValues = pieData?.data_clients.map(c => c.value_purchased) || [];

  // Calcular total e percentuais
  const total = chartValues.reduce((sum, val) => sum + val, 0);

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Cores para cada cliente (mesmo padrão do gráfico)
  const colors = [
    'bg-red-600 dark:bg-red-500',
    'bg-orange-500 dark:bg-orange-400',
    'bg-yellow-500 dark:bg-yellow-400',
    'bg-gray-400 dark:bg-gray-500',
    'bg-gray-300 dark:bg-gray-600',
  ];

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow dark:shadow-md dark:hover:shadow-lg border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground">
            Top 5 Clientes
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Por valor de compras</p>
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
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground">
            Top 5 Clientes
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Por valor de compras</p>
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
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          Top 5 Clientes
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Por valor de compras</p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center">
          <ChartDonut labels={chartLabels} values={chartValues} />
          
          <div className="mt-6 w-full space-y-3">
            {pieData?.data_clients.map((client, index) => {
              const percentage = ((client.value_purchased / total) * 100).toFixed(1);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                    <span className="text-sm text-foreground">
                      {client.client_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(client.value_purchased)}
                    </span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {client.total_orders} pedidos
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}