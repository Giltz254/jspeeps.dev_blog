
interface StorySectionProps {
  title: string;
  content: string;
  imageSide?: 'left' | 'right';
  bgColor?: string;
}

const StorySection = ({ title, content, imageSide = 'left', bgColor = 'bg-white' }: StorySectionProps) => {
  return (
    <section className={`py-16 sm:py-20 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          imageSide === 'right' ? 'lg:grid-flow-col-dense' : ''
        }`}>
          {/* Content */}
          <div className={imageSide === 'right' ? 'lg:col-start-1' : ''}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Image placeholder */}
          <div className={`${imageSide === 'right' ? 'lg:col-start-2' : ''}`}>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">✨</span>
                </div>
                <p className="text-gray-600 font-medium">Your Story Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
