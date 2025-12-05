import React, { useEffect, useState } from "react";
import { getAvailableYears } from "@/services/yearsService";
import Header from "../header/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Shield } from "lucide-react";
import ClientCaptureCard from "../ChartDonut/chartHome";
import SalesOverviewCard from "../ChartDonut/chart";

export function Dashboard() {
  const [years, setYears] = React.useState<string[]>([]);
  const fetchYears = async () => {
  try {
    const yearList = await getAvailableYears(); 

    setYears(yearList);
    console.log("Anos disponíveis:", yearList);
  } catch (error) {
    setYears([]);
  }
};
useEffect(() => {
  fetchYears();
}, []);

  return (
    <div className="p-8 min-h-full bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      <Header />


{/* Cards de informações - Centralizados */}
<div className="flex justify-center mb-8 mt-8">
  <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg max-w-6xl w-full">
    <CardContent className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card Verde - Receitas */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Receitas</span>
            <span className="text-3xl font-bold text-foreground">R$189k</span>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">18 últimos meses</span>
            </div>
          </div>
        </div>

        {/* Card Azul - Vendas */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Vendas</span>
            <span className="text-3xl font-bold text-foreground">400</span>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">24% mais vendas</span>
            </div>
          </div>
        </div>

        {/* Card Rosa - Segurança */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Total Seguro</span>
            <span className="text-3xl font-bold text-foreground">R$89k</span>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">10% mais relevante</span>
            </div>
          </div>
        </div>

      </div>
    </CardContent>
  </Card>
</div>

      {/* Gráficos - Centralizados */}
      <div className="flex justify-center mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
          <SalesOverviewCard />
          <ClientCaptureCard />
        </div>
      </div>

      {/* Tabela de Vendedores - Centralizada */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-foreground">
                Relação de Vendedores
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Equipe atual e produtividade</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border hover:bg-transparent">
                    <TableHead className="font-bold text-foreground text-sm">NOME</TableHead>
                    <TableHead className="font-bold text-foreground text-sm">MATRÍCULA</TableHead>
                    <TableHead className="font-bold text-foreground text-sm">SETOR</TableHead>
                    <TableHead className="font-bold text-foreground text-sm text-center">PRODUTIVIDADE</TableHead>
                    <TableHead className="font-bold text-foreground text-sm text-center">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-muted/50 transition-colors border-border">
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-orange-200 dark:border-orange-300">
                          <AvatarFallback className="bg-orange-200 dark:bg-orange-300 text-orange-800 dark:text-orange-900 text-sm font-bold">
                            RA
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-semibold text-foreground">Ricardo Aparecido</span>
                          <p className="text-xs text-muted-foreground">Vendedor Senior</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">177564845931</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">SUPRIMENTOS</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <Progress value={80} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">80%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium">
                        ATIVO
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50 transition-colors border-border">
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-300">
                          <AvatarFallback className="bg-blue-200 dark:bg-blue-300 text-blue-800 dark:text-blue-900 text-sm font-bold">
                            SA
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-semibold text-foreground">Suzana Amaral</span>
                          <p className="text-xs text-muted-foreground">Vendedora Pleno</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">177564845932</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">VENDAS</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <Progress value={60} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">60%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-medium">
                        EM ANÁLISE
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50 transition-colors border-border">
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-300">
                          <AvatarFallback className="bg-purple-200 dark:bg-purple-300 text-purple-800 dark:text-purple-900 text-sm font-bold">
                            MF
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-semibold text-foreground">Maria Fernanda</span>
                          <p className="text-xs text-muted-foreground">Especialista Marketing</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">177564845933</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">MARKETING</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">85%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium">
                        ATIVO
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}