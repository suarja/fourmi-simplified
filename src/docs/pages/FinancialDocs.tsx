import { useTranslation } from 'react-i18next';

export function FinancialDocs() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">{t('docs.financial.title')}</h1>
        <p className="text-xl text-white/70 mb-6">
          {t('docs.financial.subtitle')}
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">💰 {t('docs.financial.terms.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.financial.terms.description')}
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.terms.heloc.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.terms.heloc.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.terms.heloc.rate')}:</strong> {t('docs.financial.terms.heloc.rateDetail')}<br/>
              <strong>{t('docs.financial.terms.heloc.limit')}:</strong> {t('docs.financial.terms.heloc.limitDetail')}<br/>
              <strong>{t('docs.financial.terms.heloc.usage')}:</strong> {t('docs.financial.terms.heloc.usageDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.terms.dti.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.terms.dti.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.terms.dti.formula')}:</strong> {t('docs.financial.terms.dti.formulaDetail')}<br/>
              <strong>{t('docs.financial.terms.dti.good')}:</strong> {t('docs.financial.terms.dti.goodDetail')}<br/>
              <strong>{t('docs.financial.terms.dti.housing')}:</strong> {t('docs.financial.terms.dti.housingDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.terms.personal.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.terms.personal.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.terms.personal.rate')}:</strong> {t('docs.financial.terms.personal.rateDetail')}<br/>
              <strong>{t('docs.financial.terms.personal.terms')}:</strong> {t('docs.financial.terms.personal.termsDetail')}<br/>
              <strong>{t('docs.financial.terms.personal.amount')}:</strong> {t('docs.financial.terms.personal.amountDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.terms.transfer.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.terms.transfer.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.terms.transfer.promo')}:</strong> {t('docs.financial.terms.transfer.promoDetail')}<br/>
              <strong>{t('docs.financial.terms.transfer.fee')}:</strong> {t('docs.financial.terms.transfer.feeDetail')}<br/>
              <strong>{t('docs.financial.terms.transfer.after')}:</strong> {t('docs.financial.terms.transfer.afterDetail')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">📊 {t('docs.financial.values.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.financial.values.description')}
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.values.creditCard.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.values.creditCard.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.values.creditCard.reasoning')}:</strong> {t('docs.financial.values.creditCard.reasoningDetail')}<br/>
              <strong>{t('docs.financial.values.creditCard.usage')}:</strong> {t('docs.financial.values.creditCard.usageDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.values.personalLoan.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.values.personalLoan.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.values.personalLoan.reasoning')}:</strong> {t('docs.financial.values.personalLoan.reasoningDetail')}<br/>
              <strong>{t('docs.financial.values.personalLoan.usage')}:</strong> {t('docs.financial.values.personalLoan.usageDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.values.heloc.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.values.heloc.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.values.heloc.reasoning')}:</strong> {t('docs.financial.values.heloc.reasoningDetail')}<br/>
              <strong>{t('docs.financial.values.heloc.usage')}:</strong> {t('docs.financial.values.heloc.usageDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.values.maxDti.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.values.maxDti.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.values.maxDti.reasoning')}:</strong> {t('docs.financial.values.maxDti.reasoningDetail')}<br/>
              <strong>{t('docs.financial.values.maxDti.usage')}:</strong> {t('docs.financial.values.maxDti.usageDetail')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🧮 {t('docs.financial.formulas.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.financial.formulas.description')}
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.formulas.pmt.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.formulas.pmt.description')}
            </p>
            <div className="bg-black/40 rounded p-3 font-mono text-sm text-white/90 mb-2">
              PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
            </div>
            <div className="text-sm text-white/50">
              <strong>P:</strong> {t('docs.financial.formulas.pmt.principal')}<br/>
              <strong>r:</strong> {t('docs.financial.formulas.pmt.rate')}<br/>
              <strong>n:</strong> {t('docs.financial.formulas.pmt.months')}<br/>
              <strong>{t('docs.financial.formulas.location')}:</strong> <code>convex/lib/debtConsolidation.ts:4</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.formulas.payoff.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.formulas.payoff.description')}
            </p>
            <div className="bg-black/40 rounded p-3 font-mono text-sm text-white/90 mb-2">
              n = -log(1 - (P × r) / PMT) / log(1 + r)
            </div>
            <div className="text-sm text-white/50">
              <strong>P:</strong> {t('docs.financial.formulas.payoff.balance')}<br/>
              <strong>r:</strong> {t('docs.financial.formulas.payoff.rate')}<br/>
              <strong>PMT:</strong> {t('docs.financial.formulas.payoff.payment')}<br/>
              <strong>{t('docs.financial.formulas.location')}:</strong> <code>convex/lib/debtConsolidation.ts:21</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.formulas.interest.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.formulas.interest.description')}
            </p>
            <div className="bg-black/40 rounded p-3 font-mono text-sm text-white/90 mb-2">
              Total Interest = (Monthly Payment × Number of Months) - Principal
            </div>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.formulas.interest.usage')}:</strong> {t('docs.financial.formulas.interest.usageDetail')}<br/>
              <strong>{t('docs.financial.formulas.location')}:</strong> <code>convex/lib/debtConsolidation.ts:15</code>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">💾 {t('docs.financial.storage.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.financial.storage.description')}
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.storage.money.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.storage.money.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.storage.money.example')}:</strong> {t('docs.financial.storage.money.exampleDetail')}<br/>
              <strong>{t('docs.financial.storage.money.benefit')}:</strong> {t('docs.financial.storage.money.benefitDetail')}<br/>
              <strong>{t('docs.financial.storage.money.conversion')}:</strong> {t('docs.financial.storage.money.conversionDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.storage.validation.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.storage.validation.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.storage.validation.amounts')}:</strong> {t('docs.financial.storage.validation.amountsDetail')}<br/>
              <strong>{t('docs.financial.storage.validation.rates')}:</strong> {t('docs.financial.storage.validation.ratesDetail')}<br/>
              <strong>{t('docs.financial.storage.validation.location')}:</strong> <code>convex/lib/validation.ts</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.financial.storage.realtime.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.financial.storage.realtime.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.financial.storage.realtime.technology')}:</strong> {t('docs.financial.storage.realtime.technologyDetail')}<br/>
              <strong>{t('docs.financial.storage.realtime.pattern')}:</strong> {t('docs.financial.storage.realtime.patternDetail')}<br/>
              <strong>{t('docs.financial.storage.realtime.performance')}:</strong> {t('docs.financial.storage.realtime.performanceDetail')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}