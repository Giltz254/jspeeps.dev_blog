import SalesContactForm from "./SalesContactForm";
import SupportInfoCards from "./SupportInfoCards";

const ContactFormSection: React.FC = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-xl border border-gray-100">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Contact our sales team
        </h2>
        <SalesContactForm />
      </div>
      <div>
        <SupportInfoCards />
      </div>
    </section>
  );
};

export default ContactFormSection;