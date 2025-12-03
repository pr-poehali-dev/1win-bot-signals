import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface RocketSignal {
  id: number;
  multiplier: number;
  timestamp: Date;
  confidence: number;
}

const Index = () => {
  const [currentSignal, setCurrentSignal] = useState<RocketSignal | null>(null);
  const [signalHistory, setSignalHistory] = useState<RocketSignal[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

    playTone(600, 0.15, 0);
    playTone(800, 0.15, 0.15);
    playTone(1000, 0.2, 0.3);
  };

  const generateSignal = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const multipliers = [1.5, 1.8, 2.0, 2.3, 2.5, 2.8, 3.0, 3.5, 4.0, 5.0];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      
      const newSignal: RocketSignal = {
        id: Date.now(),
        multiplier,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 10) + 85
      };

      playNotificationSound();
      setCurrentSignal(newSignal);
      setSignalHistory(prev => [newSignal, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 2000);
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 4) return 'text-destructive';
    if (multiplier >= 2.5) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-12 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Icon name="Rocket" size={40} className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ROCKET SIGNAL
            </h1>
          </div>
          <Badge variant="outline" className="text-lg px-5 py-2 border-primary/50 mb-2">
            <Icon name="Zap" size={18} className="mr-2" />
            1WIN
          </Badge>
          <p className="text-muted-foreground mt-3">Точные сигналы для игры Ракета</p>
        </header>

        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/30 glow-purple animate-slide-up">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Icon 
                    name="Rocket" 
                    size={100} 
                    className={`${isGenerating ? 'animate-pulse-glow text-primary' : 'text-muted-foreground'} transition-all`} 
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {currentSignal ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">СИГНАЛ НА ВЗЛЁТ</div>
                    <div className={`text-8xl font-bold ${getMultiplierColor(currentSignal.multiplier)}`}>
                      {currentSignal.multiplier}x
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Icon name="Target" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Уверенность:</span>
                    <span className="font-bold text-primary">{currentSignal.confidence}%</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {currentSignal.timestamp.toLocaleTimeString('ru-RU')}
                  </div>

                  <div className="pt-4">
                    <Badge className="text-base px-6 py-2 bg-success/20 text-success border-success/30 animate-pulse-glow">
                      <Icon name="TrendingUp" size={18} className="mr-2" />
                      Сигнал активен
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xl text-muted-foreground">
                    Нажмите кнопку для получения сигнала
                  </p>
                </div>
              )}

              <Button 
                onClick={generateSignal}
                disabled={isGenerating}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all text-lg px-8 py-6"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={24} className="mr-3 animate-spin" />
                    Анализ...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={24} className="mr-3" />
                    Получить сигнал
                  </>
                )}
              </Button>
            </div>
          </Card>

          {signalHistory.length > 0 && (
            <Card className="p-6 bg-card/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="History" size={24} className="text-primary" />
                История сигналов
              </h3>
              <div className="space-y-2">
                {signalHistory.map((signal) => (
                  <div 
                    key={signal.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="TrendingUp" size={20} className="text-success" />
                      <div>
                        <div className={`text-2xl font-bold ${getMultiplierColor(signal.multiplier)}`}>
                          {signal.multiplier}x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {signal.timestamp.toLocaleTimeString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {signal.confidence}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={24} className="text-warning mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Как использовать сигнал</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Получите сигнал с указанным множителем</li>
                  <li>2. Зайдите в игру Ракета на 1WIN</li>
                  <li>3. Дождитесь раунда и выведите на указанном коэффициенте</li>
                  <li>4. Рекомендуем ставить 2-5% от банкролла</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
