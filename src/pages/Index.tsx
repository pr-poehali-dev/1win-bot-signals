import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface RocketSignal {
  id: number;
  multiplier: number;
  timestamp: Date;
  status: 'waiting' | 'active' | 'expired';
}

const Index = () => {
  const [currentSignal, setCurrentSignal] = useState<RocketSignal | null>(null);
  const [signalHistory, setSignalHistory] = useState<RocketSignal[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [signalTimer, setSignalTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (signalTimer > 0) {
      interval = setInterval(() => {
        setSignalTimer(prev => {
          if (prev <= 1 && currentSignal) {
            setCurrentSignal({ ...currentSignal, status: 'expired' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signalTimer, currentSignal]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (frequency: number, duration: number, startTime: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
    };

    playTone(800, 0.1, 0);
    playTone(1000, 0.1, 0.1);
    playTone(1200, 0.15, 0.2);
  };

  const generateSignal = () => {
    if (countdown > 0) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const multipliers = [1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.5, 4.0, 5.0, 6.0, 8.0, 10.0];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      
      const newSignal: RocketSignal = {
        id: Date.now(),
        multiplier,
        timestamp: new Date(),
        status: 'active'
      };

      playNotificationSound();
      setCurrentSignal(newSignal);
      setSignalHistory(prev => [newSignal, ...prev.slice(0, 19)]);
      setIsGenerating(false);
      setCountdown(180);
      setSignalTimer(60);
    }, 3000);
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 5) return 'from-destructive to-destructive/70';
    if (multiplier >= 3) return 'from-warning to-warning/70';
    return 'from-success to-success/70';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4 bg-card/50 backdrop-blur px-6 py-3 rounded-2xl border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Rocket" size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ROCKET SIGNALS
              </h1>
              <p className="text-xs text-muted-foreground">Powered by AI Algorithm</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border-primary/20 animate-slide-up">
            {currentSignal && currentSignal.status === 'active' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge className="bg-success/20 text-success border-success/30 text-sm px-4 py-1 animate-pulse-glow">
                    <Icon name="Radio" size={14} className="mr-2" />
                    СИГНАЛ АКТИВЕН
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    ID: #{currentSignal.id.toString().slice(-6)}
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary/30 animate-pulse-glow">
                    <Icon name="TrendingUp" size={48} className="text-primary" />
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">ВЫВОДИТЬ НА</div>
                    <div className={`text-7xl font-bold bg-gradient-to-r ${getMultiplierColor(currentSignal.multiplier)} bg-clip-text text-transparent`}>
                      {currentSignal.multiplier.toFixed(2)}x
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Icon name="Clock" size={16} className="text-primary" />
                      <span className="text-muted-foreground">Осталось времени:</span>
                      <span className="font-bold text-primary text-xl">{formatTime(signalTimer)}</span>
                    </div>
                    <Progress value={(signalTimer / 60) * 100} className="h-2" />
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        <span className="text-muted-foreground">Точность: <span className="text-foreground font-semibold">89.3%</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Target" size={16} className="text-warning" />
                        <span className="text-muted-foreground">Риск: <span className="text-foreground font-semibold">Средний</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-muted/30 border-4 border-muted">
                  <Icon name="Rocket" size={56} className="text-muted-foreground" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ожидание сигнала</h3>
                  <p className="text-muted-foreground">Нажмите кнопку ниже для получения нового сигнала</p>
                </div>

                <Button 
                  onClick={generateSignal}
                  disabled={isGenerating || countdown > 0}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all text-lg px-10 py-6 disabled:opacity-50"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Icon name="Loader2" size={24} className="mr-3 animate-spin" />
                      Анализ раундов...
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Icon name="Clock" size={24} className="mr-3" />
                      Следующий через {formatTime(countdown)}
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={24} className="mr-3" />
                      Получить сигнал
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                  Статистика
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Точность</span>
                    <span className="font-bold">89.3%</span>
                  </div>
                  <Progress value={89.3} className="h-2 bg-success/20" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Успешных</span>
                    <span className="font-bold text-success">247 / 277</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Сегодня</span>
                    <span className="font-bold text-success">+₽18,450</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Info" size={20} className="text-primary" />
                <h3 className="font-semibold">Как использовать</h3>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Получите сигнал с множителем</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Откройте игру Ракета на 1WIN</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Дождитесь нового раунда</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Выведите на указанном коэффициенте</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>

        {signalHistory.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="History" size={22} className="text-primary" />
              История сигналов
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {signalHistory.map((signal) => (
                <div 
                  key={signal.id}
                  className="p-4 bg-muted/30 rounded-lg border border-muted hover:border-primary/30 transition-all text-center"
                >
                  <div className={`text-2xl font-bold bg-gradient-to-r ${getMultiplierColor(signal.multiplier)} bg-clip-text text-transparent mb-1`}>
                    {signal.multiplier.toFixed(2)}x
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {signal.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
