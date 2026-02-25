// Система переводов для Toi App
export type Language = 'ru' | 'kg' | 'en';

export interface Translations {
  // Общие
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    confirm: string;
    close: string;
    search: string;
    loading: string;
    greeting: string;
    welcome: string;
    appName: string;
    introSlogan: string;
    learnMore: string;
    goBack: string;
    register: string;
    signIn: string;
    notFound: string;
    venueNotSelected: string;
    familyNotFound: string;
    bookingNotFound: string;
    bookingNotFoundOrUnauthorized: string;
    notAuthorized: string;
    people: string;
  };
  
  // Навигация
  nav: {
    home: string;
    events: string;
    profile: string;
    venues: string;
    bookings: string;
    budget: string;
  };
  
  // Профиль
  profile: {
    title: string;
    organizer: string;
    owner: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    email: string;
    photo: string;
    editProfile: string;
    settings: string;
    language: string;
    support: string;
    logout: string;
    logoutConfirm: string;
    appVersion: string;
    rightsReserved: string;
  };
  
  // Настройки
  settings: {
    title: string;
    profileSettings: string;
    accountSettings: string;
    updatePhoto: string;
    deletePhoto: string;
    changePhone: string;
    changeEmail: string;
    notifications: string;
    privacy: string;
    theme: string;
    lightTheme: string;
    darkTheme: string;
    savedSuccessfully: string;
  };
  
  // Поддержка
  support: {
    title: string;
    chatWithAI: string;
    typeMessage: string;
    send: string;
    faqTitle: string;
    faq1: string;
    faq2: string;
    faq3: string;
    faq4: string;
    faq5: string;
    faq6: string;
    aiGreeting: string;
    aiHelp: string;
  };
  
  // События
  events: {
    myEvents: string;
    createEvent: string;
    eventName: string;
    eventNamePlaceholder: string;
    eventDate: string;
    eventTime: string;
    dateLabel: string;
    timeLabel: string;
    guestsCount: string;
    guestsPlaceholder: string;
    budget: string;
    eventType: string;
    wedding: string;
    birthday: string;
    corporate: string;
    other: string;
    dashboard: string;
    noActiveEvent: string;
    stepLabel: string;
    eventSingular: string;
    eventPlural: string;
    noEventsTitle: string;
    noEventsDesc: string;
    upcomingEvents: string;
    pastEvents: string;
    eventTypes: {
      toy: string;
      wedding: string;
      kyzUzatu: string;
      birthday: string;
      picnic: string;
      corporate: string;
      other: string;
    };
  };
  
  // Гости
  guests: {
    title: string;
    addGuest: string;
    confirmed: string;
    maybe: string;
    declined: string;
    pending: string;
    families: string;
    individuals: string;
    total: string;
    noGuests: string;
    noFamilies: string;
    noResults: string;
    familyMembers: string;
  };
  
  // Площадки
  venues: {
    findVenue: string;
    myVenues: string;
    addVenue: string;
    capacity: string;
    price: string;
    perHour: string;
    location: string;
    contact: string;
    book: string;
    details: string;
    featureMusic: string;
    featureCatering: string;
    featureParking: string;
    featureAC: string;
    featureDecor: string;
    featurePhoto: string;
    contactMessage: string;
    descriptionTitle: string;
    descriptionBlurb: string;
    featuresTitle: string;
    from: string;
    upTo: string;
    select: string;
  };
  
  // Бронирования
  bookings: {
    myBookings: string;
    pending: string;
    confirmed: string;
    cancelled: string;
    acceptBooking: string;
    declineBooking: string;
    chat: string;
    viewDetails: string;
  };

  // Владелец
  owner: {
    welcome: string;
    quickActions: string;
    venuesLabel: string;
    bookingsLabel: string;
    pendingLabel: string;
    addVenueBtn: string;
    myVenuesBtn: string;
    bookingsScheduleBtn: string;
    myVenuesTitle: string;
    viewAll: string;
    noVenuesTitle: string;
    noVenuesDesc: string;
  };
  
  // Бюджет
  budgetScreen: {
    title: string;
    subtitle: string;
    total: string;
    spent: string;
    remaining: string;
    addExpense: string;
    venue: string;
    food: string;
    decor: string;
    music: string;
    photo: string;
    other: string;
    newExpenseTitle: string;
    categoryLabel: string;
    amountLabel: string;
    descriptionLabel: string;
    expensesTitle: string;
    emptyExpensesNote: string;
    overspent: string;
    budgetEventsTitle: string;
    totalBudget: string;
    spentLabel: string;
    remainingLabel: string;
    budgetLabel: string;
    noEventsTitle: string;
    noEventsDesc: string;
    createEventBtn: string;
    expensesCount: string;
    expenseItem: string;
    expenseItems: string;
    expenseItemsMany: string;
    currency: string;
  };
  
  // Языки
  languages: {
    russian: string;
    kyrgyz: string;
    english: string;
  };
  // Даты
  dates: {
    monthsShort: string[];
  };
  // Аутентификация и регистрация
  auth: {
    phoneInvalid: string;
    codeInvalid: string;
    enterPhone: string;
    enterCode: string;
    sendingCode: string;
    getCode: string;
    phoneLabel: string;
    codeLabel: string;
    demoNote: string;
    changeNumber: string;
    signInWithGoogle: string;
    emailMustBeGmail: string;
    verifying: string;
    submit: string;
  };

  // Добавление площадки
  addVenue: {
    title: string;
    step: string;
    basicInfoTitle: string;
    basicInfoDesc: string;
    nameLabel: string;
    namePlaceholder: string;
    typeLabel: string;
    selectPlaceholder: string;
    priceLabel: string;
    capacityLabel: string;
    locationTitle: string;
    locationDesc: string;
    addressLabel: string;
    addressPlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    descriptionCount: string;
    mapCity: string;
    amenitiesTitle: string;
    amenitiesDesc: string;
    contactTitle: string;
    phoneLabel: string;
    whatsappLabel: string;
    whatsappNote: string;
    photosTitle: string;
    photosDesc: string;
    addPhoto: string;
    uploadedPhotosLabel: string;
    mainLabel: string;
    clickToMakeMain: string;
    publish: string;
    next: string;
    back: string;
    validations: {
      nameMin: string;
      selectType: string;
      invalidPrice: string;
      capacityRequired: string;
      addressRequired: string;
      descriptionMin: string;
      invalidPhone: string;
      invalidWhatsapp: string;
      photosMin: string;
    };
  };

  // Доп. для диаграммы бюджета
  budgetPie: {
    noData: string;
    expenses: string;
    currency: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      back: 'Назад',
      next: 'Далее',
      confirm: 'Подтвердить',
      close: 'Закрыть',
      search: 'Поиск',
      loading: 'Загрузка...',
      greeting: 'Привет, {name}!',
      welcome: 'Добро пожаловать!',
      appName: 'Toi App',
      introSlogan: 'Организуй свой Той легко',
      learnMore: 'Узнать больше о приложении',
      goBack: 'Вернуться назад',
      register: 'Зарегистрироваться',
      signIn: 'Войти в аккаунт',
      notFound: 'Не найдено',
      venueNotSelected: 'Площадка не выбрана',
      familyNotFound: 'Семья не найдена',
      bookingNotFound: 'Бронь не найдена',
      bookingNotFoundOrUnauthorized: 'Бронь не найдена или пользователь не авторизован',
      notAuthorized: 'Пользователь не авторизован',
      people: 'чел',
    },
    nav: {
      home: 'Главная',
      events: 'Мероприятия',
      profile: 'Профиль',
      venues: 'Площадки',
      bookings: 'Брони',
      budget: 'Бюджет',
    },
    profile: {
      title: 'Профиль',
      organizer: 'Организатор мероприятий',
      owner: 'Владелец здания',
      firstName: 'Имя',
      lastName: 'Фамилия',
      middleName: 'Отчество',
      phone: 'Телефон',
      email: 'Email',
      photo: 'Фото',
      editProfile: 'Редактировать профиль',
      settings: 'Настройки',
      language: 'Язык приложения',
      support: 'Поддержка',
      logout: 'Выйти из аккаунта',
      logoutConfirm: 'Вы уверены, что хотите выйти?',
      appVersion: 'Toi App v1.0',
      rightsReserved: '© 2024 Все права защищены',
    },
    settings: {
      title: 'Настройки',
      profileSettings: 'Настройки профиля',
      accountSettings: 'Настройки аккаунта',
      updatePhoto: 'Обновить фото',
      deletePhoto: 'Удалить фото',
      changePhone: 'Изменить телефон',
      changeEmail: 'Изменить email',
      notifications: 'Уведомления',
      privacy: 'Приватность',
      theme: 'Тема',
      lightTheme: 'Светлая',
      darkTheme: 'Тёмная',
      savedSuccessfully: 'Изменения сохранены',
    },
    support: {
      title: 'Поддержка',
      chatWithAI: 'Чат с ИИ-помощником',
      typeMessage: 'Введите сообщение...',
      send: 'Отправить',
      faqTitle: 'Частые вопросы',
      faq1: 'Как создать мероприятие?',
      faq2: 'Как забронировать площадку?',
      faq3: 'Как добавить гостей?',
      faq4: 'Как управлять бюджетом?',
      faq5: 'Как связаться с владельцем?',
      faq6: 'Как изменить данные профиля?',
      aiGreeting: 'Салам! Я ваш ИИ-помощник в Toi App. Чем могу помочь?',
      aiHelp: 'Вы можете задать мне любой вопрос о приложении или выбрать один из частых вопросов ниже.',
    },
    events: {
      myEvents: 'Мои мероприятия',
      createEvent: 'Создать мероприятие',
      eventName: 'Название мероприятия',
      eventNamePlaceholder: 'Например: Юбилей 50 лет',
      eventDate: 'Дата',
      eventTime: 'Время',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      guestsCount: 'Количество гостей',
      guestsPlaceholder: 'Введите количество гостей',
      budget: 'Бюджет',
      eventType: 'Тип мероприятия',
      wedding: 'Той',
      birthday: 'День рождения',
      corporate: 'Корпоратив',
      other: 'Другое',
      dashboard: 'Панель мероприятия',
      noActiveEvent: 'Нет активного мероприятия',
      stepLabel: 'Шаг {step}/5',
      eventSingular: 'мероприятие',
      eventPlural: 'мероприятий',
      noEventsTitle: 'Нет мероприятий',
      noEventsDesc: 'Создайте свое первое мероприятие',
      upcomingEvents: 'Предстоящие',
      pastEvents: 'Прошедшие',
      eventTypes: {
        toy: 'Той',
        wedding: 'Свадьба',
        kyzUzatu: 'Кыз узату',
        birthday: 'День рождения',
        picnic: 'Пикник',
        corporate: 'Корпоратив',
        other: 'Другое',
      },
    },
    eventDashboard: {
      venue: 'Площадка',
      venueNotSelected: 'Не выбрана',
      viewDetails: 'Посмотреть детали',
      selectVenue: 'Выбрать площадку',
      checklist: 'Чек-лист',
      checklistVenue: 'Выбрать площадку',
      checklistGuests: 'Добавить гостей',
      checklistBudget: 'Настроить бюджет',
      checklistInvites: 'Отправить приглашения',
      open: 'Открыть',
    },
    guests: {
      title: 'Гости',
      addGuest: 'Добавить гостя',
      confirmed: 'Подтвердили',
      familyOptional: 'Семья (опционально)',
      maybe: 'Может быть',
      declined: 'Отказались',
      pending: 'Ожидание',
      families: 'Семьи',
      individuals: 'Отдельно',
      total: 'Всего',
      noGuests: 'Гостей не найдено',
      noFamilies: 'Семьи не найдены',
      noResults: 'Результаты не найдены',
      familyMembers: 'Членов семьи',
      phoneRequired: 'Номер телефона обязателен',
      phoneInvalid: 'Номер телефона должен содержать 9 цифр',
    },
    venues: {
      findVenue: 'Найти площадку',
      myVenues: 'Мои площадки',
      addVenue: 'Добавить площадку',
      capacity: 'Вместимость',
      price: 'Цена',
      perHour: 'в час',
      location: 'Расположение',
      contact: 'Контакты',
      book: 'Забронировать',
      details: 'Детали',
      featureMusic: 'Музыкальное оборудование',
      featureCatering: 'Кейтеринг',
      featureParking: 'Бесплатная парковка',
      featureAC: 'Кондиционер',
      featureDecor: 'Декорации',
      featurePhoto: 'Фотозона',
      contactMessage: 'Здравствуйте! Меня интересует площадка {name}',
      descriptionTitle: 'Описание',
      descriptionBlurb: 'Идеальное место для проведения торжественных мероприятий, свадеб, корпоративов и других праздников. Профессиональное обслуживание и современное оборудование обеспечат незабываемый праздник.',
      featuresTitle: 'Удобства',
      from: 'от',
      upTo: 'до',
      select: 'Выбрать',
    },
    bookings: {
      myBookings: 'Мои брони',
      pending: 'Ожидание',
      confirmed: 'Подтверждено',
      cancelled: 'Отменено',
      acceptBooking: 'Принять',
      declineBooking: 'Отклонить',
      chat: 'Чат',
      viewDetails: 'Подробнее',
    },
    dates: {
      monthsShort: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
    },
    owner: {
      welcome: 'Добро пожаловать',
      quickActions: 'Быстрые действия',
      venuesLabel: 'Заведений',
      bookingsLabel: 'Бронь',
      pendingLabel: 'Ожидают',
      addVenueBtn: 'Добавить заведение',
      myVenuesBtn: 'Мои заведения',
      bookingsScheduleBtn: 'Брони и расписание',
      myVenuesTitle: 'Мои заведения',
      viewAll: 'Все',
      noVenuesTitle: 'У вас пока нет заведений',
      noVenuesDesc: 'Добавьте свое первое заведение, чтобы начать получать брони',
      bookingsTitle: 'Брони и расписание',
      tabs: { all: 'Все', pending: 'Ожидают', confirmed: 'Подтверждены' },
      status: { confirmed: 'Подтверждена', pending: 'Ожидает подтверждения', cancelled: 'Отменена' },
      guestsLabel: 'Гостей',
      organizerLabel: 'Организатор:',
      chat: 'Чат',
      whatsapp: 'WhatsApp',
      confirmAction: 'Подтвердить',
      cancelAction: 'Отменить',
      noBookingsTitle: 'Нет броней',
      noBookingsPending: 'Нет броней, ожидающих подтверждения',
      noBookingsConfirmed: 'Нет подтвержденных броней',
      noBookingsAll: 'У вас пока нет броней',
      venueSingular: 'заведение',
      venuePlural: 'заведений',
    },
    budgetScreen: {
      title: 'Бюджет',
      subtitle: 'Управление расходами',
      total: 'Общий бюджет',
      spent: 'Потрачено',
      remaining: 'Остаток',
      addExpense: 'Добавить расход',
      newExpenseTitle: 'Новый расход',
      categoryLabel: 'Категория',
      amountLabel: 'Сумма',
      descriptionLabel: 'Описание',
      expensesTitle: 'Расходы',
      emptyExpensesNote: 'Расходы не добавлены',
      venue: 'Площадка',
      food: 'Еда',
      decor: 'Декор',
      music: 'Музыка',
      photo: 'Фото',
      other: 'Другое',
      overspent: 'Превышен на {amount} сом',
      budgetEventsTitle: 'Бюджеты мероприятий',
      totalBudget: 'Общий бюджет',
      spentLabel: 'Потрачено:',
      remainingLabel: 'Осталось:',
      budgetLabel: 'Бюджет:',
      noEventsTitle: 'У вас пока нет мероприятий',
      noEventsDesc: 'Создайте мероприятие, чтобы начать управлять бюджетом',
      createEventBtn: 'Создать мероприятие',
      expensesCount: 'расходов',
      expenseItem: 'статья',
      expenseItems: 'статьи',
      expenseItemsMany: 'статей',
      currency: 'сом',
    },
    languages: {
      russian: 'Русский',
      kyrgyz: 'Кыргызча',
      english: 'English',
    },
    auth: {
      phoneInvalid: 'Введите корректный номер телефона',
      emailMustBeGmail: 'Используйте Gmail адрес',
      codeInvalid: 'Неверный код',
      enterPhone: 'Введите номер телефона',
      enterCode: 'Введите код',
      sendingCode: 'Отправка...',
      getCode: 'Получить код',
      phoneLabel: 'Номер телефона',
      codeLabel: 'Код подтверждения',
      demoNote: 'Для демо используйте любые 6 цифр',
      changeNumber: 'Изменить номер',
      signInWithGoogle: 'Войти через Google',
      verifying: 'Проверка...',
      submit: 'Подтвердить',
    },
    addVenue: {
      title: 'Добавить заведение',
      step: 'Шаг {step} из 5',
      basicInfoTitle: 'Основная информация',
      basicInfoDesc: 'Укажите название и тип заведения',
      nameLabel: 'Название заведения *',
      namePlaceholder: 'Например: Ресторан Ала-Арча',
      typeLabel: 'Тип заведения *',
      selectPlaceholder: 'Выберите тип',
      priceLabel: 'Цена аренды (сом) *',
      capacityLabel: 'Вместимость (чел) *',
      locationTitle: 'Локация и описание',
      locationDesc: 'Укажите адрес и опишите ваше заведение',
      addressLabel: 'Адрес *',
      addressPlaceholder: 'г. Бишкек, ул. Абая 123',
      descriptionLabel: 'Описание *',
      descriptionPlaceholder: 'Опишите ваше заведение: интерьер, услуги, особенности...',
      descriptionCount: '{count} / 20 минимум',
      mapCity: 'Карта: Бишкек',
      amenitiesTitle: 'Удобства',
      amenitiesDesc: 'Отметьте, что есть в вашем заведении',
      contactTitle: 'Контактная информация',
      phoneLabel: 'Номер телефона *',
      whatsappLabel: 'WhatsApp *',
      whatsappNote: 'Организаторы смогут связаться с вами через WhatsApp',
      photosTitle: 'Фотографии',
      photosDesc: 'Загрузите до 10 фотографий вашего заведения',
      addPhoto: 'Нажмите для добавления фото',
      uploadedPhotosLabel: 'Загруженные фото',
      mainLabel: 'Главное',
      clickToMakeMain: 'Нажмите на фото, чтобы сделать его главным',
      publish: 'Опубликовать',
      next: 'Далее',
      back: 'Назад',
      validations: {
        nameMin: 'Введите название заведения (минимум 3 символа)',
        selectType: 'Выберите тип заведения',
        invalidPrice: 'Введите корректную цену',
        capacityRequired: 'Введите вместимость',
        addressRequired: 'Введите адрес заведения',
        descriptionMin: 'Добавьте описание (минимум 20 символов)',
        invalidPhone: 'Введите корректный номер телефона',
        invalidWhatsapp: 'Введите корректный номер WhatsApp',
        photosMin: 'Добавьте хотя бы одно фото заведения',
      }
    },
    budgetPie: {
      noData: 'Нет данных для отображения',
      expenses: 'Расходы',
      currency: 'сом'
    },
  },
  
  kg: {
    common: {
      save: 'Сактоо',
      cancel: 'Жокко чыгаруу',
      delete: 'Өчүрүү',
      edit: 'Түзөтүү',
      back: 'Артка',
      next: 'Кийинки',
      confirm: 'Ырастоо',
      close: 'Жабуу',
      search: 'Издөө',
      loading: 'Жүктөлүүдө...',
      greeting: '{name}, салам!',
      welcome: 'Кош келиңиз!',
      appName: 'Toi App',
      introSlogan: 'Тойду оңой уюштуруңуз',
      learnMore: 'Тиркеме жөнүндө көбүрөөк билүү',
      goBack: 'Кайра кайтуу',
      register: 'Тиркелүү',
      signIn: 'Кирүү',
      notFound: 'Табылган жок',
      venueNotSelected: 'Жай тандалган эмес',
      familyNotFound: 'Үй-бүлө табылган жок',
      bookingNotFound: 'Бронь табылган жок',
      bookingNotFoundOrUnauthorized: 'Бронь табылган жок же колдонуучу авторизацияланган эмес',
      notAuthorized: 'Колдонуучу авторизацияланган эмес',
      people: 'адам',
    },
    nav: {
      home: 'Башкы бет',
      events: 'Иш-чаралар',
      profile: 'Профиль',
      venues: 'Жайлар',
      bookings: 'Брондор',
      budget: 'Бюджет',
    },
    profile: {
      title: 'Профиль',
      organizer: 'Иш-чара уюштуруучу',
      owner: 'Жай ээси',
      firstName: 'Аты',
      lastName: 'Фамилиясы',
      middleName: 'Атасынын аты',
      phone: 'Телефон',
      email: 'Электрондук почта',
      photo: 'Сүрөт',
      editProfile: 'Профилди түзөтүү',
      settings: 'Тууралоолор',
      language: 'Тил',
      support: 'Колдоо',
      logout: 'Чыгуу',
      logoutConfirm: 'Чыгууну каалайсызбы?',
      appVersion: 'Toi App v1.0',
      rightsReserved: '© 2024 Бардык укуктар корголгон',
    },
    settings: {
      title: 'Тууралоолор',
      profileSettings: 'Профиль тууралоолору',
      accountSettings: 'Аккаунт тууралоолору',
      updatePhoto: 'Сүрөттү жаңыртуу',
      deletePhoto: 'Сүрөттү өчүрүү',
      changePhone: 'Телефонду өзгөртүү',
      changeEmail: 'Email өзгөртүү',
      notifications: 'Билдирмелер',
      privacy: 'Купуялык',
      theme: 'Тема',
      lightTheme: 'Ачык',
      darkTheme: 'Караңгы',
      savedSuccessfully: 'Өзгөртүүлөр сакталды',
    },
    support: {
      title: 'Колдоо',
      chatWithAI: 'АИ-жардамчы менен баарлашуу',
      typeMessage: 'Билдирүү жазыңыз...',
      send: 'Жөнөтүү',
      faqTitle: 'Көп берилүүчү суроолор',
      faq1: 'Иш-чараны кантип түзүү керек?',
      faq2: 'Жайды кантип брондоо керек?',
      faq3: 'Конокторду кантип кошуу керек?',
      faq4: 'Бюджетти кантип башкаруу керек?',
      faq5: 'Жай ээси менен кантип байланышуу керек?',
      faq6: 'Профиль маалыматтарын кантип өзгөртүү керек?',
      aiGreeting: 'Салам! Мен Toi App тиркемесиндеги АИ-жардамчымын. Эмне менен жардам бере алам?',
      aiHelp: 'Сиз мага тиркеме жөнүндө каалаган суроо берсеңиз болот же төмөнкү көп берилүүчү суроолордун биринен тандай аласыз.',
    },
    events: {
      myEvents: 'Менин иш-чараларым',
      createEvent: 'Иш-чара түзүү',
      eventName: 'Иш-чаранын аталышы',
      eventNamePlaceholder: 'Мисалы: 50 жылдык юбилей',
      eventDate: 'Күнү',
      eventTime: 'Убакыты',
      dateLabel: 'Күнү',
      timeLabel: 'Убакыты',
      guestsCount: 'Конок саны',
      guestsPlaceholder: 'Конок санын киргизиңиз',
      budget: 'Бюджет',
      eventType: 'Иш-чаранын түрү',
      wedding: 'Той',
      birthday: 'Туулган күн',
      corporate: 'Корпоратив',
      other: 'Башка',
      dashboard: 'Иш-чара панели',
      noActiveEvent: 'Белгиленген иш-чара жок',
      stepLabel: 'Кадам {step}/5',
      eventSingular: 'иш-чара',
      eventPlural: 'иш-чаралар',
      noEventsTitle: 'Иш-чаралар жок',
      noEventsDesc: 'Алгачкы иш-чараңызды түзүңүз',
      upcomingEvents: 'Алдыда',
      pastEvents: 'Өткөндөр',
      eventTypes: {
        toy: 'Той',
        wedding: 'Үйлөнүү той',
        kyzUzatu: 'Кыз узату',
        birthday: 'Туулган күн',
        picnic: 'Пикник',
        corporate: 'Корпоратив',
        other: 'Башка',
      },
    },
    eventDashboard: {
      venue: 'Жай',
      venueNotSelected: 'Тандалган эмес',
      viewDetails: 'Деталдарды көрүү',
      selectVenue: 'Жай тандоо',
      checklist: 'Текшерүү тизмеси',
      checklistVenue: 'Жай тандоо',
      checklistGuests: 'Конокторду кошуу',
      checklistBudget: 'Бюджетти түзүү',
      checklistInvites: 'Чакырууларды жөнөтүү',
      open: 'Ачуу',
    },
    guests: {
      title: 'Конок',
      addGuest: 'Конок кошуу',
      confirmed: 'Ырастады',
      familyOptional: 'Үй-бүлө (көз карандысыз)',
      maybe: 'Балким',
      declined: 'Баш тартты',
      pending: 'Күтүүдө',
      families: 'Үй-бүлөлөр',
      individuals: 'Жеке',
      total: 'Жалпы',
      noGuests: 'Коноктар табылган жок',
      noFamilies: 'Үй-бүлөлөр табылган жок',
      noResults: 'Натыйжалар табылган жок',
      familyMembers: 'Үй-бүлө мүчөлөрү',
      phoneRequired: 'Телефон номери милдеттүү',
      phoneInvalid: 'Телефон номери 9 сандан турушу керек',
    },
    venues: {
      findVenue: 'Жай табуу',
      myVenues: 'Менин жайларым',
      addVenue: 'Жай кошуу',
      capacity: 'Сыйымдуулугу',
      price: 'Баасы',
      perHour: 'саатына',
      location: 'Жайгашкан жери',
      contact: 'Байланыш',
      book: 'Брондоо',
      details: 'Деталдар',
      featureMusic: 'Музыкалык жабдуу',
      featureCatering: 'Кейтеринг',
      featureParking: 'Бекер парктоо',
      featureAC: 'Кондисионер',
      featureDecor: 'Безендирүү',
      featurePhoto: 'Фото зона',
      contactMessage: 'Саламатсызбы! Менин кызыкчылыгым бар: {name}',
      descriptionTitle: 'Сүрөттөө',
      descriptionBlurb: 'Тойлорду, никелерди, корпоративдерди жана башка майрамдар үчүн мыкты жер. Кесипкөй кызмат жана заманбап жабдуу сыйкырдуу маанай камсыздайт.',
      featuresTitle: 'Ыңгайлуулук',
      from: 'дөн',
      upTo: 'ге чейин',
      select: 'Тандап алуу',
    },
    bookings: {
      myBookings: 'Менин брондорум',
      pending: 'Күтүүдө',
      confirmed: 'Ырасталды',
      cancelled: 'Жокко чыгарылды',
      acceptBooking: 'Кабыл алуу',
      declineBooking: 'Баш тартуу',
      chat: 'Чат',
      viewDetails: 'Кененирээк',
    },
    dates: {
      monthsShort: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
    },
    owner: {
      welcome: 'Кош келиңиз',
      quickActions: 'Ыкчам аракеттер',
      venuesLabel: 'Жайлар',
      bookingsLabel: 'Брондор',
      pendingLabel: 'Күтүүдө',
      addVenueBtn: 'Жай кошуу',
      myVenuesBtn: 'Менин жайларым',
      bookingsScheduleBtn: 'Брондор жана график',
      myVenuesTitle: 'Менин жайларым',
      viewAll: 'Бардыгы',
      noVenuesTitle: 'Сизде дагы жай жок',
      noVenuesDesc: 'Алгачкы жайыңызды кошуңуз, андан кийин брондорду алыңыз',
      bookingsTitle: 'Брондор жана график',
      tabs: { all: 'Бардыгы', pending: 'Күтүүдө', confirmed: 'Ырасталды' },
      status: { confirmed: 'Ырасталды', pending: 'Күтүп жатат', cancelled: 'Жокко чыгарылды' },
      guestsLabel: 'Коноктор',
      organizerLabel: 'Уюштуруучу:',
      chat: 'Чат',
      whatsapp: 'WhatsApp',
      confirmAction: 'Ырастоо',
      cancelAction: 'Жокко чыгару',
      noBookingsTitle: 'Брондор жок',
      noBookingsPending: 'Күтүп турган брондор жок',
      noBookingsConfirmed: 'Ырасталган брондор жок',
      noBookingsAll: 'Сизде дагы брондор жок',
      venueSingular: 'жай',
      venuePlural: 'жайлар',
    },
    budgetScreen: {
      title: 'Бюджет',
      subtitle: 'Чыгымдарды башкаруу',
      total: 'Жалпы бюджет',
      spent: 'Коротулду',
      remaining: 'Калдык',
      addExpense: 'Чыгым кошуу',
      newExpenseTitle: 'Жаңы чыгым',
      categoryLabel: 'Категория',
      amountLabel: 'Сумма',
      descriptionLabel: 'Сүрөттөө',
      expensesTitle: 'Чыгымдар',
      emptyExpensesNote: 'Чыгымдар кошулган жок',
      venue: 'Жай',
      food: 'Тамак',
      decor: 'Безендирүү',
      music: 'Музыка',
      photo: 'Сүрөт',
      other: 'Башка',
      overspent: '{amount} сом ашты',
      budgetEventsTitle: 'Иш-чаралардын бюджеттери',
      totalBudget: 'Жалпы бюджет',
      spentLabel: 'Коротулду:',
      remainingLabel: 'Калды:',
      budgetLabel: 'Бюджет:',
      noEventsTitle: 'Сизде дагы иш-чаралар жок',
      noEventsDesc: 'Бюджетти башкаруу үчүн иш-чара түзүңүз',
      createEventBtn: 'Иш-чара түзүү',
      expensesCount: 'чыгымдар',
      expenseItem: 'статья',
      expenseItems: 'статьялар',
      expenseItemsMany: 'статьялар',
      currency: 'сом',
    },
    languages: {
      russian: 'Орусча',
      kyrgyz: 'Кыргызча',
      english: 'Англисче',
    },
    auth: {
      phoneInvalid: 'Туура телефон номерин киргизиңиз',
      emailMustBeGmail: 'Gmail дарегин колдонуңуз',
      codeInvalid: 'Код туура эмес',
      enterPhone: 'Телефон номерин киргизиңиз',
      enterCode: 'Кодду киргизиңиз',
      sendingCode: 'Жөнөтүлүүдө...',
      getCode: 'Код алуу',
      phoneLabel: 'Телефон номери',
      codeLabel: 'Тастыктоо коду',
      demoNote: 'Демо үчүн каалаган 6 санын колдонуңуз',
      changeNumber: 'Номерди өзгөртүү',
      signInWithGoogle: 'Google аркылуу кирүү',
      verifying: 'Текшерилүүдө...',
      submit: 'Ырастоо',
    },
    addVenue: {
      title: 'Жай кошуу',
      step: 'Кадам {step} из 5',
      basicInfoTitle: 'Негизги маалымат',
      basicInfoDesc: 'Жайдын аталышын жана түрүн көрсөтүңүз',
      nameLabel: 'Жайдын аталышы *',
      namePlaceholder: 'Мисалы: Ресторан Ала-Арча',
      typeLabel: 'Жайдын түрү *',
      selectPlaceholder: 'Түрүн тандаңыз',
      priceLabel: 'Ижара баасы (сом) *',
      capacityLabel: 'Сыйымдуулук (адам) *',
      locationTitle: 'Локация жана сүрөттөө',
      locationDesc: 'Дарекни көрсөтүңүз жана жайыңызды сүрөттɵңүз',
      addressLabel: 'Дарек *',
      addressPlaceholder: 'г. Бишкек, ул. Абая 123',
      descriptionLabel: 'Сүрөттɵөө *',
      descriptionPlaceholder: 'Жайыңызды сүрөттɵңүз: интерьер, кызматтар, өзгөчөлүктөр...',
      descriptionCount: '{count} / 20 минимум',
      mapCity: 'Карта: Бишкек',
      amenitiesTitle: 'Ыңгайлуулуктар',
      amenitiesDesc: 'Жайыңызда бар нерселерди белгилеңиз',
      contactTitle: 'Байланыш маалыматы',
      phoneLabel: 'Тел номери *',
      whatsappLabel: 'WhatsApp *',
      whatsappNote: 'Уюштуруучулар сиз менен WhatsApp аркылуу байланышышат',
      photosTitle: 'Сүрөттөр',
      photosDesc: 'Жайыңыздын 10 сүрөтүн жүктɵңүз',
      addPhoto: 'Сүрөт кошуу үчүн басыңыз',
      uploadedPhotosLabel: 'Жүктөлгөн сүрөттөр',
      mainLabel: 'Башкы',
      clickToMakeMain: 'Сүрөттү башкы кылуу үчүн чыкылдатыңыз',
      publish: 'Жарыялоо',
      next: 'Кийинки',
      back: 'Артка',
      validations: {
        nameMin: 'Жайдын аталышын киргизиңиз (мин 3 белгиден)',
        selectType: 'Түрүн тандаңыз',
        invalidPrice: 'Туура бааны киргизиңиз',
        capacityRequired: 'Сыйымдуулукту киргизиңиз',
        addressRequired: 'Даректи киргизиңиз',
        descriptionMin: 'Сүрөттɵөнү кошуңуз (мин 20 белгиден)',
        invalidPhone: 'Телефон номери туура эмес',
        invalidWhatsapp: 'WhatsApp номери туура эмес',
        photosMin: 'Жайыңыздын кем дегенде бир сүрөтүн кошуңуз',
      }
    },
    budgetPie: {
      noData: 'Маалымат жок',
      expenses: 'Чыгымдар',
      currency: 'сом'
    },
  },
  
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      close: 'Close',
      search: 'Search',
      loading: 'Loading...',
      greeting: 'Hello, {name}!',
      welcome: 'Welcome!',
      appName: 'Toi App',
      introSlogan: 'Plan your Toi easily',
      learnMore: 'Learn more about the app',
      goBack: 'Go back',
      register: 'Register',
      signIn: 'Sign in',
      notFound: 'Not found',
      venueNotSelected: 'Venue not selected',
      familyNotFound: 'Family not found',
      bookingNotFound: 'Booking not found',
      bookingNotFoundOrUnauthorized: 'Booking not found or user not authorized',
      notAuthorized: 'User not authorized',
      people: 'people',
    },
    nav: {
      home: 'Home',
      events: 'Events',
      profile: 'Profile',
      venues: 'Venues',
      bookings: 'Bookings',
      budget: 'Budget',
    },
    profile: {
      title: 'Profile',
      organizer: 'Event Organizer',
      owner: 'Venue Owner',
      firstName: 'First Name',
      lastName: 'Last Name',
      middleName: 'Middle Name',
      phone: 'Phone',
      email: 'Email',
      photo: 'Photo',
      editProfile: 'Edit Profile',
      settings: 'Settings',
      language: 'App Language',
      support: 'Support',
      logout: 'Log Out',
      logoutConfirm: 'Are you sure you want to log out?',
      appVersion: 'Toi App v1.0',
      rightsReserved: '© 2024 All Rights Reserved',
    },
    settings: {
      title: 'Settings',
      profileSettings: 'Profile Settings',
      accountSettings: 'Account Settings',
      updatePhoto: 'Update Photo',
      deletePhoto: 'Delete Photo',
      changePhone: 'Change Phone',
      changeEmail: 'Change Email',
      notifications: 'Notifications',
      privacy: 'Privacy',
      theme: 'Theme',
      lightTheme: 'Light',
      darkTheme: 'Dark',
      savedSuccessfully: 'Changes saved',
    },
    support: {
      title: 'Support',
      chatWithAI: 'Chat with AI Assistant',
      typeMessage: 'Type a message...',
      send: 'Send',
      faqTitle: 'Frequently Asked Questions',
      faq1: 'How to create an event?',
      faq2: 'How to book a venue?',
      faq3: 'How to add guests?',
      faq4: 'How to manage budget?',
      faq5: 'How to contact venue owner?',
      faq6: 'How to edit profile data?',
      aiGreeting: 'Hello! I\'m your AI assistant in Toi App. How can I help you?',
      aiHelp: 'You can ask me any question about the app or choose one of the frequently asked questions below.',
    },
    events: {
      myEvents: 'My Events',
      createEvent: 'Create Event',
      eventName: 'Event Name',
      eventNamePlaceholder: 'E.g.: 50th Anniversary',
      eventDate: 'Date',
      eventTime: 'Time',
      dateLabel: 'Date',
      timeLabel: 'Time',
      guestsCount: 'Guest Count',
      guestsPlaceholder: 'Enter guest count',
      budget: 'Budget',
      eventType: 'Event Type',
      wedding: 'Wedding',
      birthday: 'Birthday',
      corporate: 'Corporate',
      other: 'Other',
      dashboard: 'Event Dashboard',
      noActiveEvent: 'No active event',
      stepLabel: 'Step {step}/5',
      eventTypes: {
        toy: 'Toy',
        wedding: 'Wedding',
        kyzUzatu: 'Kyz Uzatu',
        birthday: 'Birthday',
        picnic: 'Picnic',
        corporate: 'Corporate',
        other: 'Other',
      },
    },
    eventDashboard: {
      venue: 'Venue',
      venueNotSelected: 'Not selected',
      viewDetails: 'View Details',
      selectVenue: 'Select Venue',
      checklist: 'Checklist',
      checklistVenue: 'Select Venue',
      checklistGuests: 'Add Guests',
      checklistBudget: 'Set Budget',
      checklistInvites: 'Send Invitations',
      open: 'Open',
    },
    guests: {
      title: 'Guests',
      addGuest: 'Add Guest',
      confirmed: 'Confirmed',
      familyOptional: 'Family (optional)',
      maybe: 'Maybe',
      declined: 'Declined',
      pending: 'Pending',
      families: 'Families',
      individuals: 'Individuals',
      total: 'Total',
      noGuests: 'No guests found',
      noFamilies: 'No families found',
      noResults: 'No results found',
      familyMembers: 'Family Members',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Phone number must contain 9 digits',
    },
    venues: {
      findVenue: 'Find Venue',
      myVenues: 'My Venues',
      addVenue: 'Add Venue',
      capacity: 'Capacity',
      price: 'Price',
      perHour: 'per hour',
      location: 'Location',
      contact: 'Contact',
      book: 'Book',
      details: 'Details',
      featureMusic: 'Music Equipment',
      featureCatering: 'Catering',
      featureParking: 'Free Parking',
      featureAC: 'Air Conditioning',
      featureDecor: 'Decor',
      featurePhoto: 'Photo Zone',
      contactMessage: 'Hello! I am interested in the venue {name}',
      descriptionTitle: 'Description',
      descriptionBlurb: 'A perfect place for ceremonies, weddings, corporate events and other celebrations. Professional service and modern equipment will ensure an unforgettable experience.',
      featuresTitle: 'Amenities',
      from: 'from',
      upTo: 'up to',
      select: 'Select',
    },
    bookings: {
      myBookings: 'My Bookings',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      acceptBooking: 'Accept',
      declineBooking: 'Decline',
      chat: 'Chat',
      viewDetails: 'View Details',
    },
    dates: {
      monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    },
    owner: {
      welcome: 'Welcome',
      quickActions: 'Quick Actions',
      venuesLabel: 'Venues',
      bookingsLabel: 'Bookings',
      pendingLabel: 'Pending',
      addVenueBtn: 'Add Venue',
      myVenuesBtn: 'My Venues',
      bookingsScheduleBtn: 'Bookings & Schedule',
      myVenuesTitle: 'My Venues',
      viewAll: 'View All',
      noVenuesTitle: 'You have no venues yet',
      noVenuesDesc: 'Add your first venue to start receiving bookings',
      bookingsTitle: 'Bookings & Schedule',
      tabs: { all: 'All', pending: 'Pending', confirmed: 'Confirmed' },
      status: { confirmed: 'Confirmed', pending: 'Pending confirmation', cancelled: 'Cancelled' },
      guestsLabel: 'Guests',
      organizerLabel: 'Organizer:',
      chat: 'Chat',
      whatsapp: 'WhatsApp',
      confirmAction: 'Confirm',
      cancelAction: 'Cancel',
      noBookingsTitle: 'No bookings',
      noBookingsPending: 'No bookings awaiting confirmation',
      noBookingsConfirmed: 'No confirmed bookings',
      noBookingsAll: 'You have no bookings yet',
      venueSingular: 'venue',
      venuePlural: 'venues',
    },
    budgetScreen: {
      title: 'Budget',
      subtitle: 'Manage expenses',
      total: 'Total Budget',
      spent: 'Spent',
      remaining: 'Remaining',
      addExpense: 'Add Expense',
      newExpenseTitle: 'New Expense',
      categoryLabel: 'Category',
      amountLabel: 'Amount',
      descriptionLabel: 'Description',
      expensesTitle: 'Expenses',
      emptyExpensesNote: 'No expenses added',
      venue: 'Venue',
      food: 'Food',
      decor: 'Decor',
      music: 'Music',
      photo: 'Photo',
      other: 'Other',
      overspent: 'Over budget by {amount} KGS',
      budgetEventsTitle: 'Event Budgets',
      totalBudget: 'Total Budget',
      spentLabel: 'Spent:',
      remainingLabel: 'Remaining:',
      budgetLabel: 'Budget:',
      noEventsTitle: 'You have no events yet',
      noEventsDesc: 'Create an event to start managing budget',
      createEventBtn: 'Create Event',
      expensesCount: 'expenses',
      expenseItem: 'item',
      expenseItems: 'items',
      expenseItemsMany: 'items',
      currency: 'KGS',
    },
    languages: {
      russian: 'Russian',
      kyrgyz: 'Kyrgyz',
      english: 'English',
    },
    auth: {
      phoneInvalid: 'Please enter a valid phone number',
      emailMustBeGmail: 'Please use a Gmail address',
      codeInvalid: 'Invalid code',
      enterPhone: 'Enter phone number',
      enterCode: 'Enter code',
      sendingCode: 'Sending...',
      getCode: 'Get code',
      phoneLabel: 'Phone number',
      codeLabel: 'Verification code',
      demoNote: 'For demo use any 6 digits',
      changeNumber: 'Change number',
      signInWithGoogle: 'Sign in with Google',
      verifying: 'Verifying...',
      submit: 'Confirm',
    },
    addVenue: {
      title: 'Add Venue',
      step: 'Step {step} of 5',
      basicInfoTitle: 'Basic Information',
      basicInfoDesc: 'Provide venue name and type',
      nameLabel: 'Venue name *',
      namePlaceholder: 'e.g. Ala-Archa Restaurant',
      typeLabel: 'Venue type *',
      selectPlaceholder: 'Select type',
      priceLabel: 'Rental price (сом) *',
      capacityLabel: 'Capacity (people) *',
      locationTitle: 'Location & Description',
      locationDesc: 'Provide address and describe your venue',
      addressLabel: 'Address *',
      addressPlaceholder: 'Bishkek, Abaya St. 123',
      descriptionLabel: 'Description *',
      descriptionPlaceholder: 'Describe your venue: interior, services, features...',
      descriptionCount: '{count} / 20 minimum',
      mapCity: 'Map: Bishkek',
      amenitiesTitle: 'Amenities',
      amenitiesDesc: 'Check what your venue has',
      contactTitle: 'Contact information',
      phoneLabel: 'Phone number *',
      whatsappLabel: 'WhatsApp *',
      whatsappNote: 'Organizers can contact you via WhatsApp',
      photosTitle: 'Photos',
      photosDesc: 'Upload up to 10 photos of your venue',
      addPhoto: 'Click to add photo',
      uploadedPhotosLabel: 'Uploaded photos',
      mainLabel: 'Main',
      clickToMakeMain: 'Click a photo to make it main',
      publish: 'Publish',
      next: 'Next',
      back: 'Back',
      validations: {
        nameMin: 'Enter venue name (minimum 3 characters)',
        selectType: 'Select a venue type',
        invalidPrice: 'Enter a valid price',
        capacityRequired: 'Enter capacity',
        addressRequired: 'Enter venue address',
        descriptionMin: 'Add a description (minimum 20 characters)',
        invalidPhone: 'Enter a valid phone number',
        invalidWhatsapp: 'Enter a valid WhatsApp number',
        photosMin: 'Add at least one photo of your venue',
      }
    },
    budgetPie: {
      noData: 'No data to display',
      expenses: 'Expenses',
      currency: 'KGS'
    },
  },
};

// Хук для использования переводов
import React, { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

// Хук для использования переводов. Если `lang` не передан, берём язык из контекста.
export function useTranslations(lang?: Language): Translations {
  try {
    const ctx = useContext(LanguageContext as any);
    const l: Language = (lang || ctx?.language || 'ru') as Language;
    return translations[l];
  } catch (e) {
    const l: Language = (lang || 'ru') as Language;
    return translations[l];
  }
}
