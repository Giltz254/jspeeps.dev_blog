import CallToAction from "@/components/custom/about/CallToAction";
import Hero from "@/components/custom/about/Hero";
import StorySection from "@/components/custom/about/StorySection";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="Hi, I'm Sarah"
        subtitle="A passionate writer and tech enthusiast sharing stories that matter"
        description="Welcome to my corner of the internet where I explore the intersection of technology, creativity, and human connection."
        showScrollIndicator={true}
      />

      <div id="main-content">
        <StorySection
          title="My Journey"
          content="It all started with a simple blog post about my first coding experience. What began as a personal journal quickly evolved into something much bigger - a platform where I could share my passion for technology and connect with like-minded individuals around the world.

Over the years, I've had the privilege of working with amazing companies, contributing to open-source projects, and speaking at conferences. But what truly drives me is the opportunity to inspire others and make complex topics accessible to everyone."
          imageSide="left"
        />

        <StorySection
          title="What I Believe"
          content="I believe that technology should be a force for good, bringing people together rather than driving them apart. Through my writing, I strive to bridge the gap between technical complexity and human understanding.

Every line of code tells a story, every product solves a problem, and every innovation has the potential to change lives. My mission is to help others see the beauty and potential in technology while never losing sight of the human element that makes it all worthwhile."
          imageSide="right"
          bgColor="bg-gray-50"
        />

        <StorySection
          title="Beyond the Screen"
          content="When I'm not writing or coding, you'll find me exploring hiking trails with my camera, experimenting with new recipes in the kitchen, or getting lost in a good book. I believe that the best insights come from diverse experiences and fresh perspectives.

I'm also passionate about mentoring aspiring developers and writers, because I know how transformative it can be to have someone believe in your potential. The tech community gave me so much, and I'm committed to paying it forward."
          imageSide="left"
        />
      </div>
      <CallToAction />
    </div>
  );
};

export default About;
