import ScrollIndicatorButton from "./ScrollIndicatorButton";

interface HeroProps {
  title: string;
  subtitle: string;
  description?: string;
  showScrollIndicator?: boolean;
}

const Hero = ({ title, subtitle, description, showScrollIndicator = false }: HeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        {description && (
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {showScrollIndicator && <ScrollIndicatorButton />}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};

export default Hero;
