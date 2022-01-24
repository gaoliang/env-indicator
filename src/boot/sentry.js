import * as Sentry from '@sentry/vue'

export default ({ app, router, store }) => {
  Sentry.init({
    app,
    dsn: 'https://943feb238ce3482694f1b37acf0b38bc@o312877.ingest.sentry.io/5658043',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}
