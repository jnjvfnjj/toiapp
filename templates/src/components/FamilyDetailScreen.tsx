import { ArrowLeft, Phone, MessageCircle, User, Users, CheckCircle, XCircle, HelpCircle, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Family, Guest } from '../App';
import { Avatar } from './ui/avatar';

interface FamilyDetailScreenProps {
  family: Family;
  guests: Guest[];
  onBack: () => void;
  onEditGuest?: (guest: Guest) => void;
}

export function FamilyDetailScreen({ family, guests, onBack, onEditGuest }: FamilyDetailScreenProps) {
  const familyMembers = guests.filter(g => g.familyId === family.id);
  const headOfFamily = familyMembers.find(g => g.id === family.headOfFamilyId);

  const getStatusInfo = (status: string | undefined) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircle, text: 'Придёт', color: 'text-green-600', bg: 'bg-green-100' };
      case 'declined':
        return { icon: XCircle, text: 'Не придёт', color: 'text-red-600', bg: 'bg-red-100' };
      case 'maybe':
        return { icon: HelpCircle, text: 'Возможно', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      default:
        return { icon: HelpCircle, text: 'Неизвестно', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getFamilyStatus = () => {
    const statuses = familyMembers.map(m => m.rsvpStatus);
    const allConfirmed = statuses.every(s => s === 'confirmed');
    const someConfirmed = statuses.some(s => s === 'confirmed');
    const allDeclined = statuses.every(s => s === 'declined');

    if (allConfirmed) return { text: 'Вся семья придёт', color: 'text-green-600', bg: 'bg-green-100' };
    if (allDeclined) return { text: 'Семья не придёт', color: 'text-red-600', bg: 'bg-red-100' };
    if (someConfirmed) return { text: 'Частичное подтверждение', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Статус неизвестен', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const familyStatus = getFamilyStatus();

  const handleCall = () => {
    if (family.contactPhone) {
      window.open(`tel:${family.contactPhone}`);
    }
  };

  const handleWhatsApp = () => {
    if (family.contactPhone) {
      const cleanPhone = family.contactPhone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-[#3B6EA5] text-white px-6 py-6 sticky top-0 z-10">
        <button onClick={onBack} className="mb-4 p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="mb-2">{family.lastName}</h1>
            <p className="text-[#A7D8F0] mb-3">{familyMembers.length} {familyMembers.length === 1 ? 'человек' : familyMembers.length < 5 ? 'человека' : 'человек'}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${familyStatus.bg}`}>
              <span className={`${familyStatus.color}`}>{familyStatus.text}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Contact section */}
        {family.contactPhone && (
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <h3 className="text-card-foreground mb-3">Контакты семьи</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span>{family.contactPhone}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCall}
                  className="flex-1 bg-gradient-to-r from-[#3B6EA5] to-primary hover:from-[#3B6EA5]/90 hover:to-primary/90 text-white rounded-xl"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Family Structure */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h3 className="text-card-foreground mb-4">Структура семьи</h3>
          <div className="space-y-3">
            {/* Head of family first */}
            {headOfFamily && (
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-card-foreground">{headOfFamily.firstName} {headOfFamily.lastName}</p>
                    <p className="text-muted-foreground">👑 {headOfFamily.relationshipType || 'Глава семьи'}</p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg ${getStatusInfo(headOfFamily.rsvpStatus).bg}`}>
                  {(() => {
                    const StatusIcon = getStatusInfo(headOfFamily.rsvpStatus).icon;
                    return <StatusIcon className={`w-5 h-5 ${getStatusInfo(headOfFamily.rsvpStatus).color}`} />;
                  })()}
                </div>
              </div>
            )}
            {/* Other members */}
            {familyMembers
              .filter(m => m.id !== family.headOfFamilyId)
              .map((member) => {
                const StatusIcon = getStatusInfo(member.rsvpStatus).icon;
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-card-foreground">{member.firstName} {member.lastName}</p>
                        <p className="text-muted-foreground">{member.relationshipType || member.role || 'Член семьи'}</p>
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-lg ${getStatusInfo(member.rsvpStatus).bg}`}>
                      <StatusIcon className={`w-5 h-5 ${getStatusInfo(member.rsvpStatus).color}`} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* All Members Details */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h3 className="text-card-foreground mb-4">Подробная информация</h3>
          <div className="space-y-4">
            {familyMembers.map((member) => {
              const statusInfo = getStatusInfo(member.rsvpStatus);
              const StatusIcon = statusInfo.icon;
              return (
                <div key={member.id} className="border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-card-foreground mb-1">
                        {member.lastName} {member.firstName} {member.middleName}
                      </h4>
                      <p className="text-muted-foreground mb-2">{member.relationshipType || 'Член семьи'}</p>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${statusInfo.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className={`${statusInfo.color}`}>{statusInfo.text}</span>
                      </div>
                    </div>
                    {onEditGuest && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditGuest(member)}
                        className="hover:bg-muted"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h3 className="text-card-foreground mb-4">Статистика</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl text-green-600 mb-1">
                {familyMembers.filter(m => m.rsvpStatus === 'confirmed').length}
              </div>
              <div className="text-muted-foreground">Придут</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-2xl text-red-600 mb-1">
                {familyMembers.filter(m => m.rsvpStatus === 'declined').length}
              </div>
              <div className="text-muted-foreground">Не придут</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <div className="text-2xl text-yellow-600 mb-1">
                {familyMembers.filter(m => m.rsvpStatus === 'maybe').length}
              </div>
              <div className="text-muted-foreground">Возможно</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl text-gray-600 mb-1">
                {familyMembers.filter(m => !m.rsvpStatus || m.rsvpStatus === 'pending').length}
              </div>
              <div className="text-muted-foreground">Без ответа</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}