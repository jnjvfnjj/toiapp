import { Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { EthnicBorder } from './EthnicPattern';

interface OnboardingScreenProps {
  step: number;
  onNext: () => void;
  onStart: () => void;
}

export function OnboardingScreen({ step, onNext, onStart }: OnboardingScreenProps) {
  const steps = [
    {
      icon: Calendar,
      title: 'Планируйте легко',
      description: 'Создайте мероприятие за несколько кликов. Укажите дату, количество гостей и бюджет.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Users,
      title: 'Управляйте гостями',
      description: 'Добавляйте гостей, отправляйте приглашения и отслеживайте подтверждения.',
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white to-sky-50 px-6">
      {/* Progress indicators */}
      <div className="pt-12 pb-8">
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index + 1 <= step ? 'w-8 bg-cyan-500' : 'w-8 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentStep.color} flex items-center justify-center mb-8 shadow-xl`}>
          <Icon className="w-16 h-16 text-white" />
        </div>

        <h2 className="mb-4 text-cyan-900">
          {currentStep.title}
        </h2>

        <div className="w-20 mb-6">
          <EthnicBorder className="text-cyan-400" />
        </div>

        <p className="text-gray-600 max-w-sm mb-12">
          {currentStep.description}
        </p>
      </div>

      {/* Action button */}
      <div className="pb-12">
        {step < 2 ? (
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-2xl shadow-lg"
          >
            Далее
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-2xl shadow-lg"
          >
            Приступить
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
