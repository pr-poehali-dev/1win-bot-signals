import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Signal {
  id: number;
  cells: number[];
  risk: 'low' | 'medium' | 'high';
  coefficient: number;
  confidence: number;
  timestamp: Date;
  result?: 'win' | 'loss';
}

const Index = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [stats, setStats] = useState({
    totalSignals: 247,
    accuracy: 78.5,
    wins: 194,
    losses: 53,
    profit: 12450
  });

  const generateSignal = () => {
    const risks: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const minesCounts = { low: 3, medium: 5, high: 7 };
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const minesCount = minesCounts[risk];
    
    const cells: number[] = [];
    while (cells.length < minesCount) {
      const cell = Math.floor(Math.random() * 25);
      if (!cells.includes(cell)) cells.push(cell);
    }

    const newSignal: Signal = {
      id: Date.now(),
      cells: cells.sort((a, b) => a - b),
      risk,
      coefficient: risk === 'low' ? 1.8 : risk === 'medium' ? 2.5 : 3.8,
      confidence: Math.floor(Math.random() * 15) + 75,
      timestamp: new Date()
    };

    setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    generateSignal();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      default: return risk;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MINES SIGNAL BOT
            </h1>
            <Badge variant="outline" className="text-lg px-4 py-2 border-primary/50">
              <Icon name="Zap" size={16} className="mr-2" />
              1WIN
            </Badge>
          </div>
          <p className="text-muted-foreground">Умные сигналы для максимальной прибыли</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Точность</span>
              <Icon name="Target" size={20} className="text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">{stats.accuracy}%</div>
            <Progress value={stats.accuracy} className="h-2" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:border-success/40 transition-all hover:shadow-lg hover:shadow-success/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Побед / Проигрышей</span>
              <Icon name="TrendingUp" size={20} className="text-success" />
            </div>
            <div className="text-3xl font-bold">{stats.wins} / {stats.losses}</div>
            <div className="text-sm text-muted-foreground">Всего сигналов: {stats.totalSignals}</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:border-warning/40 transition-all hover:shadow-lg hover:shadow-warning/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Общая прибыль</span>
              <Icon name="Wallet" size={20} className="text-warning" />
            </div>
            <div className="text-3xl font-bold text-warning">+₽{stats.profit.toLocaleString()}</div>
            <div className="text-sm text-success">↑ 24% за неделю</div>
          </Card>
        </div>

        <Tabs defaultValue="signals" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted/50">
            <TabsTrigger value="signals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Сигналы
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signals" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/30 glow-purple">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Новый сигнал</h2>
                <Button 
                  onClick={generateSignal}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all animate-pulse-glow"
                  size="lg"
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Генерировать
                </Button>
              </div>
              <p className="text-muted-foreground">Получите новый сигнал с оптимальными коэффициентами</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {signals.map((signal, index) => (
                <Card 
                  key={signal.id} 
                  className="p-6 hover:scale-[1.02] transition-all animate-fade-in bg-card/80 backdrop-blur border-primary/10 hover:border-primary/30"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size={20} className="text-primary animate-pulse-glow" />
                      <span className="font-semibold">Сигнал #{signal.id.toString().slice(-4)}</span>
                    </div>
                    <Badge className={getRiskColor(signal.risk)}>
                      {getRiskLabel(signal.risk)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                          signal.cells.includes(i)
                            ? 'bg-destructive/20 border-2 border-destructive text-destructive animate-pulse-glow'
                            : 'bg-muted/30 border border-muted text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {signal.cells.includes(i) ? '💣' : i + 1}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Коэффициент:</span>
                      <span className="text-lg font-bold text-warning">×{signal.coefficient}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Уверенность:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={signal.confidence} className="h-2 w-24" />
                        <span className="text-sm font-semibold">{signal.confidence}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {signal.timestamp.toLocaleTimeString('ru-RU')}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/80 backdrop-blur">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                  Паттерны успеха
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Низкий риск</span>
                      <span className="text-sm font-semibold text-success">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-success/20" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Средний риск</span>
                      <span className="text-sm font-semibold text-warning">76%</span>
                    </div>
                    <Progress value={76} className="h-2 bg-warning/20" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Высокий риск</span>
                      <span className="text-sm font-semibold text-destructive">68%</span>
                    </div>
                    <Progress value={68} className="h-2 bg-destructive/20" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="LineChart" size={24} className="text-secondary" />
                  Тренды времени
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-semibold">Утро (6-12)</div>
                      <div className="text-xs text-muted-foreground">42 сигнала</div>
                    </div>
                    <div className="text-success font-bold">+82%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-semibold">День (12-18)</div>
                      <div className="text-xs text-muted-foreground">68 сигналов</div>
                    </div>
                    <div className="text-success font-bold">+79%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-semibold">Вечер (18-24)</div>
                      <div className="text-xs text-muted-foreground">137 сигналов</div>
                    </div>
                    <div className="text-warning font-bold">+75%</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur md:col-span-2">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="Brain" size={24} className="text-accent" />
                  ИИ рекомендации
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <Icon name="Lightbulb" size={24} className="text-primary mb-2" />
                    <div className="font-semibold mb-1">Оптимальное время</div>
                    <div className="text-sm text-muted-foreground">
                      Играйте вечером для лучших результатов
                    </div>
                  </div>
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <Icon name="Shield" size={24} className="text-success mb-2" />
                    <div className="font-semibold mb-1">Управление рисками</div>
                    <div className="text-sm text-muted-foreground">
                      Баланс между средним и низким риском
                    </div>
                  </div>
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <Icon name="Coins" size={24} className="text-warning mb-2" />
                    <div className="font-semibold mb-1">Ставка</div>
                    <div className="text-sm text-muted-foreground">
                      Оптимально: 2-5% от банкролла
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
