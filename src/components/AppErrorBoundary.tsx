import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unexpected application error',
    };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Ibra Production runtime error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearShell = async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => key.startsWith('ibra-shell-'))
            .map((key) => caches.delete(key))
        );
      }
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration) {
        await registration.update();
      }
    } catch (error) {
      console.warn('Unable to clear cached shell:', error);
    } finally {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        dir="rtl"
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: '#0b080a',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <section
          style={{
            width: 'min(680px, 100%)',
            padding: 32,
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 24,
            background: 'rgba(255,255,255,.04)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 14 }}>I</div>
          <h1 style={{ margin: '0 0 12px', fontSize: 28 }}>
            حدث خطأ غير متوقع
          </h1>
          <p style={{ color: 'rgba(255,255,255,.68)', lineHeight: 1.8, margin: '0 0 22px' }}>
            تم إيقاف الجزء المتسبب في الخطأ بدل ترك الصفحة فارغة. أعد تحميل الموقع أو امسح نسخة
            التطبيق المخزنة إذا كان الخطأ بسبب نسخة قديمة.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                minHeight: 48,
                padding: '0 20px',
                border: 0,
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              إعادة تحميل
            </button>
            <button
              type="button"
              onClick={this.handleClearShell}
              style={{
                minHeight: 48,
                padding: '0 20px',
                border: '1px solid rgba(255,255,255,.18)',
                borderRadius: 12,
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              إصلاح نسخة التطبيق
            </button>
          </div>
          <details style={{ marginTop: 22, textAlign: 'right', color: 'rgba(255,255,255,.45)' }}>
            <summary style={{ cursor: 'pointer' }}>تفاصيل تقنية</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>
              {this.state.errorMessage}
            </pre>
          </details>
        </section>
      </main>
    );
  }
}
