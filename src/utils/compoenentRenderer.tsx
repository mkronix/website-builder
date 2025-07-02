import { Component } from "@/contexts/EditorContext";

export const getComponentCategory = (type: string) => {
  // Extract category from component ID (e.g., "navbar_001" -> "navbar")
  if (type.startsWith('navbar_')) return 'navbar';
  if (type.startsWith('hero_')) return 'hero';
  if (type.startsWith('features_')) return 'features';
  if (type.startsWith('services_')) return 'services';
  if (type.startsWith('about_')) return 'about';
  if (type.startsWith('contact_')) return 'contact';
  if (type.startsWith('footer_')) return 'footer';

  // Fallback to the original type
  return type;
};

export const renderStaticComponent = (component: Component) => {
  const props = component.default_props || {};
  const category = getComponentCategory(component.category);

  switch (category) {
    case 'navbar':
      return (
        <nav className="bg-background shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="text-xl font-bold text-foreground">
                {props.logo?.value || props.logo || 'Brand'}
              </div>
              <div className="hidden md:flex space-x-8">
                {(props.navigation_items || props.links || []).map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.href || item.url || '#'}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {item.label || item.text || `Link ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
            {props.cta_button && (
              <a
                href={props.cta_button.href || '#'}
                className="bg-primary hover:bg-primary/80 text-background px-4 py-2 rounded-md transition-colors"
              >
                {props.cta_button.text || 'CTA'}
              </a>
            )}
          </div>
        </nav>
      );

    case 'hero':
      return (
        <section className="min-h-screen flex items-center bg-gradient-to-r from-background to-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  {props.headline || props.title || 'Welcome to Our Platform'}
                </h1>
                <p className="text-xl text-muted leading-relaxed">
                  {props.subheadline || props.subtitle || 'Build something amazing with our tools and services.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {props.primary_cta && (
                    <a
                      href={props.primary_cta.href || '#'}
                      className="bg-primary hover:bg-primary/80 text-background px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
                    >
                      {props.primary_cta.text || 'Get Started'}
                    </a>
                  )}
                  {props.secondary_cta && (
                    <a
                      href={props.secondary_cta.href || '#'}
                      className="border-2 border-secondary hover:border-primary text-muted px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
                    >
                      {props.secondary_cta.text || 'Learn More'}
                    </a>
                  )}
                </div>
              </div>
              {props.hero_image && (
                <div className="relative">
                  <img
                    src={props.hero_image.src || '/placeholder-image.jpg'}
                    alt={props.hero_image.alt || 'Hero image'}
                    className="rounded-lg shadow-2xl w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-16 bg-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {props.section_title || 'Our Features'}
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                {props.section_subtitle || 'Discover what makes us different'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(props.features || []).map((feature: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary rounded"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title || `Feature ${index + 1}`}
                  </h3>
                  <p className="text-muted">
                    {feature.description || 'Feature description goes here.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {props.section_title || 'Our Services'}
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                {props.section_subtitle || 'Comprehensive solutions for your needs'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(props.services || []).map((service: any, index: number) => (
                <div key={index} className="bg-background rounded-xl shadow-lg p-8 border border-secondary">
                  <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted mb-6">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center text-muted">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  {service.pricing && (
                    <div className="text-2xl font-bold text-primary">{service.pricing}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                {props.headline || 'About Us'}
              </h2>
              <p className="text-xl text-muted max-w-4xl mx-auto leading-relaxed">
                {props.story_content || 'Our story and mission'}
              </p>
            </div>

            {props.values && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {props.values.map((value: any, index: number) => (
                  <div key={index} className="p-6">
                    <h4 className="text-xl font-semibold text-foreground mb-2">{value.title}</h4>
                    <p className="text-muted">{value.description}</p>
                  </div>
                ))}
              </div>
            )}

            {props.stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {props.stats.map((stat: any, index: number) => (
                  <div key={index} className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {props.headline || 'Contact Us'}
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                {props.subheadline || 'Get in touch with us'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-background rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <button className="w-full bg-primary hover:bg-primary/80 text-background py-3 px-6 rounded-lg font-semibold transition-colors">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="bg-secondary/5 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {props.contact_info?.address && (
                    <p className="text-muted">{props.contact_info.address}</p>
                  )}
                  {props.contact_info?.phone && (
                    <p className="text-muted">{props.contact_info.phone}</p>
                  )}
                  {props.contact_info?.email && (
                    <p className="text-muted">{props.contact_info.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">
                  {props.company_info?.logo || props.companyName || 'Company'}
                </h3>
                <p className="text-gray-300 mb-4">
                  {props.company_info?.description || 'Company description goes here.'}
                </p>
              </div>

              {props.navigation_columns?.map((column: any, index: number) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold mb-4">{column.title}</h4>
                  <ul className="space-y-2">
                    {column.links.map((link: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <a href={link.href || '#'} className="text-gray-300 hover:text-white transition-colors">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-300">
                {props.copyright || '© 2025 Company Name. All rights reserved.'}
              </p>
            </div>
          </div>
        </footer>
      );

    default:
      return (
        <div className="p-8 text-center text-muted-foreground bg-secondary/5 border border-secondary rounded-lg">
          <p className="font-medium">Unknown component type: "{component.category}"</p>
          <p className="text-sm mt-2">Category: "{category}"</p>
          {component.react_code && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer">Show raw code</summary>
              <pre className="mt-2 p-3 bg-background rounded text-xs overflow-auto max-h-32 text-foreground">
                {component.react_code}
              </pre>
            </details>
          )}
        </div>
      );
  }
};
