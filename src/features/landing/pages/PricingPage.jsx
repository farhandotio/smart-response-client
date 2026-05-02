import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pricing.scss';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/forever',
    description: 'Get started with basic incident tracking and response workflows.',
    features: [
      'Basic incident tracking',
      'Up to 1 user',
      'Manual alerts',
      'Email support',
    ],
  },
  {
    name: 'Starter',
    price: '$49',
    frequency: '/month',
    description: 'Ideal for small security teams starting with incident response.',
    features: [
      'Basic incident workflows',
      'Up to 3 users',
      'Email alerts',
      'Standard reporting',
    ],
  },
  {
    name: 'Professional',
    price: '$149',
    frequency: '/month',
    description: 'Best for growing teams that need automation and SLA tracking.',
    features: [
      'Advanced incident orchestration',
      'Up to 10 users',
      'AI-assisted investigation',
      'Priority email support',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '/month',
    description: 'Custom plans for large teams with dedicated support.',
    features: [
      'Unlimited users',
      'Custom integrations',
      'Dedicated onboarding',
      '24/7 incident response support',
    ],
  },
];

const highlights = [
  {
    title: 'AI-powered prioritization',
    description: 'Automatically surface critical incidents and reduce response time.',
  },
  {
    title: 'Unified incident timeline',
    description: 'See every alert, action, and postmortem in one secure view.',
  },
  {
    title: 'Automated playbooks',
    description: 'Trigger workflows and alerts with consistent, repeatable actions.',
  },
];

const PricingPage = () => {
  useEffect(() => {
    document.title = 'SIRP | Pricing';
  }, []);

  return (
    <div className="pricing-page">

      <main className="pricing-shell">
        <section className="pricing-hero">
          <div className="pricing-hero__content">
            <span className="pricing-badge">Pricing</span>
            <h1>Choose the right incident response plan for your security operations.</h1>
            <p>Build a resilient response workflow, reduce noise, and unify investigations—all with a modern, dark-first command center.</p>
            <div className="pricing-actions">
              <Link to="/register" className="btn-primary">Start Free Trial</Link>
              <a href="mailto:sales@sirp.io" className="btn-secondary">Talk to Sales</a>
            </div>
          </div>

          <div className="pricing-hero__visual">
            <div className="pricing-hero__card">
              <p className="visual-label">Most popular</p>
              <h2>Professional</h2>
              <p className="visual-price">$149<span>{'/month'}</span></p>
              <p>Automation, AI insights, and priority support for scaling teams.</p>
            </div>
          </div>
        </section>

        <section className="pricing-plans">
          <div className="section-heading">
            <span>Flexible plans</span>
            <h2>Designed for every size of security team</h2>
          </div>

          <div className="pricing-cards">
            {tiers.map((tier) => (
              <article key={tier.name} className={`pricing-card ${tier.recommended ? 'pricing-card--recommended' : ''}`}>
                {tier.recommended && <span className="pricing-ribbon">Recommended</span>}
                <h3>{tier.name}</h3>
                <p className="pricing-card__price">
                  <strong>{tier.price}</strong>
                  <span>{tier.frequency}</span>
                </p>
                <p className="pricing-card__description">{tier.description}</p>
                <ul className="pricing-card__features">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link to="/register" className="pricing-card__cta">Get started</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-highlights">
          {highlights.map((item) => (
            <div key={item.title} className="highlight-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default PricingPage;
