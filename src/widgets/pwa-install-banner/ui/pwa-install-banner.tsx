import { useEffect, useMemo, useState } from 'react';

import { Button } from '@shared/ui';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_STORAGE_KEY = 'pwa-install-banner-dismissed-at';
const DISMISS_DAYS = 7;

const isIosDevice = (): boolean => {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

const isIosSafari = (): boolean => {
  const userAgent = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(userAgent);
  const isSafari = /safari/i.test(userAgent);
  const isOtherIosBrowser = /crios|fxios|edgios|opios|yaapp_ios|yabrowser/i.test(userAgent);

  return isIos && isSafari && !isOtherIosBrowser;
};

const isAndroidDevice = (): boolean => {
  return /android/i.test(window.navigator.userAgent);
};

const isStandalone = (): boolean => {
  const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const hasNavigatorStandalone =
    'standalone' in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  return isDisplayStandalone || hasNavigatorStandalone;
};

const isDismissExpired = (): boolean => {
  const value = localStorage.getItem(DISMISS_STORAGE_KEY);

  if (!value) {
    return true;
  }

  const dismissedAt = Number(value);

  if (!Number.isFinite(dismissedAt)) {
    return true;
  }

  const expiresAt = dismissedAt + DISMISS_DAYS * 24 * 60 * 60 * 1000;

  return Date.now() > expiresAt;
};

export const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(() => !isDismissExpired());
  const [isInstalled, setIsInstalled] = useState(isStandalone());
  const isSecure = window.isSecureContext;

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const canInstall = Boolean(deferredPrompt);
  const isAndroid = useMemo(() => isAndroidDevice(), []);
  const showIosSafariHint = useMemo(() => isIosSafari() && !isInstalled, [isInstalled]);
  const showIosOpenSafariHint = useMemo(
    () => isIosDevice() && !isIosSafari() && !isInstalled,
    [isInstalled],
  );
  const showAndroidHint = useMemo(
    () => isAndroid && !isInstalled && !canInstall,
    [canInstall, isAndroid, isInstalled],
  );
  const shouldShow =
    !isInstalled &&
    !isDismissed &&
    (canInstall || showIosSafariHint || showIosOpenSafariHint || showAndroidHint);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    setIsDismissed(true);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="border-b border-border bg-muted/60 px-4 py-2">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <p className="text-xs text-foreground">
          {canInstall
            ? 'Установите приложение на главный экран для быстрого доступа и офлайн-работы.'
            : showIosSafariHint
              ? 'На iPhone установка только вручную: Safari -> Поделиться -> На экран «Домой».'
              : showIosOpenSafariHint
                ? 'Для установки на iPhone откройте сайт именно в Safari, затем: Поделиться -> На экран «Домой».'
                : isSecure
                  ? 'Добавьте приложение через меню браузера (⋮) -> Установить приложение.'
                  : 'В dev по http Android часто создает обычный ярлык с адресной строкой. Для полноэкранного режима откройте HTTPS или production-сборку и выберите «Установить приложение».'}
        </p>
        <div className="flex items-center gap-2">
          {canInstall ? (
            <Button type="button" size="sm" onClick={() => void handleInstall()}>
              Добавить
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="ghost" onClick={handleDismiss}>
            Позже
          </Button>
        </div>
      </div>
    </div>
  );
};
