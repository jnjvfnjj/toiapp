import { useState, useRef } from 'react';
import { ArrowLeft, Camera, MapPin, Phone, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from '../i18n/translations';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EthnicBorder } from './EthnicPattern';
import { Venue, VenueAmenities } from '../App';

interface AddVenueScreenProps {
  onComplete: (venue: Omit<Venue, 'id'>) => void;
  onBack: () => void;
  userId: string;
}

const VENUE_TYPES = [
  'Банкетный зал',
  'Ресторан',
  'Кафе',
  'Юрта',
  'Летняя площадка',
  'Конференц-зал',
  'Отель',
];

const AMENITY_KEYS: (keyof VenueAmenities)[] = ['music', 'catering', 'parking', 'ac', 'decor', 'photo'];

export function AddVenueScreen({ onComplete, onBack, userId }: AddVenueScreenProps) {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    capacity: '',
    address: '',
    description: '',
    phone: '+996 ',
    whatsapp: '+996 ',
    photos: [] as string[],
    mainPhoto: '',
    amenities: {
      music: false,
      catering: false,
      parking: false,
      ac: false,
      decor: false,
      photo: false,
    } as VenueAmenities,
    location: {
      lat: 42.8746,
      lng: 74.5698,
    }
  });
  const [errors, setErrors] = useState<any>({});
  const photoInputRef = useRef<HTMLInputElement>(null);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+996')) {
      return '+996 ';
    }
    
    let formatted = '+996 ';
    const digits = cleaned.slice(4);
    
    if (digits.length > 0) formatted += digits.slice(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
    if (digits.length > 6) formatted += ' ' + digits.slice(6, 9);
    
    return formatted;
  };

  const validateStep = (currentStep: number) => {
    const newErrors: any = {};
    
    if (currentStep === 1) {
      if (!formData.name || formData.name.length < 3) {
        newErrors.name = t.addVenue.validations.nameMin;
      }
      if (!formData.type) {
        newErrors.type = t.addVenue.validations.selectType;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = t.addVenue.validations.invalidPrice;
      }
      if (!formData.capacity || parseInt(formData.capacity) <= 0) {
        newErrors.capacity = t.addVenue.validations.capacityRequired;
      }
    }

    if (currentStep === 2) {
      if (!formData.address || formData.address.length < 5) {
        newErrors.address = t.addVenue.validations.addressRequired;
      }
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = t.addVenue.validations.descriptionMin;
      }
    }

    if (currentStep === 4) {
      const cleanPhone = formData.phone.replace(/\s/g, '');
      if (cleanPhone.length < 13) {
        newErrors.phone = t.addVenue.validations.invalidPhone;
      }
      const cleanWhatsapp = formData.whatsapp.replace(/\s/g, '');
      if (cleanWhatsapp.length < 13) {
        newErrors.whatsapp = t.addVenue.validations.invalidWhatsapp;
      }
    }
    if (currentStep === 5) {
      if (formData.photos.length === 0) {
        newErrors.photos = t.addVenue.validations.photosMin;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    const venueData: Omit<Venue, 'id'> = {
      name: formData.name,
      type: formData.type,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      location: {
        lat: formData.location.lat,
        lng: formData.location.lng,
        address: formData.address,
      },
      description: formData.description,
      photos: formData.photos,
      mainPhoto: formData.mainPhoto || formData.photos[0] || '',
      ownerId: userId,
      whatsapp: formData.whatsapp.replace(/\s/g, ''),
      phone: formData.phone.replace(/\s/g, ''),
      amenities: formData.amenities,
    };
    onComplete(venueData);
  };

  const handlePhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 10 - formData.photos.length;
    const toProcess = files.filter((f) => f.type.startsWith('image/')).slice(0, remaining);
    if (!toProcess.length) {
      e.target.value = '';
      return;
    }
    let read = 0;
    const newUrls: string[] = [];
    toProcess.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        newUrls.push(reader.result as string);
        read++;
        if (read === toProcess.length) {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...newUrls],
            mainPhoto: prev.mainPhoto || newUrls[0] || prev.mainPhoto,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const wasMain = formData.photos[index] === formData.mainPhoto;
    setFormData({
      ...formData,
      photos: newPhotos,
      mainPhoto: wasMain ? (newPhotos[0] || '') : formData.mainPhoto,
    });
  };

  const setMainPhoto = (photo: string) => {
    setFormData({ ...formData, mainPhoto: photo });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#2A5A8A] pt-8 pb-6 px-6 rounded-b-3xl mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-white mb-3">{t.addVenue.title}</h1>
        
        <div className="w-20 mb-4">
          <EthnicBorder className="text-accent" />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-accent' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-white/80 mt-2">{t.addVenue.step.replace('{step}', String(step))}</p>
      </div>

      <div className="px-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-foreground mb-2">{t.addVenue.basicInfoTitle}</h2>
              <p className="text-muted-foreground">{t.addVenue.basicInfoDesc}</p>
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t.addVenue.nameLabel}</label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                }}
                placeholder={t.addVenue.namePlaceholder}
                className="py-6 rounded-2xl border-2 focus:border-accent"
              />
              {errors.name && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t.addVenue.typeLabel}</label>
              <Select value={formData.type} onValueChange={(value) => {
                setFormData({ ...formData, type: value });
                setErrors({ ...errors, type: '' });
              }}>
                <SelectTrigger className="py-6 rounded-2xl border-2 focus:border-accent">
                  <SelectValue placeholder={t.addVenue.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {VENUE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.type}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-foreground">{t.addVenue.priceLabel}</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    setErrors({ ...errors, price: '' });
                  }}
                  placeholder="50000"
                  className="py-6 rounded-2xl border-2 focus:border-accent"
                />
                {errors.price && (
                  <p className="mt-2 text-destructive flex items-center gap-2">
                    <span>⚠️</span>
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-foreground">{t.addVenue.capacityLabel}</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => {
                    setFormData({ ...formData, capacity: e.target.value });
                    setErrors({ ...errors, capacity: '' });
                  }}
                  placeholder="100"
                  className="py-6 rounded-2xl border-2 focus:border-accent"
                />
                {errors.capacity && (
                  <p className="mt-2 text-destructive flex items-center gap-2">
                    <span>⚠️</span>
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location & Description */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-foreground mb-2">{t.addVenue.locationTitle}</h2>
              <p className="text-muted-foreground">{t.addVenue.locationDesc}</p>
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t.addVenue.addressLabel}</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    setErrors({ ...errors, address: '' });
                  }}
                  placeholder={t.addVenue.addressPlaceholder}
                  className="pl-12 py-6 rounded-2xl border-2 focus:border-accent"
                />
              </div>
              {errors.address && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t.addVenue.descriptionLabel}</label>
              <Textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: '' });
                }}
                placeholder={t.addVenue.descriptionPlaceholder}
                className="min-h-32 rounded-2xl border-2 focus:border-accent resize-none"
                rows={6}
              />
              <p className="mt-2 text-muted-foreground">{t.addVenue.descriptionCount.replace('{count}', String(formData.description.length))}</p>
              {errors.description && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Map Preview */}
            <div className="bg-muted rounded-2xl p-6 text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">{t.addVenue.mapCity}</p>
              <p className="text-foreground">
                {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Amenities */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-foreground mb-2">{t.addVenue.amenitiesTitle}</h2>
              <p className="text-muted-foreground">{t.addVenue.amenitiesDesc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_KEYS.map((key) => {
                const labels: Record<keyof VenueAmenities, string> = {
                  music: t.venues.featureMusic,
                  catering: t.venues.featureCatering,
                  parking: t.venues.featureParking,
                  ac: t.venues.featureAC,
                  decor: t.venues.featureDecor,
                  photo: t.venues.featurePhoto,
                };
                const isChecked = formData.amenities[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        amenities: { ...formData.amenities, [key]: !isChecked },
                      })
                    }
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      isChecked
                        ? 'border-accent bg-accent/10 text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-accent/50'
                    }`}
                  >
                    {isChecked ? (
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{labels[key]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Contacts */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-foreground mb-2">{t.addVenue.contactTitle}</h2>
              <p className="text-muted-foreground">{t.addVenue.whatsappNote}</p>
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t.addVenue.phoneLabel}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: formatPhone(e.target.value) });
                    setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="+996 XXX XXX XXX"
                  className="pl-12 py-6 rounded-2xl border-2 focus:border-accent"
                  maxLength={17}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-foreground">{t.addVenue.whatsappLabel}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#25D366]" />
                <Input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    setFormData({ ...formData, whatsapp: formatPhone(e.target.value) });
                    setErrors({ ...errors, whatsapp: '' });
                  }}
                  placeholder="+996 XXX XXX XXX"
                  className="pl-12 py-6 rounded-2xl border-2 focus:border-accent"
                  maxLength={17}
                />
              </div>
              {errors.whatsapp && (
                <p className="mt-2 text-destructive flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.whatsapp}
                </p>
              )}
              <p className="mt-2 text-muted-foreground">{t.addVenue.whatsappNote}</p>
            </div>
          </div>
        )}

        {/* Step 5: Photos — владелец загружает свои фото */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-foreground mb-2">{t.addVenue.photosTitle}</h2>
              <p className="text-muted-foreground">{t.addVenue.photosDesc}</p>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoFiles}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={formData.photos.length >= 10}
              className="w-full py-8 rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-accent hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-foreground">{t.addVenue.addPhoto}</p>
              <p className="text-muted-foreground">
                {formData.photos.length} / 10
              </p>
            </button>

            {errors.photos && (
              <p className="text-destructive flex items-center gap-2">
                <span>⚠️</span>
                {errors.photos}
              </p>
            )}

            {formData.photos.length > 0 && (
              <div>
                <label className="block mb-3 text-foreground">{t.addVenue.uploadedPhotosLabel}</label>
                <div className="grid grid-cols-2 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent group"
                    >
                      <button
                        type="button"
                        onClick={() => setMainPhoto(photo)}
                        className={`absolute inset-0 w-full h-full block cursor-pointer border-4 transition-all ${
                          formData.mainPhoto === photo
                            ? 'border-accent scale-95'
                            : 'border-transparent hover:border-accent/30'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      {formData.mainPhoto === photo && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-white rounded-lg text-xs">
                          {t.addVenue.mainLabel}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 left-2 w-8 h-8 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={t.common.delete}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-muted-foreground text-center">{t.addVenue.clickToMakeMain}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-6">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex-1 py-6 rounded-2xl border-2"
            >
              {t.addVenue.back}
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-accent to-[#B88A16] hover:from-accent/90 hover:to-[#B88A16]/90 text-white py-6 rounded-2xl shadow-lg"
          >
            {step === 5 ? t.addVenue.publish : t.addVenue.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
