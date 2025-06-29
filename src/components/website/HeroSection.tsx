
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor?: string;
  image?: string;
  imageAlt?: string;
  variant?: 'hero-1' | 'hero-2';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  buttonText,
  backgroundColor = 'bg-gradient-to-r from-blue-600 to-purple-600',
  image,
  imageAlt,
  variant = 'hero-1',
}) => {
  if (variant === 'hero-2') {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {title}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {subtitle}
              </p>
              <Button size="lg" className="text-lg px-8 py-3">
                {buttonText}
              </Button>
            </div>
            <div className="lg:order-last">
              <img
                src={image || '/placeholder.svg'}
                alt={imageAlt || 'Hero image'}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-32 px-6 text-white ${backgroundColor}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl lg:text-2xl mb-8 opacity-90">
          {subtitle}
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
          {buttonText}
        </Button>
      </div>
    </section>
  );
};
